import { User } from "@prisma/client";

// สร้าง interface ใหม่ ที่ตัดฟิลด์บางตัวออก โดยใช้ Omit ตัดฟิลด์ที่ไม่ต้องการ
export interface UserType
  extends Omit<User, "password" | "pictureId" | "createdAt" | "updatedAt"> {}
