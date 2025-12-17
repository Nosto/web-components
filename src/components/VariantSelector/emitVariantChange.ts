import { ShopifyVariant, VariantChangeDetail } from "@/shopify/graphql/types"
import { VariantSelector } from "./VariantSelector"
import { parseId } from "@/shopify/graphql/utils"

export const EVENT_NAME_VARIANT_CHANGE = "@nosto/variantchange"

export type VariantProduct = {
  productId: string
  handle: string
}

export function emitVariantChange(
  element: VariantSelector,
  { productId, handle }: VariantProduct,
  variant: ShopifyVariant
) {
  const selectedVariantId = parseId(variant.id)
  if (element.variantId === selectedVariantId && element.handle === handle) {
    return
  }

  element.handle = handle

  element.variantId = selectedVariantId
  const detail: VariantChangeDetail = {
    variantId: variant.id,
    productId,
    handle
  }
  element.dispatchEvent(
    new CustomEvent(EVENT_NAME_VARIANT_CHANGE, {
      detail,
      bubbles: true
    })
  )
}
