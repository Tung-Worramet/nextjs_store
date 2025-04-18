import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

// สร้าง tag สำหรับแคช category ทั้งหมด
export const getCategoryGlobalTag = () => {
  return getGlobalTag("categories");
};

// สร้าง tag สำหรับแคช category เฉพาะตาม ID
export const getCategoryIdTag = (id: string) => {
  return getIdTag("categories", id);
};

// รีเฟรชแคช category ทั้งหมด และ category ตาม ID ที่ระบุ
export const revalidateCategoryCache = (id: string) => {
  revalidateTag(getCategoryGlobalTag());
  revalidateTag(getCategoryIdTag(id));
};
