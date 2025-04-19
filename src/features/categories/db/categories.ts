import { db } from "@/lib/db";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { getCategoryGlobalTag, revalidateCategoryCache } from "./cache";
import { categorySchema } from "@/features/categories/schemas/categories";
import { authCheck } from "@/features/auths/db/auths";
import {
  canCreateCategory,
  canUpdateCategory,
} from "@/features/categories/permissions/categories";
import { redirect } from "next/navigation";

interface CreateCategoryInput {
  name: string;
}

interface UpdateCategoryInput {
  id: string;
  name: string;
}

export const getCategories = async () => {
  "use cache";

  cacheLife("days");
  cacheTag(getCategoryGlobalTag());

  try {
    const categories = await db.category.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    return categories;
  } catch (error) {
    console.error("Error getting categories data:", error);
    return [];
  }
};

export const createCategory = async (input: CreateCategoryInput) => {
  const user = await authCheck();

  if (!user || !canCreateCategory(user)) {
    redirect("/");
  }

  try {
    const { success, data, error } = categorySchema.safeParse(input);

    if (!success) {
      return {
        message: "Please enter valid data",
        error: error.flatten().fieldErrors,
      };
    }

    // Check category already exists
    const category = await db.category.findFirst({
      where: {
        name: data.name,
      },
    });

    if (category) {
      return {
        message: "A category with this name already exists",
      };
    }

    // Create new category
    const newCategory = await db.category.create({
      data: {
        name: data.name,
      },
    });

    // สร้าง category ใหม่สำเร็จ และจะรีเฟรชแคช category ทั้งหมด
    revalidateCategoryCache(newCategory.id);
  } catch (error) {
    console.error("Error creating new category:", error);
    return {
      message: "Someting went wrong. Plase try again later",
    };
  }
};

export const updateCategory = async (input: UpdateCategoryInput) => {
  const user = await authCheck();

  if (!user || !canUpdateCategory(user)) {
    redirect("/");
  }

  try {
    const { success, data, error } = categorySchema.safeParse(input);

    if (!success) {
      return {
        message: "Please enter valid data",
        error: error.flatten().fieldErrors,
      };
    }

    // Check if category exists
    const existsingCategory = await db.category.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!existsingCategory) {
      return {
        message: "Category not found",
      };
    }

    // Check if another category with the same name already exists
    const duplicateCategory = await db.category.findFirst({
      where: {
        name: data.name,
        id: {
          not: input.id, // สมมุติว่ากำลังจะแก้ไข id = 5 และตั้งชื่อว่า "ของกิน" โค้ดนี้จะไปตรวจสอบว่า มี category อื่นที่ชื่อ "ของกิน" อยู่แล้วหรือไม่ (ยกเว้น ID ตัวเอง )
        },
      },
    });

    if (duplicateCategory) {
      return {
        message: "A category with this name already exists",
      };
    }

    // Update category
    const updatedCategory = await db.category.update({
      where: {
        id: input.id,
      },
      data: {
        name: data.name,
      },
    });

    // Update category สำเร็จ และจะรีเฟรชแคช category ทั้งหมด
    revalidateCategoryCache(updatedCategory.id);
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      message: "Someting went wrong. Plase try again later",
    };
  }
};
