import { UserType } from "@/types/user";
import { Divide } from "lucide-react";
import MobileMenu from "./mobile-menu";
import CartIcon from "./cart-icon";

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
      <div className="hidden">
        <div>Desktop Links</div>

        {/*  ถ้า user login จะเมนู user ถ้าไม่จะแสดงปุ่ม signin */}
        {user ? <div>Desktop User Menu</div> : <div>Go to signin button</div>}
      </div>
    </nav>
  );
};
export default Navbar;
