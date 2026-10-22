"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PoweredBy from "@/components/powered-by";
import AddToCartButton from "@/components/add-to-cart-button";
import { fetchProduct } from "@/lib/api";
import { Product } from "@/lib/types";
import ProductImage from "@/components/product-image";

export default function SingleProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pinkColor = "#D4AF37";

  useEffect(() => {
    setIsLoading(true);
    fetchProduct(id)
      .then(setProduct)
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <>
      <Navbar />
      {isLoading ? (
        <div className="min-h-screen bg-[#281E18] py-12 text-center text-zinc-300">
          Loading product...
        </div>
      ) : error || !product ? (
        <div className="min-h-screen bg-[#281E18] py-12 text-center text-zinc-300">
          <p role={error ? "alert" : undefined}>{error || "Product not found."}</p>
          <Link className="mt-4 inline-block underline" href="/products">Back to products</Link>
        </div>
      ) : (
        <div className="min-h-screen bg-[#281E18] py-12">
          <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div
                className="group relative aspect-square w-full rounded-3xl overflow-hidden border-2 border-solid transition-all duration-500 hover:-translate-y-2 shadow-[0_10_30px_rgba(212,175,55,0.2)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.4)]"
                style={{ borderColor: pinkColor }}
              >
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                  priority
                />
              </div>

              <div className="flex flex-col space-y-6">
                <div>
                  <p
                    className="text-sm font-bold uppercase tracking-widest mb-2 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] cursor-default w-fit"
                    style={{ color: pinkColor }}
                  >
                    {product.category}
                  </p>
                  <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 leading-tight">
                    {product.name}
                  </h1>
                </div>

                <p className="text-3xl text-zinc-800 font-medium drop-shadow-sm">
                  ${product.price.toFixed(2)}
                </p>

                <div className="border-t border-[#D4AF37] pt-6">
                  <h3 className="text-lg font-bold text-zinc-900">Description</h3>
                  <p className="text-zinc-600 mt-2 leading-relaxed">{product.description}</p>
                </div>

                <div className="pt-4 transition-transform duration-300 active:scale-95">
                  <AddToCartButton product={product} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
      <PoweredBy />
    </>
  );
}
