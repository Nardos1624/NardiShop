"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PoweredBy from "@/components/powered-by";
import ProductImage from "@/components/product-image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ApiError, fetchProduct } from "@/lib/api";
import { getSizesForCategory, splitCategory } from "@/lib/catalog";
import { Product } from "@/lib/types";

const goldColor = "#D4AF37";

// Product ids from the database are UUIDs; anything else can't be a product
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function SingleProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isMissing, setIsMissing] = useState(!UUID_PATTERN.test(id));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [size, setSize] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  // Load the product from the backend (the catalog lives in the database)
  useEffect(() => {
    if (!UUID_PATTERN.test(id)) return;

    let isCurrent = true;
    fetchProduct(id)
      .then((loaded) => {
        if (isCurrent) setProduct(loaded);
      })
      .catch((error) => {
        if (!isCurrent) return;
        if (error instanceof ApiError && error.status === 404) setIsMissing(true);
        else setLoadError("We couldn't load this product. Please check your connection and try again.");
      });
    return () => {
      isCurrent = false;
    };
  }, [id]);

  if (isMissing) notFound();

  const sizes = product ? getSizesForCategory(product.category) : [];
  const needsSize = sizes.length > 0;
  const { main, sub } = splitCategory(product?.category ?? "");

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(needsSize ? { ...product, size } : product);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white py-10 text-[#281E18] md:py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Link
            href="/products"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-[#B8962E]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to products
          </Link>

          {loadError ? (
            <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
              {loadError}
            </p>
          ) : !product ? (
            // Loading placeholder with the same layout as the product
            <div className="grid animate-pulse grid-cols-1 gap-12 md:grid-cols-2" aria-label="Loading product">
              <div className="aspect-square w-full rounded-3xl bg-zinc-100" />
              <div className="space-y-5 pt-4">
                <div className="h-4 w-32 rounded bg-zinc-100" />
                <div className="h-10 w-3/4 rounded bg-zinc-100" />
                <div className="h-8 w-40 rounded bg-zinc-100" />
                <div className="h-24 w-full rounded bg-zinc-100" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_20px_50px_rgba(40,30,24,0.08)]">
                <ProductImage src={product.image} alt={product.name} className="object-contain p-8" priority />
              </div>

              <div className="flex flex-col space-y-6">
                <div>
                  <p className="mb-2 text-sm font-bold uppercase tracking-widest" style={{ color: goldColor }}>
                    {sub ? `${main} · ${sub}` : main}
                  </p>
                  <h1 className="text-4xl font-bold leading-tight md:text-5xl">{product.name}</h1>
                </div>

                <p className="text-3xl font-semibold">{product.price.toFixed(2)} ETB</p>

                <div className="border-t border-zinc-200 pt-6">
                  <h2 className="text-lg font-bold">Description</h2>
                  <p className="mt-2 whitespace-pre-line leading-relaxed text-zinc-600">{product.description}</p>
                </div>

                {/* Size picker for clothes, shoes and other sized products */}
                {needsSize && (
                  <label className="flex max-w-xs items-center gap-3 text-sm">
                    <span className="font-medium text-zinc-600">Size</span>
                    <select
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      aria-label={`Choose a size for ${product.name}`}
                      className="h-11 flex-1 rounded-xl border border-zinc-300 bg-white px-3 text-[#281E18] outline-none focus:border-[#D4AF37]"
                    >
                      <option value="" disabled>Select a size</option>
                      {sizes.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                )}

                <div className="pt-2">
                  <Button
                    onClick={handleAddToCart}
                    disabled={needsSize && !size}
                    className="h-14 w-full rounded-full px-10 text-lg font-bold text-[#281E18] shadow-[0_10px_30px_rgba(212,175,55,0.35)] transition-transform hover:scale-[1.02] hover:bg-amber-300 disabled:opacity-50 md:w-auto"
                    style={{ backgroundColor: goldColor }}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {needsSize && !size ? "Choose a size" : justAdded ? "Added to cart ✓" : "Add To Cart"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <PoweredBy />
    </>
  );
}
