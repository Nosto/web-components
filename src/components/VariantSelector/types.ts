/**
 * Types for Shopify product variant data structure
 * Based on Shopify's /products/<handle>.js endpoint response
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
  featured_image: {
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
  } | null
  available: boolean
  name: string
  public_title: string
  options: string[]
  price: number
  weight: number
  compare_at_price: number | null
  inventory_management: string | null
  barcode: string | null
  featured_media: {
    alt: string | null
    id: number
    position: number
    preview_image: {
      aspect_ratio: number
      height: number
      width: number
      src: string
    }
  } | null
}

export interface ShopifyProductOption {
  name: string
  position: number
  values: string[]
}

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
  compare_at_price_min: number | null
  compare_at_price_max: number | null
  compare_at_price_varies: boolean
  variants: ShopifyVariant[]
  images: string[]
  featured_image: string
  options: ShopifyProductOption[]
  media: Array<{
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
  }>
  requires_selling_plan: boolean
  selling_plan_groups: unknown[]
  url: string
}

export interface VariantSelectionEvent {
  variant: ShopifyVariant | null
  product: ShopifyProduct
}
