"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import ProductCard from "./product-card";
import SectionHeader from "./section-header";

function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then((products) => setFeaturedProducts(products.slice(0, 8)))
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="w-full bg-[#FBF7EE]/60 py-16 md:py-20">
      <div className="container mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow="SHop Now"
          title="Our Products"
          description="Quality products, delivered to your door."
          viewAllHref="/products"
          viewAllLabel="View all products"
        />
        {error ? (
          <p role="alert" className="text-center py-12 text-red-400">{error}</p>
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3 rounded-xl bg-white p-4 ring-1 ring-zinc-200">
                <div className="aspect-square animate-pulse rounded-lg bg-zinc-100" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-100" />
              </div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <p className="text-center py-12 text-zinc-500">No featured products are available.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(212,175,55,0.25)]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;
