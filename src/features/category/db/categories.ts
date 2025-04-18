import { db } from "@/lib/db";

export const getCategories = async () => {
  try {
    const categories = await db.category.findMany({
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
