import { VariantChangeDetail } from "@/shopify/graphql/types"
import { VariantSelector } from "./VariantSelector"
import { parseId } from "@/shopify/graphql/utils"

export const EVENT_NAME_VARIANT_CHANGE = "@nosto/variantchange"

export function emitVariantChange(element: VariantSelector, detail: VariantChangeDetail) {
  const selectedVariantId = parseId(detail.variantId)
  if (element.variantId === selectedVariantId && element.handle === detail.handle) {
    return
  }
  element.handle = detail.handle
  element.variantId = selectedVariantId
  element.dispatchEvent(
    new CustomEvent(EVENT_NAME_VARIANT_CHANGE, {
      detail,
      bubbles: true
    })
  )
}
