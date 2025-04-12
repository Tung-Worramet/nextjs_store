import { UserType } from "@/types/user";
import { Divide } from "lucide-react";
import MobileMenu from "./mobile-menu";
import CartIcon from "./cart-icon";
import { DesktopNavLinks } from "./navlinks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DesktopUserMenu from "./desktop-user-menu";

interface NavbarProps {
  user: UserType | null;
}

const Navbar = ({ user }: NavbarProps) => {
  return (
    <nav className="flex items-center gap-3">
      {/* Mobile Navigation */}
      {/* ถ้า user login เข้ามาจะแสดงตะกร้า ถ้าไม่ได้ login จะไม่แสดงตะกร้า */}
      {user && <CartIcon />}
      <MobileMenu user={user} />

      {/* Desktop Navigation */}
      <div className="hidden md:flex md:items-center">
        <DesktopNavLinks />

        {/*  ถ้า user login จะเมนู user ถ้าไม่จะแสดงปุ่ม signin */}
        {user ? (
          <DesktopUserMenu user={user} />
        ) : (
          <Button size="sm" asChild>
            <Link href="/auth/signin">เข้าสู่ระบบ</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
