"use client";

import { useEffect, useState } from "react";
import { getAllCategories, getCategoriesForProducts } from "@/lib/data";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import CategoryCard from "./category-card";
import SectionHeader from "./section-header";

interface CategoriesProps {
  /** Show at most this many categories (all when omitted). */
  limit?: number;
  /** Adds a "View all" link to the heading. */
  viewAllHref?: string;
}

function Categories({ limit, viewAllHref }: CategoriesProps) {
  const [categories, setCategories] = useState(getAllCategories());
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((products: Product[]) => setCategories(getCategoriesForProducts(products)))
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, []);

  const visibleCategories = limit ? categories.slice(0, limit) : categories;

  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="container mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow="Shop by category"
          title="Pick your preference"
          description="Find what you need by browsing our collections."
          viewAllHref={viewAllHref}
          viewAllLabel="All categories"
        />
        {error ? (
          <p role="alert" className="py-12 text-center text-red-400">{error}</p>
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="aspect-4/5 animate-pulse rounded-2xl bg-zinc-100" />
            ))}
          </div>
        ) : visibleCategories.length === 0 ? (
          <p className="py-12 text-center text-zinc-500">No categories are available.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {visibleCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;
