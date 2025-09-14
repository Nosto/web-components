/**
 * Shopify product data structure from the .js endpoint
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
  featured_image: string
  options: ShopifyProductOption[]
  url: string
  media: ShopifyMedia[]
}

/**
 * Shopify product variant data
 */
export interface ShopifyVariant {
  id: number
  title: string
  option1: string | null
  option2: string | null
  option3: string | null
  sku: string
  requires_shipping: boolean
  taxable: boolean
  featured_image: ShopifyVariantImage | null
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

/**
 * Shopify product option (e.g., Color, Size)
 */
export interface ShopifyProductOption {
  name: string
  position: number
  values: string[]
}

/**
 * Shopify variant image data
 */
export interface ShopifyVariantImage {
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

/**
 * Shopify media data (images, videos, etc.)
 */
export interface ShopifyMedia {
  alt: string | null
  id: number
  position: number
  preview_image: {
    aspect_ratio: number
    height: number
    width: number
    src: string
  }
  aspect_ratio: number
  height: number
  media_type: string
  src: string
  width: number
}

/**
 * Shopify cart add request payload
 */
export interface ShopifyCartAddRequest {
  id: number
  quantity?: number
  properties?: Record<string, string>
  selling_plan?: number
}

/**
 * Shopify cart add response
 */
export interface ShopifyCartAddResponse {
  id: number
  properties: Record<string, string>
  quantity: number
  variant_id: number
  key: string
  title: string
  price: number
  original_price: number
  discounted_price: number
  line_price: number
  original_line_price: number
  total_discount: number
  discounts: unknown[]
  sku: string
  grams: number
  vendor: string
  taxable: boolean
  product_id: number
  product_has_only_default_variant: boolean
  gift_card: boolean
  final_price: number
  final_line_price: number
  url: string
  featured_image: {
    aspect_ratio: number
    alt: string
    height: number
    url: string
    width: number
  }
  image: string
  handle: string
  requires_shipping: boolean
  product_type: string
  product_title: string
  product_description: string
  variant_title: string
  variant_options: string[]
}

/**
 * QuickView component props
 */
export interface QuickViewProps {
  handle: string
}
