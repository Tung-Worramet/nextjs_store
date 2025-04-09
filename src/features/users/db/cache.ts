import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

// ดึง tag ที่ใช้สำหรับ cache ข้อมูล user ทั้งหมด
export const getUserGlobalTag = () => {
    return getGlobalTag("users")
}

// ดึง tag เฉพาะของผู้ใช้ตาม id เพื่อใช้แยก cache ราย user
export const getUserIdTag = (id: string) => {
    return getIdTag("users", id)
}

// ล้าง cache เหมาะสำหรับเรียกหลังจาก update หรือ delete user
export const revalidateUserCache = (id: string) => {
    revalidateTag(getUserGlobalTag())
    revalidateTag(getUserIdTag(id))
}