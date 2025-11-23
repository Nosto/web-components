import { ShopifyVariant, VariantChangeDetail } from "@/shopify/graphql/types"
import { VariantSelector } from "./VariantSelector"
import { parseId, toHandle } from "@/shopify/graphql/utils"

export function emitVariantChange(element: VariantSelector, variant: ShopifyVariant) {
  const handle = toHandle(variant.product.onlineStoreUrl)
  if (handle) {
    element.handle = handle
  }
  element.variantId = parseId(variant.id)
  const detail: VariantChangeDetail = { variant }
  element.dispatchEvent(
    new CustomEvent("variantchange", {
      detail,
      bubbles: true
    })
  )
}
