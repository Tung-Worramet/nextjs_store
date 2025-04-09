import { User } from "@prisma/client"

// Omit ใช้ตัดฟิลด์ที่ไม่ต้องการ
export interface UserType extends Omit<User, "password" | "pictureId" | "createdAt" | "updatedAt"> { }
