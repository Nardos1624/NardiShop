import { Product, Category } from "./types";

const products: Product[] = [
  {
    id: "1",
    name: "Minimal Desk Lamp",
    description: "A sleek, adjustable desk lamp with minimalist design.",
    price: 49.99,
    image: "/placeholder/lamp.png", 
    category: "Home Decor",
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    description: "Comfortable office chair with lumbar support and adjustable height.",
    price: 199.99,
    image: "/placeholder/chair.png",
    category: "Furniture",
  },
  {
    id: "3",
    name: "Wireless Earbuds",
    description: "Premium wireless earbuds with noise cancellation.",
    price: 129.99,
    image: "/placeholder/earpod.png",
    category: "Electronics",
  },
  {
    id: "4",
    name: "Ceramic Coffee Mug",
    description: "Handcrafted ceramic mug with minimalist design.",
    price: 24.99,
    image: "/placeholder/coffeemug.png",
    category: "Kitchen",
  },
  {
    id: "5",
    name: "Leather Wallet",
    description: "Genuine leather wallet with multiple card slots.",
    price: 59.99,
    image: "/placeholder/wallet.png", 
    category: "Accessories",
  },
  {
    id: "6",
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health tracking capabilities.",
    price: 249.99,
    image: "/placeholder/smartwatch.png",
    category: "Electronics",
  },
  {
    id: "7",
    name: "Cotton T-Shirt",
    description: "Premium cotton t-shirt with a comfortable fit.",
    price: 29.99,
    image: "/placeholder/cottontshirt.png",
    category: "Clothing",
  },
  {
    id: "8",
    name: "Bluetooth Speaker",
    description: "Portable bluetooth speaker with rich sound quality.",
    price: 79.99,
    image: "/placeholder/bluetoothspeaker.png",
    category: "Electronics",
  },
];

const categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    image: "/placeholder/iphones.png", 
  },
  {
    id: "2",
    name: "Clothing",
    slug: "clothing",
    image: "/placeholder/fashions.png",
  },
  {
    id: "3",
    name: "Home Decor",
    slug: "home-decor",
    image: "/placeholder/homedecore.png", 
  },
  {
    id: "4",
    name: "Furniture",
    slug: "furniture",
    image: "/placeholder/furniture.png",
  },
  {
    id: "5",
    name: "Kitchen",
    slug: "kitchen",
    image: "/placeholder/kitchen.png", 
  },
  {
    id: "6",
    name: "Accessories",
    slug: "accessories",
    image: "/placeholder/acessories.png", 
  },
];

// ... rest of your export functions remain the same
export function getAllProducts(): Product[] { return products; }
export function getFeaturedProducts(): Product[] { return products.slice(0, 4); }
export function getProductById(id: string): Product | undefined { return products.find((p) => p.id === id); }
export function getAllCategories(): Category[] { return categories; }
export function getCategoryBySlug(slug: string): Category | undefined { return categories.find((c) => c.slug === slug); }
export function getProductsByCategory(categoryName: string): Product[] { return products.filter((p) => p.category === categoryName); }