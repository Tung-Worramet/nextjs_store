import { Button } from "@/components/ui/button";
import { getFeatureProducts } from "@/features/products/db/products";
import { ArrowRight, Sparkle } from "lucide-react";
import Link from "next/link";
import ProductCard from "../products/product-card";

const FeatureProducts = async () => {
  const products = await getFeatureProducts();

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center px-4 py-1.5 mb-2 gap-2 rounded-full border border-primary/60">
            <Sparkle size={14} />
            <span>สินค้าแนะนํา</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold">
            สินค้าขายดีประจำสัปดาห์
          </h2>
        </div>

        <Button variant="ghost" className="group" asChild>
          <Link href="/products">
            <span>ดูสินค้าทั้งหมด</span>
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </section>
  );
};
export default FeatureProducts;
