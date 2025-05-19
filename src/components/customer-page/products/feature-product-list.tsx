"use client";

import { ProductType } from "@/types/product";
import ProductCard from "./product-card";
import { useState } from "react";
import { CategoryType } from "@/types/category";

interface FeatureProductListProps {
  products: ProductType[];
  categories: CategoryType[];
}
const FeatureProductList = ({
  products,
  categories,
}: FeatureProductListProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (product) => product.category?.name === selectedCategory
        );

  return (
    <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="md:col-span-1 md:block ">
        <div className="bg-white p-4 rounded-xl shadow border border-gray-200 space-y-2">
          <h2 className="text-2xl font-semibold text-neutral-700 mb-2">
            หมวดหมู่
          </h2>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`block w-full text-left px-4 py-2 rounded-lg transition font-medium text-sm ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            ทั้งหมด
          </button>
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category.name)}
              className={`block w-full text-left px-4 py-2 rounded-lg transition font-medium text-sm ${
                selectedCategory === category.name
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </aside>

      {/* Products */}
      <section className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </section>
    </div>
  );
};
export default FeatureProductList;
