import FeatureProductList from "@/components/customer-page/products/feature-product-list";
import { getCategories } from "@/features/categories/db/categories";
import { getFeatureProducts } from "@/features/products/db/products";

const ProductPage = async () => {
  const products = await getFeatureProducts();
  const categories = await getCategories();

  return <FeatureProductList products={products} categories={categories} />;
};
export default ProductPage;
