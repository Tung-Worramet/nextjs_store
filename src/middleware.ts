import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

interface Payload extends jose.JWTPayload {
  id: string;
}

const decryptToken = async (token: string): Promise<Payload | null> => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const { payload } = await jose.jwtVerify(token, secret);

    return payload as Payload; // แปลง payload ให้เป็นรูปแบบที่เรากำหนด
  } catch (error) {
    console.error("Error decrypting token", error);
    return null;
  }
};

export const middleware = async (req: NextRequest) => {
  const response = NextResponse.next();

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return response;
  }

  const payload = await decryptToken(token);
  const isTokenExpired = payload?.exp && payload.exp < Date.now() / 1000;

  if (!payload || isTokenExpired) {
    response.cookies.delete("token");
    return response;
  }

  response.headers.set("x-user-id", payload.id);
  return response;
};

export const config = {
  matcher: ["/", "/auth/:path*", "/admin/:path*", "/cart/:path*", "/checkout/:path*"],
};
