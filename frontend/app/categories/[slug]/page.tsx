"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/footer";
import PoweredBy from "@/components/powered-by";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/product-card";
import { getCategoriesForProducts } from "@/lib/data";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import { useParams } from "next/navigation";

function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = getCategoriesForProducts(products).find((item) => item.slug === slug);
  const categoryProducts = category
    ? products.filter((product) => product.category.toLowerCase() === category.name.toLowerCase())
    : [];

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <section className="w-full py-12">
        <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
          {isLoading ? (
            <p className="py-12 text-center text-zinc-500">Loading products...</p>
          ) : error ? (
            <p role="alert" className="py-12 text-center text-red-400">{error}</p>
          ) : category ? (
            <>
              <h1 className="text-3xl font-bold mb-8">
                <span style={{ color: "#D4AF37" }}>{category.name}</span>
              </h1>
              {categoryProducts.length === 0 ? (
                <div className="text-center py-12">
                  <h2 className="text-xl font-medium">No products found in this category</h2>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold">Category not found</h1>
              <Link className="mt-4 inline-block underline" href="/categories">View categories</Link>
            </div>
          )}
        </div>
      </section>
      <Footer />
      <PoweredBy />
    </>
  );
}

export default CategoryPage;
