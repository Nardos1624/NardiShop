"use client";

import { Product } from "@/lib/types";
import {
  ApiCartItem,
  apiRequest,
  expandCartItems,
  getAuthToken,
} from "@/lib/api";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface CartContextType {
  items: Product[];
  error: string | null;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: (serverAlreadyCleared?: boolean) => Promise<void>;
  dismissError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const previousToken = useRef<string | null>(getAuthToken());

  const refreshRemoteCart = useCallback(async () => {
    const cartItems = await apiRequest<ApiCartItem[]>("/api/cart", {}, true);
    const products = expandCartItems(cartItems);
    setItems(products);
    return cartItems;
  }, []);

  useEffect(() => {
    const cart = window.localStorage.getItem("cart");
    if (cart) {
      try {
        setItems(JSON.parse(cart) as Product[]);
      } catch {
        setError("Your saved cart could not be read. Please add your items again.");
      }
    }
    setIsHydrated(true);

    if (getAuthToken()) {
      void refreshRemoteCart().catch((requestError: Error) => {
        setError(requestError.message);
      });
    }
  }, [refreshRemoteCart]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem("cart", JSON.stringify(items));
    } catch (storageError) {
      console.error("Failed to save cart to localStorage:", storageError);
      setError("Your cart could not be saved on this device.");
    }
  }, [isHydrated, items]);

  useEffect(() => {
    const handleAuthChange = async () => {
      const token = getAuthToken();
      const previous = previousToken.current;
      previousToken.current = token;

      if (!token) {
        return;
      }

      try {
        if (!previous) {
          for (const product of items) {
            await apiRequest(
              "/api/cart",
              {
                method: "POST",
                body: JSON.stringify({ productId: product.id, quantity: 1 }),
              },
              true
            );
          }
        }
        await refreshRemoteCart();
        setError(null);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Could not synchronize your cart."
        );
      }
    };

    window.addEventListener("nardishop-auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("nardishop-auth-change", handleAuthChange);
    };
  }, [items, refreshRemoteCart]);

  const addToCart = async (product: Product) => {
    try {
      if (getAuthToken()) {
        await apiRequest(
          "/api/cart",
          {
            method: "POST",
            body: JSON.stringify({ productId: product.id, quantity: 1 }),
          },
          true
        );
        await refreshRemoteCart();
      } else {
        setItems((currentItems) => [...currentItems, product]);
      }
      setError(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Could not add item to cart."
      );
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      if (getAuthToken()) {
        const cartItems = await apiRequest<ApiCartItem[]>("/api/cart", {}, true);
        const cartItem = cartItems.find((item) => item.product.id === productId);
        if (!cartItem) {
          await refreshRemoteCart();
          return;
        }

        await apiRequest(`/api/cart/${encodeURIComponent(cartItem.id)}`, {
          method: "DELETE",
        }, true);
        if (cartItem.quantity > 1) {
          await apiRequest(
            "/api/cart",
            {
              method: "POST",
              body: JSON.stringify({
                productId,
                quantity: cartItem.quantity - 1,
              }),
            },
            true
          );
        }
        await refreshRemoteCart();
      } else {
        setItems((currentItems) => {
          const index = currentItems.findIndex((item) => item.id === productId);
          if (index < 0) return currentItems;
          return currentItems.filter((_, itemIndex) => itemIndex !== index);
        });
      }
      setError(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not remove item from cart."
      );
    }
  };

  const clearCart = async (serverAlreadyCleared = false) => {
    try {
      if (getAuthToken() && !serverAlreadyCleared) {
        const cartItems = await apiRequest<ApiCartItem[]>("/api/cart", {}, true);
        await Promise.all(
          cartItems.map((item) =>
            apiRequest(`/api/cart/${encodeURIComponent(item.id)}`, {
              method: "DELETE",
            }, true)
          )
        );
      }
      setItems([]);
      setError(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Could not clear cart."
      );
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        error,
        addToCart,
        removeFromCart,
        clearCart,
        dismissError: () => setError(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

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
