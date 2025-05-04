import { ProductType } from "@/types/product";

export interface CartItem {
  id: string;
  count: number;
  price: number;
  product: ProductType;
}

export interface CartType extends Cart {
  items: CartItem[];
  itemCount: number;
}
