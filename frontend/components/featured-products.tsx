"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import ProductCard from "./product-card";

function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pinkColor = "#D4AF37";

  useEffect(() => {
    fetchProducts()
      .then((products) => setFeaturedProducts(products.slice(0, 4)))
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="w-full py-12 bg-[#281E18]">
      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
        <h2 className="text-5xl font-bold mb-10 cursor-default inline-block">
          <span style={{ color: pinkColor }}>Handpicked</span>
          <span className="text-[#E0E0E0]"> for You</span>
        </h2>
        {error ? (
          <p role="alert" className="text-center py-12 text-red-400">{error}</p>
        ) : isLoading ? (
          <p className="text-center py-12 text-zinc-500">Loading products...</p>
        ) : featuredProducts.length === 0 ? (
          <p className="text-center py-12 text-zinc-500">No featured products are available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group transition-all duration-500 rounded-xl hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)]"
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
