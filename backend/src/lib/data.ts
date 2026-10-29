import { Product, Category } from "./types";
import { catalog, splitCategory } from "./catalog";

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

// The store's main categories. Put each category's photo in
// frontend/public/categories/<slug>.jpg (e.g. women.jpg); until then the card shows an icon.
const categories: Category[] = catalog.map((category, index) => ({
  id: String(index + 1),
  name: category.name,
  slug: category.slug,
  image: `/categories/${category.slug}.jpg`,
}));

// ... rest of your export functions remain the same
export function getAllProducts(): Product[] { return products; }
export function getFeaturedProducts(): Product[] { return products.slice(0, 4); }
export function getProductById(id: string): Product | undefined { return products.find((p) => p.id === id); }
export function getProductCategoryByName(name: string): string | undefined {
  return products.find((product) => product.name.toLowerCase() === name.toLowerCase())?.category;
}
export function getAllCategories(): Category[] { return categories; }
export function getCategoryBySlug(slug: string): Category | undefined { return categories.find((c) => c.slug === slug); }
export function getCategorySlug(name: string): string {
  return name
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
export function getCategoriesForProducts(products: Product[]): Category[] {
  const allCategories = [...categories];
  const knownNames = new Set(categories.map((category) => category.name.toLowerCase()));

  for (const product of products) {
    // "Women's Clothes / Dresses" belongs to the "Women's Clothes" category
    const name = splitCategory(product.category).main;
    const normalizedName = name.toLowerCase();
    if (!name || knownNames.has(normalizedName)) continue;

    knownNames.add(normalizedName);
    allCategories.push({
      id: `product-category-${getCategorySlug(name)}`,
      name,
      slug: getCategorySlug(name),
      image: product.image,
    });
  }

  return allCategories;
}
export function getProductsByCategory(categoryName: string): Product[] { return products.filter((p) => p.category === categoryName); }