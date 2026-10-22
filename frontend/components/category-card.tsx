"use client";

import { Category } from "@/lib/types";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import ProductImage from "./product-image";

interface CategoryCardProps {
  category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
  const pinkColor = "#D4AF37";

  return (
    <Link href={`/categories/${category.slug}`}>
      <Card 
        className="overflow-hidden transition-all duration-300 py-0 gap-0 hover:scale-[1.02] border"
        style={{ 
          borderColor: pinkColor,
          
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 0 20px rgba(212, 175, 55, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div className="aspect-square relative">
          <ProductImage
            src={category.image}
            alt={category.name}
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
        <CardContent className="p-4 bg-white">
          <h3 
            className="font-bold text-center transition-colors duration-300"
            style={{ color: pinkColor }}
          >
            {category.name}
          </h3>
        </CardContent>
      </Card>
    </Link>
  );
}

export default CategoryCard;