import { ShopifyProduct, ShopifyVariant } from "@/shopify/types"

export type SimpleProduct = Pick<
  ShopifyProduct,
  "title" | "vendor" | "url" | "images" | "compare_at_price" | "price"
> & { media?: SimpleMedia[] }

type SimpleMedia = Pick<ShopifyProduct["media"][0], "src">

export type SimpleVariant = Pick<ShopifyVariant, "featured_image" | "name" | "compare_at_price" | "price">
