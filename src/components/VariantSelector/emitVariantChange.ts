import { ShopifyVariant, VariantChangeDetail } from "@/shopify/types"
import { VariantSelector } from "./VariantSelector"
import { parseId, toHandle } from "@/shopify/graphql/utils"

export const EVENT_NAME_VARIANT_CHANGE = "@nosto/VariantSelector/variantchange"

export function emitVariantChange(element: VariantSelector, variant: ShopifyVariant) {
  const handle = toHandle(variant.product.onlineStoreUrl)
  if (handle) {
    element.handle = handle
  }
  element.variantId = parseId(variant.id)
  const detail: VariantChangeDetail = { variant }
  element.dispatchEvent(
    new CustomEvent(EVENT_NAME_VARIANT_CHANGE, {
      detail,
      bubbles: true
    })
  )
}
