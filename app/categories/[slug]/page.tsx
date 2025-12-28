import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/product-card";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/data";
import { notFound } from "next/navigation";

// Next.js 15 requires params to be a Promise
interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function CategoryPage({ params }: CategoryPageProps) {
  // You must await the params before using them
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = getProductsByCategory(category.name);

  return (
    <>
      <Navbar />
      <section className="w-full py-12">
        <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
          <h1 className="text-3xl font-bold mb-8">
            <span style={{ color: "rgb(255,182,193)" }}>{category.name}</span>
          </h1>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium">
                No products found in this category
              </h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default CategoryPage;