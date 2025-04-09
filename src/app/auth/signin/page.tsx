import AuthForm from "@/features/auths/components/auth-form";
import AuthHeader from "@/features/auths/components/auth-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ",
  description:
    "ร้านค้าออนไลน์สำหรับสินค้าไอทีที่ดีที่สุด พร้อมบริการจัดส่งและราคาที่คุ้มค่า",
};

const SigninPage = () => {
  const type = "signin";

  return (
    <AuthHeader type={type}>
      <AuthForm type={type} />
    </AuthHeader>
  );
};
export default SigninPage;
