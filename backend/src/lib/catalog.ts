import {
  Baby,
  BedDouble,
  Dumbbell,
  Footprints,
  Gem,
  type LucideIcon,
  Moon,
  Shirt,
  ShoppingBag,
  Smartphone,
  Smile,
  Sparkles,
  User,
} from "lucide-react";

// A product's category is saved as "Main / Sub", e.g. "Women / Dresses"
export const CATEGORY_SEPARATOR = " / ";

// Size lists used by the categories below
const SIZES = {
  adult: ["XS", "S", "M", "L", "XL", "XXL"],
  menWaist: ["28", "30", "32", "34", "36", "38", "40"],
  womenWaist: ["24", "26", "28", "30", "32", "34"],
  kids: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
  kidsShoes: ["24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35"],
  baby: ["0-3M", "3-6M", "6-12M", "12-18M", "18-24M"],
  womenShoes: ["36", "37", "38", "39", "40", "41"],
  menShoes: ["39", "40", "41", "42", "43", "44", "45", "46"],
  rings: ["5", "6", "7", "8", "9", "10"],
  bedding: ["Single", "Double", "Queen", "King"],
};

export interface Subcategory {
  name: string;
  /** Overrides the main category's sizes; an empty list means no size */
  sizes?: string[];
}

export interface MainCategory {
  name: string;
  slug: string;
  icon: LucideIcon;
  /** Sizes for every subcategory unless the subcategory sets its own */
  sizes?: string[];
  subcategories: Subcategory[];
}

export const catalog: MainCategory[] = [
  {
    name: "Women's Bags",
    slug: "womens-bags",
    icon: ShoppingBag,
    subcategories: [
      { name: "Handbags" },
      { name: "Shoulder Bags" },
      { name: "Crossbody Bags" },
      { name: "Tote Bags" },
      { name: "Backpacks" },
      { name: "Clutches & Wallets" },
    ],
  },
  {
    name: "Men's Clothes",
    slug: "men",
    icon: User,
    sizes: SIZES.adult,
    subcategories: [
      { name: "T-Shirts" },
      { name: "Shirts" },
      { name: "Polo Shirts" },
      { name: "Hoodies & Sweatshirts" },
      { name: "Jackets & Coats" },
      { name: "Suits & Blazers" },
      { name: "Trousers", sizes: SIZES.menWaist },
      { name: "Jeans", sizes: SIZES.menWaist },
      { name: "Shorts" },
    ],
  },
  {
    name: "Women's Clothes",
    slug: "women",
    icon: Sparkles,
    sizes: SIZES.adult,
    subcategories: [
      { name: "Dresses" },
      { name: "Tops & Blouses" },
      { name: "T-Shirts" },
      { name: "Hoodies & Sweatshirts" },
      { name: "Jackets & Coats" },
      { name: "Skirts" },
      { name: "Jumpsuits" },
      { name: "Trousers", sizes: SIZES.womenWaist },
      { name: "Jeans", sizes: SIZES.womenWaist },
    ],
  },
  {
    name: "Kids ",
    slug: "kids",
    icon: Smile,
    sizes: SIZES.kids,
    subcategories: [
      { name: "Boys' Clothing" },
      { name: "Girls' Clothing" },
      { name: "Kids' Sleepwear" },
      { name: "Kids' Shoes", sizes: SIZES.kidsShoes },
    ],
  },
  {
    name: "Baby & Maternity",
    slug: "baby-maternity",
    icon: Baby,
    subcategories: [
      { name: "Baby Clothing", sizes: SIZES.baby },
      { name: "Baby Essentials" },
      { name: "Maternity Clothing", sizes: SIZES.adult },
    ],
  },
  {
    name: "Jewelry & Accessories",
    slug: "jewelry-accessories",
    icon: Gem,
    subcategories: [
      { name: "Necklaces" },
      { name: "Earrings" },
      { name: "Bracelets" },
      { name: "Rings", sizes: SIZES.rings },
      { name: "Watches" },
      { name: "Sunglasses" },
      { name: "Hair Accessories" },
      { name: "Belts" },
    ],
  },
  {
    name: "Home Textiles",
    slug: "home-textiles",
    icon: BedDouble,
    subcategories: [
      { name: "Bedding & Bed Sheets", sizes: SIZES.bedding },
      { name: "Blankets", sizes: SIZES.bedding },
      { name: "Towels" },
      { name: "Curtains" },
      { name: "Cushions & Covers" },
    ],
  },
  {
    name: "Women's Shoes",
    slug: "womens-shoes",
    icon: Footprints,
    sizes: SIZES.womenShoes,
    subcategories: [
      { name: "Sneakers" },
      { name: "Heels" },
      { name: "Flats & Sandals" },
      { name: "Boots" },
      { name: "Slippers" },
    ],
  },
  {
    name: "Men's Shoes",
    slug: "mens-shoes",
    icon: Footprints,
    sizes: SIZES.menShoes,
    subcategories: [
      { name: "Sneakers" },
      { name: "Formal Shoes" },
      { name: "Sandals" },
      { name: "Boots" },
      { name: "Slippers" },
    ],
  },
  {
    name: "Sleepwear",
    slug: "sleepwear",
    icon: Moon,
    sizes: SIZES.adult,
    subcategories: [{ name: "Women's Sleepwear" }, { name: "Men's Sleepwear" }],
  },
  {
    name: "Sportswear",
    slug: "sportswear",
    icon: Dumbbell,
    sizes: SIZES.adult,
    subcategories: [{ name: "Women's Sportswear" }, { name: "Men's Sportswear" }],
  },
  {
    name: "Appliances for Girls",
    slug: "appliances-for-girls",
    icon: Sparkles,
    subcategories: [
      { name: "Hair Straighteners" },
      { name: "Hair Dryers" },
      { name: "Curling Irons" },
      { name: "Beauty Devices" },
    ],
  },
  {
    name: "Phone Cases",
    slug: "phone-cases",
    icon: Smartphone,
    subcategories: [{ name: "iPhone Cases" }, { name: "Samsung Cases" }, { name: "Other Phone Cases" }],
  },
];

/** Default icon for categories that are not in the catalog */
export const fallbackCategoryIcon: LucideIcon = Shirt;

/** Builds the stored category value, e.g. ("Women's Clothes", "Dresses") -> "Women's Clothes / Dresses" */
export function joinCategory(main: string, sub?: string): string {
  return sub ? `${main}${CATEGORY_SEPARATOR}${sub}` : main;
}

/** Splits a stored category value into its main category and subcategory */
export function splitCategory(category: string): { main: string; sub?: string } {
  const [rawMain, ...rest] = category.split(CATEGORY_SEPARATOR);
  const main = (rawMain ?? "").trim();
  const sub = rest.join(CATEGORY_SEPARATOR).trim() || undefined;

  // Products saved before "Men"/"Women" were renamed to "Men's Clothes"/"Women's Clothes"
  if (main.toLowerCase() === "men") return { main: "Men's Clothes", sub };
  if (main.toLowerCase() === "women") return { main: "Women's Clothes", sub };

  // Products saved before Shoes was split, e.g. "Shoes / Women's Sneakers",
  // are read as "Women's Shoes / Sneakers" (and "Men's ..." as "Men's Shoes")
  if (main.toLowerCase() === "shoes" && sub) {
    const legacy = sub.match(/^(Women's|Men's)\s+(.+)$/i);
    if (legacy) {
      const gender = legacy[1]!.toLowerCase() === "women's" ? "Women's" : "Men's";
      return { main: `${gender} Shoes`, sub: legacy[2] };
    }
  }

  return { main, sub };
}

export function findMainCategory(name: string): MainCategory | undefined {
  const normalized = name.trim().toLowerCase();
  return catalog.find((category) => category.name.toLowerCase() === normalized);
}

/** The sizes a shopper can choose for a product in this category (empty = no size) */
export function getSizesForCategory(category: string): string[] {
  const { main, sub } = splitCategory(category);
  const mainCategory = findMainCategory(main);
  if (!mainCategory) return [];

  const subcategory = sub
    ? mainCategory.subcategories.find((item) => item.name.toLowerCase() === sub.toLowerCase())
    : undefined;
  return subcategory?.sizes ?? mainCategory.sizes ?? [];
}
