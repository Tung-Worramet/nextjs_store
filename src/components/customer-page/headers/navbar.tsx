import { UserType } from "@/types/user";
import { Divide } from "lucide-react";
import MobileMenu from "./mobile-menu";
import CartIcon from "./cart-icon";
import { DesktopNavLinks } from "./navlinks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DesktopUserMenu from "./desktop-user-menu";
import { getCartItemCount, getUserCart } from "@/features/carts/db/carts";

interface NavbarProps {
  user: UserType | null;
}

const Navbar = async ({ user }: NavbarProps) => {
  // นับจํานวนสินค้าทุกชิ้นในตะกร้า เช่น ถ้ามีสินค้าอันเดียวกันแต่เพิ่มมา 5 ชิ้น จะแสดงเลข 5
  // const itemCount = user ? await getCartItemCount(user.id) : 0;

  // นับจํานวนสินค้าในตะกร้า เช่น ถ้ามีสินค้าอันเดียวกันแต่เพิ่มมาหลายชิ้น จะแสดงเลข 1
  const cart = user ? await getUserCart(user.id) : null;
  const itemCount = cart ? cart.items.length : 0;

  return (
    <nav className="flex items-center gap-3">
      {/* Mobile Navigation */}
      {/* ถ้า user login เข้ามาจะแสดงตะกร้า ถ้าไม่ได้ login จะไม่แสดงตะกร้า */}
      {user && <CartIcon itemCount={itemCount} />}
      <MobileMenu user={user} />

      {/* Desktop Navigation */}
      <div className="hidden md:flex md:items-center">
        <DesktopNavLinks />

        {/*  ถ้า user login จะเมนู user ถ้าไม่จะแสดงปุ่ม signin */}
        {user ? (
          <DesktopUserMenu user={user} itemCount={itemCount} />
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
