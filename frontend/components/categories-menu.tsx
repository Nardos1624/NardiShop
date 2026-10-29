"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { catalog } from "@/lib/catalog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

/** Link to a category page, optionally with a subcategory already selected */
export function categoryHref(slug: string, sub?: string): string {
  return sub ? `/categories/${slug}?sub=${encodeURIComponent(sub)}` : `/categories/${slug}`;
}

/**
 * Desktop "Categories" dropdown in the navbar: opens on hover or click and
 * lists every category with its subcategories.
 */
export function CategoriesDropdown({ isActive }: { isActive: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const open = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsOpen(true);
  };
  // Small delay so the menu stays open while the mouse moves down to it
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setIsOpen(false), 150);
  };

  // Close after navigating, and with the Escape key
  useEffect(() => setIsOpen(false), [pathname]);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div onMouseEnter={open} onMouseLeave={closeSoon}>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center gap-1 font-medium transition-colors duration-300 hover:text-[#D4AF37] ${
          isActive || isOpen ? "text-[#D4AF37]" : "text-[#281E18]"
        }`}
      >
        Categories
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          onMouseEnter={open}
          onMouseLeave={closeSoon}
          className="absolute inset-x-0 top-full border-b border-zinc-200 bg-white shadow-[0_20px_40px_rgba(40,30,24,0.1)]"
        >
          <div className="container mx-auto max-h-[70vh] overflow-y-auto px-8 py-8">
            <div className="grid grid-cols-4 gap-x-8 gap-y-8 xl:grid-cols-6">
              {catalog.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.slug}>
                    <Link
                      href={categoryHref(category.slug)}
                      onClick={() => setIsOpen(false)}
                      className="mb-3 flex items-center gap-2 font-semibold text-[#281E18] transition-colors hover:text-[#B8962E]"
                    >
                      <Icon className="h-4 w-4 text-[#D4AF37]" />
                      {category.name}
                    </Link>
                    <ul className="space-y-2">
                      {category.subcategories.map((sub) => (
                        <li key={sub.name}>
                          <Link
                            href={categoryHref(category.slug, sub.name)}
                            onClick={() => setIsOpen(false)}
                            className="text-sm text-[#5C5148] transition-colors hover:text-[#B8962E]"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <Link
              href="/categories"
              onClick={() => setIsOpen(false)}
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#281E18] hover:text-[#B8962E]"
            >
              View all categories
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Mobile version for the side menu: each category expands to show its
 * subcategories.
 */
export function CategoriesAccordion({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {catalog.map((category) => {
        const Icon = category.icon;
        return (
          <AccordionItem key={category.slug} value={category.slug} className="border-zinc-200">
            <AccordionTrigger className="py-3 text-base font-medium text-[#281E18] hover:no-underline">
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-[#D4AF37]" />
                {category.name}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 pl-6">
                <li>
                  <Link href={categoryHref(category.slug)} onClick={onNavigate} className="text-sm font-semibold text-[#B8962E]">
                    All {category.name}
                  </Link>
                </li>
                {category.subcategories.map((sub) => (
                  <li key={sub.name}>
                    <Link
                      href={categoryHref(category.slug, sub.name)}
                      onClick={onNavigate}
                      className="text-sm text-[#5C5148] hover:text-[#B8962E]"
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
