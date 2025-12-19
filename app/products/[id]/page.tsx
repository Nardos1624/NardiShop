import { getProductById } from "@/lib/data";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/add-to-cart-button";

interface Params {
  id: string;
}

// Next.js 15 requires params to be treated as a Promise
export default async function SingleProductPage({
  params,
}: {
  params: Promise<Params>; // Updated interface for strict TS
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) return notFound();

  const pinkColor = "rgb(255, 182, 193)";

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#E0E0E0] py-12">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Image Container with your Pink Border */}
            <div 
              className="group relative aspect-square w-full rounded-3xl overflow-hidden border-2 border-solid transition-all duration-500 hover:-translate-y-2
                shadow-[0_10_30px_rgba(255,182,193,0.2)] 
                hover:shadow-[0_20px_50px_rgba(255,182,193,0.4)]"
              style={{ borderColor: pinkColor }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill               
                className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                priority
              />
            </div>

            <div className="flex flex-col space-y-6">
              <div>
                <p 
                  className="text-sm font-bold uppercase tracking-widest mb-2 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,182,193,0.8)] cursor-default w-fit"
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

              {/* FIXED: Removed the 'b' from 'pt-6' and added border-zinc-300 */}
              <div className="border-t border-[rgb(255, 182, 193)] pt-6">
                <h3 className="text-lg font-bold text-zinc-900">Description</h3>
                <p className="text-zinc-600 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="pt-4 transition-transform duration-300 active:scale-95">
                <AddToCartButton product={product}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}