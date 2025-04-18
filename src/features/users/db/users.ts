import { db } from "@/lib/db";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { getUserIdTag } from "./cache";

export const getUserById = async (id: string) => {
  "use cache";

  cacheLife("hours"); // จะเก็บ cache ไว้ 1 ชั่วโมง แล้วถึงจะไปเรียกข้อมูลใหม่
  cacheTag(getUserIdTag(id)); // จะทำให้ cache ของ user ทั้งหมดถูกลบเมื่อมีการเปลี่ยนแปลงข้อมูลในตาราง user

  try {
    const user = await db.user.findUnique({
      where: {
        id: id,
        status: "Active",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        address: true,
        picture: true,
        tel: true,
      },
    });
    console.log(user);

    return user;
  } catch (error) {
    console.error("Error getting user by id:", error);
    return null;
  }
};
