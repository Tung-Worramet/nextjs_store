import { signupSchema, signinSchema } from "@/features/auths/schemas/auths";
import { revalidateUserCache } from "@/features/users/db/cache";
import { getUserById } from "@/features/users/db/users";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { cookies, headers } from "next/headers";

interface signupInput {
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface signinInput {
  email: string;
  password: string;
}

const generateJwtToken = async (userId: string) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
  return await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt() // iat: ms
    .setExpirationTime("30d")
    .sign(secret);
};

const setCookieToken = async (token: string) => {
  const cookie = await cookies();
  cookie.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
};

export const signup = async (input: signupInput) => {
  try {
    const { success, data, error } = signupSchema.safeParse(input);

    if (!success) {
      return {
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        error: error.flatten().fieldErrors,
      };
    }

    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (user) {
      return {
        message: "อีเมลนี้ถูกใช้ไปแล้ว",
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const token = await generateJwtToken(newUser.id);
    await setCookieToken(token);

    // ล้าง cache ทั้งหมดของ user หลังจากที่มีการสร้าง user ใหม่
    revalidateUserCache(newUser.id);
  } catch (error) {
    console.error("Error signup user:", error);
    return {
      message: "เกิดข้อผิดพลาดในการสมัครสมาชิก",
    };
  }
};

export const signin = async (input: signinInput) => {
  try {
    const { success, data, error } = signinSchema.safeParse(input);

    if (!success) {
      return {
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        error: error.flatten().fieldErrors,
      };
    }

    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return {
        message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      };
    }

    if (user.status !== "Active") {
      return {
        message: "บัญชีของคุณถูกระงับการใช้งาน",
      };
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return {
        message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      };
    }

    const token = await generateJwtToken(user.id);
    await setCookieToken(token);
  } catch (error) {
    console.error("Error signin user:", error);
    return {
      message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
    };
  }
};

export const authCheck = async () => {
  const userId = (await headers()).get("x-user-id");
  return userId ? await getUserById(userId) : null;
};

export const signout = async () => {
  try {
    const cookie = await cookies();
    cookie.delete("token");
  } catch (error) {
    console.error("Error signout user:", error);
    return { message: "เกิดข้อผิดพลาดในการออกจากระบบ" };
  }
};
