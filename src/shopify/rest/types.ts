export type ShopifyVariant = {
  id: number
  title: string
  option1: string | null
  option2: string | null
  option3: string | null
  sku: string | null
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
  public_title: string | null
  options: string[]
  price: number
  weight: number
  compare_at_price: number | null
  inventory_quantity: number
  inventory_management: string | null
  inventory_policy: string
  barcode: string | null
  quantity_rule: {
    min: number
    max: number | null
    increment: number
  }
  quantity_price_breaks: unknown[]
  requires_selling_plan: boolean
  selling_plan_allocations: unknown[]
}

export type ShopifyOption = {
  name: string
  position: number
  values: string[]
}

export type ShopifyMedia = {
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

export type ShopifyProduct = {
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
  options: ShopifyOption[]
  url: string
  media: ShopifyMedia[]
  requires_selling_plan: boolean
  selling_plan_groups: unknown[]
}
