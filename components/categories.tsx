import { getAllCategories } from "@/lib/data";
import CategoryCard from "./category-card";
function Categories() {
  const categories = getAllCategories();

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8 cursor-pointer">
        <h2 className="text-5xl font-bold mb-8">
          <span style={{ color: "rgb(255, 182, 193)" }}>Pick</span> Your{" "}
          <span style={{ color: "rgb(255, 182, 193)" }}>Preference</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;