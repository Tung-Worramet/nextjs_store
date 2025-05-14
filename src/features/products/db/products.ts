import { db } from "@/lib/db";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { getProductGlobalTag, getProductIdTag, revalidateProductCache } from "@/features/products/db/cache";
import { authCheck } from "@/features/auths/db/auths";
import { redirect } from "next/navigation";
import { productSchema } from "@/features/products/schemas/products";
import { canCreateProduct, canUpdateProduct } from "@/features/products/permissions/products";
import { deleteFromImageKit } from "@/lib/imageKit";
import { ProductStatus } from "@prisma/client";

interface CreateProductInput {
  title: string;
  description: string;
  cost?: number;
  basePrice: number;
  price: number;
  stock: number;
  categoryId: string;
  images: Array<{ url: string, fileId: string }>
  mainImageIndex: number;
}

export const getProducts = async (page: number, limit = 2) => {
  "use cache"

  cacheLife("hours");
  cacheTag(getProductGlobalTag());

  const skip = (page - 1) * limit;

  try {
    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
          images: true
        },
      }),
      db.product.count()
    ])

    // const products = await db.product.findMany({
    //   orderBy: {
    //     createdAt: "desc"
    //   },
    //   include: {
    //     category: {
    //       select: {
    //         id: true,
    //         name: true,
    //         status: true,
    //       },
    //     },
    //     images: true
    //   },
    // });

    // const totalCount = await db.product.count();

    return {
      products: products.map((product) => {
        const mainImage = product.images.find((image) => image.isMain)

        return {
          ...product,
          lowStock: 5,
          sku: product.id.substring(0, 8).toUpperCase(),
          mainImage
        }
      }),
      totalCount
    }
  } catch (error) {
    console.error("Error getting products data:", error);
    return {
      products: [],
      totalCount: 0
    }
  }
};

export const getProductById = async (id: string) => {
  "use cache";

  cacheLife("hours");
  cacheTag(getProductIdTag(id));

  try {
    const product = await db.product.findFirst({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        images: true
      }
    })

    if (!product) {
      return null
    }

    // หารูปภาพหลักของสินค้า
    const mainImage = product.images.find((image) => image.isMain)

    // หา Index ของรูปภาพหลัก
    const mainImageIndex = mainImage ? product.images.findIndex((image) => image.isMain) : 0

    return {
      ...product,
      lowStock: 5,
      sku: product.id.substring(0, 8).toUpperCase(),
      mainImage: mainImage || null,
      mainImageIndex
    }
  } catch (error) {
    console.error("Error getting product by id:", error);
    return null;
  }
}

export const getFeatureProducts = async () => {
  "use cache"

  cacheLife("hours");
  cacheTag(getProductGlobalTag());

  try {
    const products = await db.product.findMany({
      take: 8,
      where: {
        status: "Active"
      },
      orderBy: {
        sold: "desc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        images: true
      }
    })

    return products.map((product) => {
      const mainImage = product.images.find((image) => image.isMain)

      return {
        ...product,
        lowStock: 5,
        sku: product.id.substring(0, 8).toUpperCase(),
        mainImage
      }
    })
  } catch (error) {
    console.error("Error getting featured products:", error);
    return [];
  }
}

export const createProduct = async (input: CreateProductInput) => {
  const user = await authCheck();

  if (!user || !canCreateProduct(user)) {
    redirect("/");
  }

  try {
    const { success, data, error } = productSchema.safeParse(input)

    if (!success) {
      return {
        message: "Please enter valid product information",
        error: error.flatten().fieldErrors
      }
    }

    // Check if category exists
    const category = await db.category.findUnique({
      where: {
        id: data.categoryId,
        status: "Active"
      }
    })

    if (!category) {
      return {
        message: "Select category not found or inactive"
      }
    }

    // Create new product
    const newProduct = await db.$transaction(async (prisma) => { // คำสั่ง db.$transaction ถ้าเกิด Error ในขั้นตอนใดจะ Rollback ข้อมูลทั้งหมด ไม่ทิ้งข้อมูลที่บันทึกค้างไว้
      const product = await db.product.create({
        data: {
          title: data.title,
          description: data.description,
          cost: data.cost,
          basePrice: data.basePrice,
          price: data.price,
          stock: data.stock,
          categoryId: data.categoryId
        }
      })

      // บันทึกรูปภาพสินค้า
      if (input.images && input.images.length > 0) {
        // ใช้ Promise.all เพื่อให้ บันทึกหลาย ๆ รูปพร้อมกันแบบ async
        await Promise.all(
          input.images.map((image, index) => {
            return prisma.productImage.create({
              data: {
                url: image.url,
                fileId: image.fileId,
                isMain: input.mainImageIndex === index,
                productId: product.id
              }
            })
          })
        )
      }

      return product
    })

    revalidateProductCache(newProduct.id)
  } catch (error) {
    console.error("Error creating new product:", error)
    return {
      message: "Something went wrong. Please try again later",
    };
  }
}

export const updateProduct = async (input: CreateProductInput & { id: string, deletedImageIds: string[] }) => {
  const user = await authCheck();

  if (!user || !canUpdateProduct(user)) {
    redirect("/");
  }

  try {
    const { success, data, error } = productSchema.safeParse(input)

    if (!success) {
      return {
        message: "Please enter valid product information",
        error: error.flatten().fieldErrors
      }
    }

    const existingProduct = await db.product.findUnique({
      where: {
        id: input.id
      },
      include: {
        images: true
      }
    })

    if (!existingProduct) {
      return {
        message: "Product not found"
      }
    }

    const category = await db.category.findUnique({
      where: {
        id: data.categoryId,
        status: "Active"
      }
    })

    if (!category) {
      return {
        message: "Selected category not found or inactive"
      }
    }

    if (input.deletedImageIds && input.deletedImageIds.length > 0) {
      for (const deletedImageId of input.deletedImageIds) {
        const imageToDelete = existingProduct.images.find((image) => image.id === deletedImageId)

        if (imageToDelete) {
          await deleteFromImageKit(imageToDelete.fileId)
        }
      }
    }

    const updatedProduct = await db.$transaction(async (prisma) => {
      // 1. อัพเดทข้อมูลสินค้า
      const product = await prisma.product.update({
        where: {
          id: input.id
        },
        data: {
          title: data.title,
          description: data.description,
          cost: data.cost,
          basePrice: data.basePrice,
          price: data.price,
          stock: data.stock,
          categoryId: data.categoryId
        }
      })

      // 2. ลบรูปภาพที่ถูกเลือกให้ลบจากฐานข้อมูล
      if (input.deletedImageIds && input.deletedImageIds.length > 0) {
        await prisma.productImage.deleteMany({
          where: {
            id: {
              in: input.deletedImageIds
            },
            productId: product.id
          }
        })
      }

      // 3. เซ็ต isMain ให้เป็น false ทั้วหมด
      await prisma.productImage.updateMany({
        where: {
          productId: product.id
        },
        data: {
          isMain: false
        }
      })

      // 4. เพิ่มรูปภาพใหม่เข้าไป
      if (input.images && input.images.length > 0) {
        await Promise.all(
          input.images.map((image) => {
            return prisma.productImage.create({
              data: {
                url: image.url,
                fileId: image.fileId,
                isMain: false,
                productId: product.id
              }
            })
          })
        )
      }

      // 5. ค้นหารูปทั้งหมดและตั้งค่าภาพ
      const allImages = await prisma.productImage.findMany({
        where: {
          productId: product.id
        },
        orderBy: {
          createdAt: "asc"
        }
      })

      if (allImages.length > 0) {
        const validIndex = Math.min(input.mainImageIndex, allImages.length - 1)
        if (validIndex >= 0) {
          await prisma.productImage.update({
            where: {
              id: allImages[validIndex].id
            },
            data: {
              isMain: true
            }
          })
        }
      }

      return product
    })

    revalidateProductCache(updatedProduct.id)
  } catch (error) {
    console.error("Error updating product:", error)
    return {
      message: "Something went wrong. Please try again later",
    }
  }
}

export const changeProductStatus = async (id: string, status: ProductStatus) => {
  const user = await authCheck();

  if (!user || !canUpdateProduct(user)) {
    redirect("/");
  }

  try {
    const product = await db.product.findUnique({
      where: {
        id
      }
    })

    if (!product) {
      return {
        message: "Product not found"
      }
    }

    if (product.status === status) {
      return {
        message: `Product is already ${status.toLowerCase()}`
      }
    }

    const updatedProduct = await db.product.update({
      where: {
        id
      },
      data: {
        status
      }
    })

    revalidateProductCache(updatedProduct.id)
  } catch (error) {
    console.error("Error changing product status:", error)
    return {
      message: "Something went wrong. Please try again later",
    }
  }
}