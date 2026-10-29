export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  /** The size the shopper chose (only set on items in the cart) */
  size?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
}