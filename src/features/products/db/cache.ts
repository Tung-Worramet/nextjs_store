import { getGlobalTag, getIdTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

// ดึง tag รวมของ product ทั้งหมด 
// ใช้สำหรับการจัดการ cache ระดับ global เช่นตอนอัปเดตรายการทั้งหมด
export const getProductGlobalTag = () => {
    return getGlobalTag("products")
}

// ดึง tag สำหรับ product รายตัวตาม id 
// ใช้สำหรับจัดการ cache ของสินค้าชิ้นเดียว
export const getProductIdTag = (id: string) => {
    return getIdTag("products", id)
}

// ทำการรีเฟรช cache ของ product ทั้งหมด และของ product รายตัว 
// ใช้เมื่อมีการแก้ไขข้อมูลของ product เพื่อให้ข้อมูลล่าสุดแสดงผลทันที
export const revalidateProductCache = (id: string) => {
    revalidateTag(getProductGlobalTag());
    revalidateTag(getProductIdTag(id));
};