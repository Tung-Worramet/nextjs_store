import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

interface CartIconProps {
  itemCount: number;
}

const CartIcon = ({ itemCount }: CartIconProps) => {
  return (
    <Link href="/cart" className="md:hidden relative">
      <ShoppingBag size={20} />
      {itemCount >= 0 && (
        <Badge className="absolute -top-2 -right-2 size-5 rounded-full p-0 flex items-center justify-center">
          {itemCount > 99 ? "99+" : itemCount}
        </Badge>
      )}
    </Link>
  );
};
export default CartIcon;
