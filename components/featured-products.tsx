import { getFeaturedProducts } from "@/lib/data";
import ProductCard from "./product-card";

function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts();
  const pinkColor = "rgb(255, 182, 193)";

  return (
    <section className="w-full py-12 bg-[#212121]">
      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
        {/* Section Heading */}
        <h2 className="text-5xl font-bold mb-10 cursor-default inline-block">
          <span style={{ color: pinkColor }}>
           Handpicked 
          </span>
          <span className="text-[#E0E0E0]"> for You</span>
        </h2>

        {/* Grid layout for featured products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <div 
              key={product.id} 
              className="group transition-all duration-500 rounded-xl hover:shadow-[0_20px_40px_rgba(255,182,193,0.3)]"
            >
              {/* ProductCard handles the pink product name internally */}
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;