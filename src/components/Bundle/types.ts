import { ShopifyProduct, ShopifyVariant } from "@/shopify/graphql/types"

export type SelectedProduct = ShopifyProduct & {
  selectedVariant: ShopifyVariant
}
