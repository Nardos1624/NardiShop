import { Product } from "@/lib/types";
import { getProductCategoryByName } from "@/lib/data";

const AUTH_TOKEN_KEY = "authToken";
const AUTH_USER_KEY = "authUser";

interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  imageUrl?: string | null;
  image?: string;
  category?: string | null;
}

export interface ApiCartItem {
  id: string;
  quantity: number;
  product: ApiProduct;
}

export interface ApiUser {
  id: string;
  email: string;
  role: string;
}

export interface ApiAuthResponse {
  message: string;
  token: string;
  user: ApiUser;
}

export interface ApiOrderResponse {
  message: string;
  receipt: {
    meta: {
      invoiceNumber: string;
      transactionDate: string;
    };
    receiptItems: Array<{
      productName: string;
      quantity: number;
      unitPrice: string;
      totalLinePrice: string;
    }>;
    summary: {
      subtotal: string;
      grandTotal: string;
    };
  };
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  authenticated = false
): Promise<T> {
  const headers = new Headers(options.headers);
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (options.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const token = getAuthToken();
    if (!token) {
      throw new ApiError("Please log in to continue.", 401);
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(path, { ...options, headers });
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    if (response.ok) {
      throw new ApiError("The server returned an invalid response.", response.status);
    }
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : `Request failed with status ${response.status}.`;
    throw new ApiError(message, response.status);
  }

  return payload as T;
}

export function toProduct(product: ApiProduct): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    image: product.imageUrl || product.image || "",
    category: product.category || getProductCategoryByName(product.name) || "Uncategorized",
  };
}

export function getAuthToken(): string | null {
  return typeof window === "undefined"
    ? null
    : window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getAuthUser(): ApiUser | null {
  if (typeof window === "undefined") return null;

  const storedUser = window.localStorage.getItem(AUTH_USER_KEY);
  if (!storedUser) return null;

  try {
    const user: unknown = JSON.parse(storedUser);
    if (
      user &&
      typeof user === "object" &&
      "id" in user &&
      typeof user.id === "string" &&
      "email" in user &&
      typeof user.email === "string" &&
      "role" in user &&
      typeof user.role === "string"
    ) {
      return { id: user.id, email: user.email, role: user.role };
    }
  } catch {
    window.localStorage.removeItem(AUTH_USER_KEY);
  }

  return null;
}

export function saveAuthSession(auth: ApiAuthResponse): void {
  window.localStorage.setItem(AUTH_TOKEN_KEY, auth.token);
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(auth.user));
  window.dispatchEvent(new Event("nardishop-auth-change"));
}

export function clearAuthSession(): void {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  window.dispatchEvent(new Event("nardishop-auth-change"));
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

export function expandCartItems(cartItems: ApiCartItem[]): Product[] {
  return cartItems.flatMap(({ product, quantity }) =>
    Array.from({ length: quantity }, () => toProduct(product))
  );
}

export async function fetchProducts(): Promise<Product[]> {
  const products = await apiRequest<ApiProduct[]>("/api/products");
  return products.map(toProduct);
}

export async function fetchProduct(id: string): Promise<Product> {
  const product = await apiRequest<ApiProduct>(`/api/products/${encodeURIComponent(id)}`);
  return toProduct(product);
}
