import { ShopifyVariant, VariantChangeDetail } from "@/shopify/graphql/types"
import { VariantSelector } from "./VariantSelector"
import { parseId, toHandle } from "@/shopify/graphql/utils"

export const EVENT_NAME_VARIANT_CHANGE = "@nosto/VariantSelector/variantchange"

export function emitVariantChange(element: VariantSelector, variant: ShopifyVariant) {
  const handle = toHandle(variant.product.onlineStoreUrl)
  const selectedVariantId = parseId(variant.id)
  if (element.variantId === selectedVariantId && element.handle === handle) {
    return
  }
  if (handle) {
    element.handle = handle
  }
  element.variantId = selectedVariantId
  const detail: VariantChangeDetail = {
    variantId: variant.id,
    productId: variant.product.id,
    handle: handle
  }
  element.dispatchEvent(
    new CustomEvent(EVENT_NAME_VARIANT_CHANGE, {
      detail,
      bubbles: true
    })
  )
}
