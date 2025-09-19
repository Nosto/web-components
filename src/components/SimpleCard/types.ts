/**
 * Shopify product data structure returned from the .js endpoint
 */
export interface ShopifyProduct {
  id: number
  title: string
  handle: string
  description: string
  published_at: string
  created_at: string
  vendor: string
  type: string
  tags: string[]
  price: number
  price_min: number
  price_max: number
  available: boolean
  price_varies: boolean
  compare_at_price: number | null
  compare_at_price_min: number
  compare_at_price_max: number
  compare_at_price_varies: boolean
  variants: ShopifyVariant[]
  images: string[]
  featured_image: string | null
  options: ShopifyOption[]
  url: string
  media: ShopifyMedia[]
}

export interface ShopifyVariant {
  id: number
  title: string
  option1: string | null
  option2: string | null
  option3: string | null
  sku: string | null
  requires_shipping: boolean
  taxable: boolean
  featured_image: ShopifyImage | null
  available: boolean
  name: string
  public_title: string
  options: string[]
  price: number
  weight: number
  compare_at_price: number | null
  inventory_management: string | null
  barcode: string | null
  featured_media: ShopifyMedia | null
}

export interface ShopifyOption {
  name: string
  position: number
  values: string[]
}

export interface ShopifyImage {
  id: number
  product_id: number
  position: number
  created_at: string
  updated_at: string
  alt: string | null
  width: number
  height: number
  src: string
  variant_ids: number[]
}

export interface ShopifyMedia {
  alt: string | null
  id: number
  position: number
  preview_image: ShopifyImage
  aspect_ratio: number
  height: number
  media_type: string
  src: string
  width: number
}
