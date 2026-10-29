"use client";

import { Product } from "@/lib/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface CartContextType {
  items: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  setQuantity: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    // Try to load the cart from localStorage
    const cart = localStorage.getItem("cart");
    if (cart) {
      // If the cart is found, parse it and set it to the state
      setItems(JSON.parse(cart));
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    try {
      // Save the current cart to localStorage
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (error) {
      // If there's an error, log it to the console
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [items]);

  /**
   * Adds a product to the cart.
   *
   * @param product - The product to add to the cart.
   * @param quantity - How many of the product to add (defaults to 1).
   */
  const addToCart = (product: Product, quantity = 1) => {
    // Append one copy of the product per unit to the existing items array
    setItems((items) => [...items, ...Array(quantity).fill(product)]);
  };

  /**
   * Sets how many of a product (in its chosen size) are in the cart. A
   * quantity of 0 removes it.
   *
   * @param product - The product whose quantity should change.
   * @param quantity - The new quantity.
   */
  const setQuantity = (product: Product, quantity: number) => {
    setItems((items) => {
      const firstIndex = items.findIndex((item) => isSameCartLine(item, product));
      const otherItems = items.filter((item) => !isSameCartLine(item, product));
      const copies: Product[] = Array(Math.max(0, quantity)).fill(product);

      // Keep the product in the same place in the cart
      const insertAt = firstIndex === -1 ? otherItems.length : firstIndex;
      return [...otherItems.slice(0, insertAt), ...copies, ...otherItems.slice(insertAt)];
    });
  };

  /**
   * Removes a product from the cart by its ID.
   *
   * @param productId - The ID of the product to remove.
   */
  const removeFromCart = (productId: string) => {
    setItems((items) => {
      // Find the index of the product with the given ID
      const index = items.findIndex((item) => item.id === productId);

      // If the product is in the cart, remove it
      if (index !== -1) {
        const newItems = [...items];
        newItems.splice(index, 1); // Remove the product from the array
        return newItems; // Return the updated items array
      }
      return items; // If product not found, return the original items array
    });
  };

  /**
   * Removes all products from the cart.
   */
  const clearCart = () => {
    // Reset the items array to be empty
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        /**
         * The list of products in the cart.
         */
        items,
        /**
         * Adds a product to the cart.
         *
         * @param product - The product to add to the cart.
         */
        addToCart,
        /**
         * Sets how many of a product are in the cart.
         */
        setQuantity,
        /**
         * Removes a product from the cart by its ID.
         *
         * @param productId - The ID of the product to remove.
         */
        removeFromCart,
        /**
         * Removes all products from the cart.
         */
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export interface CartLine {
  product: Product;
  quantity: number;
}

/** Two cart items belong to the same line when they are the same product in the same size */
function isSameCartLine(a: Product, b: Product): boolean {
  return a.id === b.id && (a.size ?? "") === (b.size ?? "");
}

/** A unique key for a cart line, e.g. for React lists */
export function cartLineKey(product: Product): string {
  return `${product.id}::${product.size ?? ""}`;
}

/**
 * Groups the cart's items into one line per product and size with its quantity.
 *
 * @param items - The cart items (one entry per unit).
 * @returns The cart lines, in the order products were first added.
 */
export function groupCartItems(items: Product[]): CartLine[] {
  return items.reduce<CartLine[]>((lines, item) => {
    const line = lines.find((l) => isSameCartLine(l.product, item));
    if (line) line.quantity += 1;
    else lines.push({ product: item, quantity: 1 });
    return lines;
  }, []);
}

/**
 * Hook to access the cart context.
 *
 * @returns The cart context.
 */
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error(
      "useCart must be used within a CartProvider. " +
        "Make sure you have wrapped your app with the CartProvider component."
    );
  }
  return context;
}