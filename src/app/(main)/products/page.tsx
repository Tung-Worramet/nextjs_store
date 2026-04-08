import { getProducts } from "@/features/products/db/products";
import ProductCard from "@/components/customer-page/products/product-card";
import { Sparkle } from "lucide-react";

export const metadata = {
  title: "สินค้าทั้งหมด - IT Store",
};

const ProductsPage = async () => {
  const { products } = await getProducts(1, 40); // Fetch up to 40 products for display

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center px-4 py-1.5 mb-2 gap-2 rounded-full border border-primary/60">
            <Sparkle size={14} />
            <span>สินค้าของเรา</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold">
            สินค้าทั้งหมด
          </h1>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} product={product as any} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center flex-col items-center py-20 text-muted-foreground border border-dashed rounded-lg">
          <p className="text-lg">ไม่มีสินค้าในขณะนี้</p>
        </div>
      )}
    </div>
  );
};
export default ProductsPage;
