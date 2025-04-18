import { User } from "@prisma/client";

// สร้าง interface ใหม่ ที่ตัดฟิลด์บางตัวออก โดยใช้ Omit ตัดฟิลด์ที่ไม่ต้องการ
// export interface UserType
//   extends Omit<User, "password" | "pictureId" | "createdAt" | "updatedAt"> {}

// แก้บัค แบบข้างบนก็ใช้งานได้
export type UserType = Omit<
  User,
  "password" | "pictureId" | "createdAt" | "updatedAt"
>;
