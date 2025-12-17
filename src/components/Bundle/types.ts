import { ShopifyProduct, ShopifyVariant } from "@/shopify/graphql/types"

export type SelectableProduct = ShopifyProduct & {
  selected: boolean
  selectedVariant: ShopifyVariant
}
