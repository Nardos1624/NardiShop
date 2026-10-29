"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, Suspense } from "react"; // Added Suspense import

import { getCategoriesForProducts } from "@/lib/data";
import { splitCategory } from "@/lib/catalog";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SearchIcon, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import FilterSidebar from "@/components/filter-sidebar";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PoweredBy from "@/components/powered-by";

// 1. Created a sub-component for the search logic
function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = useMemo(() => getCategoriesForProducts(allProducts), [allProducts]);

  const prices = allProducts.map((product) => product.price);
  const minPrice = prices.length ? Math.floor(Math.min(...prices)) : 0;
  const maxPrice = prices.length ? Math.ceil(Math.max(...prices)) : 0;

  useEffect(() => {
    fetchProducts()
      .then((products) => {
        setAllProducts(products);
        const productPrices = products.map((product) => product.price);
        if (productPrices.length) {
          setPriceRange([Math.floor(Math.min(...productPrices)), Math.ceil(Math.max(...productPrices))]);
        }
      })
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, []);

  // Keep the input in sync when a new search is made from the navbar while already on this page
  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  const filteredProducts = useMemo(() => {
    const terms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);

    return allProducts.filter((product) => {
      const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
      const matchesQuery = terms.every((term) => searchableText.includes(term));
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(splitCategory(product.category).main);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesQuery && matchesCategory && matchesPrice;
    });
  }, [allProducts, searchQuery, selectedCategories, priceRange]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    router.replace(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([minPrice, maxPrice]);
    setSearchQuery("");
    router.replace("/search");
  };

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:gap-6">
        {/* Mobile Filter Button */}
        <div className="flex md:hidden justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black ">Search Products</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="py-4">
                <FilterSidebar
                  categories={categories}
                  selectedCategories={selectedCategories}
                  priceRange={priceRange}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onCategoryChange={handleCategoryChange}
                  onPriceChange={handlePriceChange}
                  onClearFilters={clearAllFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block w-1/4 min-w-[250px]">
          <FilterSidebar
            categories={categories}
            selectedCategories={selectedCategories}
            priceRange={priceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
            onClearFilters={clearAllFilters}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="md:hidden">
            <form onSubmit={handleSearch} className="flex w-full mb-6">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="ml-2">
                <SearchIcon className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <div className="hidden md:block mb-6">
            <h1 className="text-2xl font-bold mb-4 text-black">Search Products</h1>
            <form onSubmit={handleSearch} className="flex w-full">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="ml-2">
                <SearchIcon className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {error ? (
            <p role="alert" className="text-center py-12 text-red-400">{error}</p>
          ) : isLoading ? (
            <p className="text-center py-12 text-zinc-500">Loading products...</p>
          ) : (
          <>
          <div className="mb-4 text-sm text-gray-500">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium">No products found</h2>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
              <Button variant="outline" className="mt-4" onClick={clearAllFilters}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          </>
          )}
        </div>
      </div>
    </div>
  );
}

// 2. Main Page Component with Suspense Boundary
export default function Search() {
  return (
    <>
      <Navbar />
      <div className="py-8">
        <Suspense fallback={<div className="text-center py-20">Loading Search...</div>}>
          <SearchContent />
        </Suspense>
      </div>
      <Footer />
      <PoweredBy />
    </>
  );
}