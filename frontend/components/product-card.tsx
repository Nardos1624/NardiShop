"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/lib/types";
import { getSizesForCategory, splitCategory } from "@/lib/catalog";
import { ShoppingCart } from "lucide-react";
import ProductImage from "./product-image";

interface ProductCardProps {
  product: Product
}

/**
 * ProductCard component displays the product's image, name, category, price,
 * a size picker (for clothes and shoes) and an "Add to Cart" button. It links
 * to the product's detailed page.
 *
 * @param {ProductCardProps} props - Props containing the product details.
 * @returns {JSX.Element} The rendered ProductCard component.
 */
function ProductCard({ product }: ProductCardProps) {
  // Get the addToCart function from the useCart hook
  const { addToCart } = useCart();
  const [size, setSize] = useState("");

  const sizes = getSizesForCategory(product.category);
  const needsSize = sizes.length > 0;
  const { main, sub } = splitCategory(product.category);

  return (
    <Card className="overflow-hidden py-0 gap-0">
      {/* Link to the product's detail page */}
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative overflow-hidden bg-white border-b">
          <ProductImage
            src={product.image }
            alt={product.name}
            className="object-contain"
          />
        </div>
      </Link>
      <CardContent className="px-4">
        {/* Product name linking to its detail page */}
        <Link href={`/products/${product.id}`}>
          <h4
  className="font-bold text-lg transition-colors duration-300"
  style={{ color: "#D4AF37" }}
>
  {product.name}
</h4>
        </Link>
        {/* Product category, e.g. "Women · Dresses" */}
        <p className="text-sm text-gray-500 mt-1">{sub ? `${main} · ${sub}` : main}</p>
        {/* Product price */}
        <p className="font-medium text-lg mt-2">{product.price.toFixed(2)} ETB</p>
        {/* Size picker for clothes, shoes and other sized products */}
        {needsSize && (
          <label className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-gray-500">Size</span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              aria-label={`Choose a size for ${product.name}`}
              className="h-9 flex-1 rounded-md border border-zinc-300 bg-white px-2 text-[#281E18] outline-none focus:border-[#D4AF37]"
            >
              <option value="" disabled>Select a size</option>
              {sizes.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        )}
      </CardContent>
      <CardFooter className="p-4">
        {/* Button to add the product to the cart (quantity is set at checkout) */}
        <Button
          onClick={() => addToCart(needsSize ? { ...product, size } : product)}
          disabled={needsSize && !size}
          title={needsSize && !size ? "Choose a size first" : undefined}
          className="w-full"
          variant="outline"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {needsSize && !size ? "Choose a size" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
