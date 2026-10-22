"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/lib/types";

interface ProductCartProps {
  product: Product;
  className?: string;
}

export default function AddToCartButton({ product, className }: ProductCartProps) {
  const { addToCart } = useCart();


  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <Button 
      onClick={handleAddToCart} 
      className={`w-full md:w-auto px-8 py-6 text-lg  rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center ${className}`}
      style={{ 
      
        color: "#E0E0E0",
        boxShadow: "0 0 20px rgba(255, 182, 193, 0.4)" 
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 0 30px rgba(255, 182, 193, 0.6)"}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 182, 193, 0.4)"}
    >
      <ShoppingCart className="mr-2 h-5 w-5 " />
      Add To Cart
    </Button>
  );
}