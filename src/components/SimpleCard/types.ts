export type ShopifyVariant = {
  id: number
  name: string
  option1: string | null
  option2: string | null
  option3: string | null
  featured_image: {
    src: string
  } | null
  available: boolean
  options: string[]
  price: number
  compare_at_price: number | null
}

export type ShopifyOption = {
  name: string
  values: string[]
}

export type ShopifyMedia = {
  src: string
  alt: string | null
  aspect_ratio: number
  preview_image: {
    aspect_ratio: number
    height: number
    width: number
    src: string
  }
}

export type ShopifyProduct = {
  id: number
  title: string
  vendor: string
  price: number
  compare_at_price: number | null
  variants: ShopifyVariant[]
  images: string[]
  options: ShopifyOption[]
  url: string
  media: ShopifyMedia[]
}

/**
 * Event detail for variant change events
 */
export type VariantChangeDetail = {
  variant: ShopifyVariant
}
