export type ShopifyVariant = {
  id: number
  name: string
  price: number
  compare_at_price: number | null
  featured_image: {
    src: string
  } | null
}

export type ShopifyMedia = {
  src: string
  aspect_ratio: number
}

export type ShopifyProduct = {
  id: number
  title: string
  vendor: string
  price: number
  compare_at_price: number | null
  url: string
  images: string[]
  media: ShopifyMedia[]
  // Keep these minimal fields for compatibility
  handle?: string
  description?: string
  tags?: string[]
  featured_image?: string
  variants?: ShopifyVariant[]
}

/**
 * Event detail for variant change events
 */
export type VariantChangeDetail = {
  variant: ShopifyVariant
}
