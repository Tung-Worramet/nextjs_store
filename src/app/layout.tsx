import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "My Next.js App | E-commerce",
    template: "%s | E-commerce",
  },
  description:
    "ร้านค้าออนไลน์สำหรับสินค้าไอทีที่ดีที่สุด พร้อมบริการจัดส่งและราคาที่คุ้มค่า",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
};
export default RootLayout;
