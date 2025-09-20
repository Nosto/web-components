// Shopify product JSON type definitions
export interface ShopifyImage {
  id: number
  src: string
  alt: string | null
  width: number
  height: number
}

export interface ShopifyVariant {
  id: number
  price: number
  compare_at_price: number
  available: boolean
  title: string
}

export interface ShopifyProduct {
  id: number
  title: string
  handle: string
  description: string
  vendor: string
  product_type: string
  tags: string[]
  images: ShopifyImage[]
  variants: ShopifyVariant[]
}