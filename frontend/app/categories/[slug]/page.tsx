"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/footer";
import PoweredBy from "@/components/powered-by";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/product-card";
import { getCategoriesForProducts } from "@/lib/data";
import { fetchProducts } from "@/lib/api";
import { findMainCategory, splitCategory } from "@/lib/catalog";
import { Product } from "@/lib/types";
import { useParams, useSearchParams } from "next/navigation";

function CategoryContent() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const subFromUrl = searchParams.get("sub");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(subFromUrl);

  // Follow the subcategory chosen in the navbar's Categories menu
  useEffect(() => {
    setSelectedSub(subFromUrl);
  }, [subFromUrl, slug]);

  const category = getCategoriesForProducts(products).find((item) => item.slug === slug);
  const categoryProducts = category
    ? products.filter((product) => splitCategory(product.category).main.toLowerCase() === category.name.toLowerCase())
    : [];

  // Subcategory buttons: the catalog's list, plus any extra ones products use
  const subcategories = Array.from(new Set([
    ...(category ? findMainCategory(category.name)?.subcategories.map((sub) => sub.name) ?? [] : []),
    ...categoryProducts.map((product) => splitCategory(product.category).sub).filter((sub): sub is string => Boolean(sub)),
  ]));

  const visibleProducts = selectedSub
    ? categoryProducts.filter((product) => splitCategory(product.category).sub === selectedSub)
    : categoryProducts;

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, []);

  const chipStyles = (isActive: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "border-[#D4AF37] bg-[#D4AF37] text-[#281E18]"
        : "border-zinc-300 bg-white text-[#281E18] hover:border-[#D4AF37]"
    }`;

  return (
    <>
      <section className="w-full py-12">
        <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
          {isLoading ? (
            <p className="py-12 text-center text-zinc-500">Loading products...</p>
          ) : error ? (
            <p role="alert" className="py-12 text-center text-red-400">{error}</p>
          ) : category ? (
            <>
              <h1 className="text-3xl font-bold mb-6">
                <span style={{ color: "#D4AF37" }}>{category.name}</span>
              </h1>

              {subcategories.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label={`${category.name} subcategories`}>
                  <button type="button" onClick={() => setSelectedSub(null)} className={chipStyles(selectedSub === null)}>
                    All
                  </button>
                  {subcategories.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSelectedSub(sub)}
                      aria-pressed={selectedSub === sub}
                      className={chipStyles(selectedSub === sub)}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}

              {visibleProducts.length === 0 ? (
                <div className="text-center py-12">
                  <h2 className="text-xl font-medium">No products found in this category yet</h2>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {visibleProducts.map((product) => (
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
    </>
  );
}

// useSearchParams needs a Suspense boundary
function CategoryPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<p className="py-24 text-center text-zinc-500">Loading products...</p>}>
        <CategoryContent />
      </Suspense>
      <Footer />
      <PoweredBy />
    </>
  );
}

export default CategoryPage;
