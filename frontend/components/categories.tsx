"use client";

import { useEffect, useState } from "react";
import { getAllCategories, getCategoriesForProducts } from "@/lib/data";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import CategoryCard from "./category-card";

function Categories() {
  const [categories, setCategories] = useState(getAllCategories());
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((products: Product[]) => setCategories(getCategoriesForProducts(products)))
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8 cursor-pointer">
        <h2 className="text-5xl font-bold mb-8">
          <span style={{ color: "#D4AF37" }}>Pick</span> Your{" "}
          <span style={{ color: "#D4AF37" }}>Preference</span>
        </h2>
        {error ? (
          <p role="alert" className="py-12 text-center text-red-400">{error}</p>
        ) : isLoading ? (
          <p className="py-12 text-center text-zinc-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="py-12 text-center text-zinc-500">No categories are available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;