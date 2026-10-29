"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Menu, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation"; 
import React, { useState } from "react";
import CartSheet from "./cart-sheet";
import { CategoriesAccordion, CategoriesDropdown } from "./categories-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); 
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  const pinkColor = "#D4AF37";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const routes = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="navbar-header sticky top-9 w-full z-40 border-b border-zinc-200 bg-white text-zinc-900">
      <div className="container mx-auto md:py-6 md:px-8 flex h-16 items-center">

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="transition-colors group">
                <Menu className="h-6 w-6 group-hover:text-[#D4AF37]" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto border-zinc-200 bg-white text-[#281E18] sm:w-[400px]">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="flex flex-col gap-6 mt-12 px-6 pb-10">
                {routes.map((route) => {
                  const isActive = pathname === route.href;
                  if (route.href === "/categories") {
                    const isCategoriesActive = pathname.startsWith("/categories");
                    return (
                      <div key={route.href}>
                        <button
                          type="button"
                          onClick={() => setShowMobileCategories((value) => !value)}
                          aria-expanded={showMobileCategories}
                          className="flex w-full items-center justify-between text-xl font-medium transition-colors hover:text-[#D4AF37]"
                          style={{ color: isCategoriesActive || showMobileCategories ? pinkColor : "#281E18" }}
                        >
                          {route.label}
                          <ChevronDown className={`h-5 w-5 transition-transform ${showMobileCategories ? "rotate-180" : ""}`} />
                        </button>
                        {showMobileCategories && (
                          <div className="mt-2">
                            <CategoriesAccordion onNavigate={() => setIsMenuOpen(false)} />
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-xl font-medium transition-colors"
                      style={{ color: isActive ? pinkColor : "#281E18" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = pinkColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? pinkColor : "#281E18")}
                    >
                      {route.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo Link */}
        <Link 
          className="flex items-center gap-2 ml-4 md:ml-0 md:mr-8 group" 
          href="/"
        >
          <Image
            src="/placeholder/Nardi%20shop%20logo%20Transparent.png"
            alt="NardiShop logo"
            width={60}
            height={60}
            className="object-contain"
          />
          <span className="font-bold text-xl transition-colors" style={{ color: pinkColor }}>
            NardiShop
          </span>
        </Link>

        {/* Nav links - Desktop */}
        <nav className="hidden lg:flex items-center gap-8 text-sm">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            if (route.href === "/categories") {
              return <CategoriesDropdown key={route.href} isActive={pathname.startsWith("/categories")} />;
            }
            return (
              <Link
                key={route.href}
                href={route.href}
                className="font-medium transition-colors duration-300"
                style={{ color: isActive ? pinkColor : "#281E18" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = pinkColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? pinkColor : "#281E18")}
              >
                {route.label}
              </Link>
            );
          })}
        </nav>

        {/* Search & Cart */}
        <div className="flex items-center gap-4 ml-auto px-4 md:px-0">
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products or categories..."
                className="w-full border-zinc-300 bg-white pl-8 text-[#281E18] placeholder:text-zinc-500 focus:border-[#D4AF37] focus:ring-0 md:w-[200px] lg:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <div 
            className="flex items-center gap-2 transition-colors cursor-pointer hover:text-[#D4AF37]"
          >
            <CartSheet />
          </div>
        </div>
      </div>
    </header>
  );
}