"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product-card";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";

function Products() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pinkColor = "#D4AF37";

  useEffect(() => {
    fetchProducts()
      .then(setAllProducts)
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
        <h1 className="text-3xl font-bold mb-8">
          <span className="cursor-pointer text-[#281E18]"> All </span>
          <span className="cursor-pointer" style={{ color: pinkColor }}>
            Products
          </span>
        </h1>
        {error ? (
          <p role="alert" className="text-center py-12 text-red-400">{error}</p>
        ) : isLoading ? (
          <p className="text-center py-12 text-zinc-500">Loading products...</p>
        ) : allProducts.length === 0 ? (
          <p className="text-center py-12 text-zinc-500">No products are currently available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Products;
