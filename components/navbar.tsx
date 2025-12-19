"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; 
import React, { useState } from "react";
import CartSheet from "./cart-sheet";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); 
  const [searchQuery, setSearchQuery] = useState("");
  
  const pinkColor = "rgb(255, 182, 193)";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
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
    <header className="sticky top-0 w-full z-50 text-[#E0E0E0] bg-[#212121] border-b border-zinc-800">
      <div className="container mx-auto md:py-6 md:px-8 flex h-16 items-center">

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="transition-colors group">
                <Menu className="h-6 w-6 group-hover:text-[rgb(255,182,193)]" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-[#212121] border-zinc-800">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="flex flex-col gap-6 mt-12 px-6">
                {routes.map((route) => {
                  const isActive = pathname === route.href;
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      className="text-xl font-medium transition-colors"
                      style={{ color: isActive ? pinkColor : "#E0E0E0" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = pinkColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? pinkColor : "#E0E0E0")}
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
          <ShoppingBag className="h-6 w-6 transition-colors group-hover:text-[rgb(255,182,193)]" />
          <span className="font-bold text-xl transition-colors" style={{ color: pinkColor }}>
            NardiShop
          </span>
        </Link>

        {/* Nav links - Desktop */}
        <nav className="hidden lg:flex items-center gap-8 text-sm">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className="font-medium transition-colors duration-300"
                style={{ color: isActive ? pinkColor : "#E0E0E0" }} 
                onMouseEnter={(e) => (e.currentTarget.style.color = pinkColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? pinkColor : "#E0E0E0")}
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
                placeholder="Search products..."
                className="w-full md:w-[200px] lg:w-[250px] pl-8 bg-zinc-900 border-zinc-700 text-white focus:border-[rgb(255,182,193)] focus:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <div 
            className="flex items-center gap-2 transition-colors cursor-pointer hover:text-[rgb(255,182,193)]"
          >
            <CartSheet />
          </div>
        </div>
      </div>
    </header>
  );
}