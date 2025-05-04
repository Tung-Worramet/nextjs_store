import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { getCartTag, revalidateCartCache } from "@/features/carts/db/cache";
import { authCheck } from "@/features/auths/db/auths";
import { canUpdateUserCart } from "../permissions/cart";

interface AddToCartInput {
  productId: string;
  count: number;
}

interface UpdateCartInput {
  cartItemId: string;
  newCount: number;
}

export const getUserCart = async (userId: string | null) => {
  "use cache";

  if (!userId) {
    redirect("/auth/signin");
  }

  cacheLife("hours");
  cacheTag(getCartTag(userId));

  try {
    const cart = await db.cart.findFirst({
      where: {
        orderedById: userId,
      },
      include: {
        products: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            product: {
              include: {
                images: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!cart) return null;

    const cartwithDetails = {
      ...cart,
      items: cart.products.map((item) => {
        const mainImage = item.product.images.find((image) => image.isMain);

        return {
          id: item.id,
          count: item.count,
          price: item.price,
          product: {
            ...item.product,
            mainImage: mainImage || null,
            lowStock: 5,
            sku: item.product.id.substring(0, 8).toUpperCase(),
          },
        };
      }),
      itemCount: cart.products.reduce((sum, item) => sum + item.count, 0),
    };

    return cartwithDetails;
  } catch (error) {
    console.error("Error getting user cart:", error);
    return null;
  }
};

export const getCartItemCount = async (userId: string | null) => {
  "use cache";

  if (!userId) {
    redirect("/auth/signin");
  }

  cacheLife("hours");
  cacheTag(getCartTag(userId));

  try {
    const cart = await db.cart.findFirst({
      where: {
        orderedById: userId,
      },
      include: {
        products: true,
      },
    });

    if (!cart) return 0;

    return cart.products.reduce((sum, item) => sum + item.count, 0);
  } catch (error) {
    console.error("Error getting cart item count:", error);
    return 0;
  }
};

const recalculateCartTotal = async (cartId: string) => {
  const cartItems = await db.cartItem.findMany({
    where: {
      cartId: cartId,
    },
  });

  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

  await db.cart.update({
    where: {
      id: cartId,
    },
    data: {
      cartTotal: cartTotal,
    },
  });
};

export const addToCart = async (input: AddToCartInput) => {
  const user = await authCheck();

  if (!user || !canUpdateUserCart(user)) {
    redirect("/auth/signin");
  }

  try {
    const product = await db.product.findUnique({
      where: {
        id: input.productId,
        status: "Active",
      },
    });

    if (!product) {
      return {
        message: "ไม่พบสินค้า",
      };
    }

    if (product.stock < input.count) {
      return {
        message: "จํานวนสินค้าไม่พอ",
      };
    }

    let cart = await db.cart.findFirst({
      where: {
        orderedById: user.id,
      },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: {
          cartTotal: 0,
          orderedById: user.id,
        },
      });
    }

    const exitingProduct = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: input.productId,
      },
    });

    if (exitingProduct) {
      await db.cartItem.update({
        where: {
          id: exitingProduct.id,
        },
        data: {
          count: exitingProduct.count + input.count,
          price: (exitingProduct.count + input.count) * product.price,
        },
      });
    } else {
      await db.cartItem.create({
        data: {
          count: input.count,
          price: input.count * product.price,
          cartId: cart.id,
          productId: product.id,
        },
      });
    }

    await recalculateCartTotal(cart.id);

    revalidateCartCache(user.id);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return {
      message: "เกิดข้อผิดพลาดในการเพิ่มสินค้าลงในตะกร้า",
    };
  }
};

export const updateCartItem = async (input: UpdateCartInput) => {
  const user = await authCheck();

  if (!user || !canUpdateUserCart(user)) {
    redirect("/auth/signin");
  }

  try {
    if (input.newCount < 1) {
      return {
        message: "จํานวนสินค้าต้องมีอย่างน้อย 1 ชิ้น",
      };
    }

    const cartItem = await db.cartItem.findFirst({
      where: {
        id: input.cartItemId,
      },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem || cartItem.cart.orderedById !== user.id) {
      return {
        message: "ไม่พบรายการสินค้าในตะกร้า",
      };
    }

    if (cartItem.product.stock < input.newCount) {
      return {
        message: "จํานวนสินค้าไม่เพียงพอ",
      };
    }

    await db.cartItem.update({
      where: {
        id: input.cartItemId,
      },
      data: {
        count: input.newCount,
        price: input.newCount * cartItem.product.price,
      },
    });

    await recalculateCartTotal(cartItem.cartId);

    revalidateCartCache(user.id);
  } catch (error) {
    console.error("Error updating cart item:", error);
    return {
      message: "เกิดข้อผิดพลาดในการอัพเดทตะกร้าสินค้า",
    };
  }
};

export const removeFromCart = async (cartItemId: string) => {
  const user = await authCheck();

  if (!user || !canUpdateUserCart(user)) {
    redirect("/auth/signin");
  }

  try {
    const cartItem = await db.cartItem.findUnique({
      where: {
        id: cartItemId,
      },
      include: {
        cart: true,
      },
    });

    if (!cartItem || cartItem.cart.orderedById !== user.id) {
      return {
        message: "ไม่พบรายการสินค้าในตะกร้า",
      };
    }

    await db.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    await recalculateCartTotal(cartItem.cartId);

    revalidateCartCache(user.id);
  } catch (error) {
    console.error("Error removing from cart:", error);
    return {
      message: "ไม่สามารถลบรายการสินค้านี้ออกจากตะกร้าได้",
    };
  }
};

export const clearCart = async () => {
  const user = await authCheck();

  if (!user || !canUpdateUserCart(user)) {
    redirect("/auth/signin");
  }

  try {
    const cart = await db.cart.findFirst({
      where: {
        orderedById: user.id,
      },
    });

    if (!cart) {
      return {
        message: "ตะกร้าของคุณว่างเปล่า",
      };
    }

    await db.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    await db.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        cartTotal: 0,
      },
    });

    revalidateCartCache(user.id);
  } catch (error) {
    console.error("Error clearing cart:", error);
    return {
      message: "ไม่สามารถเคลียร์ตะกร้าได้",
    };
  }
};
