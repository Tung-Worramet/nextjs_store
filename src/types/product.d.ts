import { Product, ProductImage } from "@prisma/client";
import { CategoryType } from "@/types/category";

export interface ProductType extends Product {
  category: CategoryType;
  lowStock: number;
  sku: string;
  mainImage: Pick<ProductImage, "url">
}
