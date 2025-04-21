import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

// ดึง tag รวมของหมวดหมู่ (categories)
// ใช้สำหรับจัดการ cache ในระดับรวมของหมวดหมู่ทั้งหมด
export const getCategoryGlobalTag = () => {
  return getGlobalTag("categories");
};

// ดึง tag สำหรับหมวดหมู่รายตัวตาม id
// ใช้สำหรับจัดการ cache ของหมวดหมู่เฉพาะรายการ
export const getCategoryIdTag = (id: string) => {
  return getIdTag("categories", id);
};

// ทำการรีเฟรช cache ของหมวดหมู่ทั้งหมด และหมวดหมู่รายตัว
// ใช้เมื่อมีการแก้ไขหรืออัปเดตข้อมูลของหมวดหมู่ เพื่อให้ข้อมูลล่าสุดถูกโหลดใหม่
export const revalidateCategoryCache = (id: string) => {
  revalidateTag(getCategoryGlobalTag());
  revalidateTag(getCategoryIdTag(id));
};
