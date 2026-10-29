"use client";

import { Category } from "@/lib/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductImage from "./product-image";
import { fallbackCategoryIcon, findMainCategory } from "@/lib/catalog";

interface CategoryCardProps {
  category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
  const Icon = findMainCategory(category.name)?.icon ?? fallbackCategoryIcon;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(212,175,55,0.25)] hover:ring-[#D4AF37]/60"
    >
      {/* Photo area: the whole photo is shown (no cropping or zoom) */}
      <div className="relative aspect-4/5 bg-[#FBF7EE]">
        {/* Icon shown until the category's photo is added (the photo covers it) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="h-16 w-16 text-[#D4AF37]/70" strokeWidth={1.25} />
        </div>
        <ProductImage
          src={category.image}
          alt={category.name}
          className="bg-[#FBF7EE] object-contain"
        />
      </div>
      {/* Name below the photo so it never covers it */}
      <div className="flex items-center justify-between gap-2 border-t border-zinc-200 p-4 md:p-5">
        <h3 className="text-base font-bold text-[#281E18] md:text-lg">{category.name}</h3>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FBF7EE] text-[#281E18] transition-colors group-hover:bg-[#D4AF37]">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export default CategoryCard;
