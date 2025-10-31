import { ShopifyProduct, ShopifyVariant } from "@/shopify/types"

/**
 * Props for the SimpleCard custom element
 */
export type SimpleCardProps = {
  /** The Shopify product handle to fetch data for. Required */
  handle: string
  /** Show alternate product image on hover */
  alternate?: boolean
  /** Show brand/vendor data */
  brand?: boolean
  /** Show discount data */
  discount?: boolean
  /** Show product rating */
  rating?: number
  /** The sizes attribute for responsive images */
  sizes?: string
}

export type SimpleProduct = Pick<
  ShopifyProduct,
  "title" | "vendor" | "url" | "images" | "compare_at_price" | "price"
> & { media?: SimpleMedia[] }

type SimpleMedia = Pick<ShopifyProduct["media"][0], "src">

export type SimpleVariant = Pick<ShopifyVariant, "featured_image" | "name" | "compare_at_price" | "price">
