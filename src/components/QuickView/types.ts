/**
 * Selected variant option values for QuickView
 */
export interface SelectedOptions {
  [optionName: string]: string
}

/**
 * Shopify product variant type from the product.js API
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
  price: number
  grams: number
  compare_at_price: number | null
  position: number
  product_id: number
  created_at: string
  updated_at: string
}

/**
 * Shopify product option type from the product.js API
 */
export interface ShopifyProductOption {
  id: number
  product_id: number
  name: string
  position: number
  values: string[]
}

/**
 * Shopify product image type from the product.js API
 */
export interface ShopifyProductImage {
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
 * Shopify product type from the product.js API endpoint
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
  images: ShopifyProductImage[]
  featured_image: string | null
  options: ShopifyProductOption[]
  url: string
  media: unknown[]
}
