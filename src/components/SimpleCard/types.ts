/**
 * Basic Shopify product data structure
 */
export interface ShopifyProduct {
  id: number
  title: string
  handle: string
  description: string
  published_at: string
  created_at: string
  updated_at: string
  vendor: string
  product_type: string
  tags: string[]
  price: number
  price_min: number
  price_max: number
  available: boolean
  price_varies: boolean
  compare_at_price?: number
  compare_at_price_min?: number
  compare_at_price_max?: number
  compare_at_price_varies?: boolean
  variants: ShopifyVariant[]
  images: string[]
  featured_image?: string
  options: ShopifyOption[]
  url: string
}

export interface ShopifyVariant {
  id: number
  title: string
  option1?: string
  option2?: string
  option3?: string
  sku: string
  requires_shipping: boolean
  taxable: boolean
  featured_image?: string
  available: boolean
  name: string
  public_title: string
  options: string[]
  price: number
  weight: number
  compare_at_price?: number
  inventory_management: string
  barcode: string
  featured_media?: {
    alt?: string
    id: number
    position: number
    preview_image: {
      aspect_ratio: number
      height: number
      width: number
      src: string
    }
  }
}

export interface ShopifyOption {
  name: string
  position: number
  values: string[]
}