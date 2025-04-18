import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

// ดึง tag สำหรับแคชข้อมูลผู้ใช้ทั้งหมด
export const getUserGlobalTag = () => {
  return getGlobalTag("users");
};

// ดึง tag สำหรับแคชผู้ใช้เฉพาะรายตาม ID
export const getUserIdTag = (id: string) => {
  return getIdTag("users", id);
};

// รีเฟรช cache ของผู้ใช้ เหมาะสำหรับเรียกหลัง update หรือ delete
export const revalidateUserCache = (id: string) => {
  revalidateTag(getUserGlobalTag());
  revalidateTag(getUserIdTag(id));
};
