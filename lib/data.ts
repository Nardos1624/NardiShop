import { Product, Category } from "./types";

const products: Product[] = [
  {
    id: "1",
    name: "Minimal Desk Lamp",
    description: "A sleek, adjustable desk lamp with minimalist design.",
    price: 49.99,
    image: "/NardiShop/placeholder/lamp.png", // Added /NardiShop
    category: "Home Decor",
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    description: "Comfortable office chair with lumbar support and adjustable height.",
    price: 199.99,
    image: "/NardiShop/placeholder/chair.png", // Added /NardiShop
    category: "Furniture",
  },
  {
    id: "3",
    name: "Wireless Earbuds",
    description: "Premium wireless earbuds with noise cancellation.",
    price: 129.99,
    image: "/NardiShop/placeholder/earpod.png", // Added /NardiShop
    category: "Electronics",
  },
  {
    id: "4",
    name: "Ceramic Coffee Mug",
    description: "Handcrafted ceramic mug with minimalist design.",
    price: 24.99,
    image: "/NardiShop/placeholder/coffeemug.png", // Added /NardiShop
    category: "Kitchen",
  },
  {
    id: "5",
    name: "Leather Wallet",
    description: "Genuine leather wallet with multiple card slots.",
    price: 59.99,
    image: "/NardiShop/placeholder/wallet.png", // Added /NardiShop
    category: "Accessories",
  },
  {
    id: "6",
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health tracking capabilities.",
    price: 249.99,
    image: "/NardiShop/placeholder/smartwatch.png", // Added /NardiShop
    category: "Electronics",
  },
  {
    id: "7",
    name: "Cotton T-Shirt",
    description: "Premium cotton t-shirt with a comfortable fit.",
    price: 29.99,
    image: "/NardiShop/placeholder/cottontshirt.png", // Added /NardiShop
    category: "Clothing",
  },
  {
    id: "8",
    name: "Bluetooth Speaker",
    description: "Portable bluetooth speaker with rich sound quality.",
    price: 79.99,
    image: "/NardiShop/placeholder/bluetoothspeaker.png", // Added /NardiShop
    category: "Electronics",
  },
];

const categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    image: "/NardiShop/placeholder/iphone.png", // Added /NardiShop
  },
  {
    id: "2",
    name: "Clothing",
    slug: "clothing",
    image: "/NardiShop/placeholder/fashions.png", // Added /NardiShop
  },
  {
    id: "3",
    name: "Home Decor",
    slug: "home-decor",
    image: "/NardiShop/placeholder/homedecore.png", // Added /NardiShop
  },
  {
    id: "4",
    name: "Furniture",
    slug: "furniture",
    image: "/NardiShop/placeholder/furniture.png", // Added /NardiShop
  },
  {
    id: "5",
    name: "Kitchen",
    slug: "kitchen",
    image: "/NardiShop/placeholder/kitchen.png", // Added /NardiShop
  },
  {
    id: "6",
    name: "Accessories",
    slug: "accessories",
    image: "/NardiShop/placeholder/acessories.png", // Added /NardiShop
  },
];

// ... rest of your export functions remain the same
export function getAllProducts(): Product[] { return products; }
export function getFeaturedProducts(): Product[] { return products.slice(0, 4); }
export function getProductById(id: string): Product | undefined { return products.find((p) => p.id === id); }
export function getAllCategories(): Category[] { return categories; }
export function getCategoryBySlug(slug: string): Category | undefined { return categories.find((c) => c.slug === slug); }
export function getProductsByCategory(categoryName: string): Product[] { return products.filter((p) => p.category === categoryName); }