import { fetchProduct } from "@/shopify/graphql/fetchProduct"
import type { VariantSelector } from "../VariantSelector"
import type { ShopifyProduct, ShopifyVariant } from "@/shopify/graphql/types"

/**
 * Helper function to select an option in the VariantSelector.
 * Used by tests and can be called programmatically.
 */
export async function selectOption(element: VariantSelector, optionName: string, value: string) {
  if (element.selectedOptions[optionName] === value) {
    return
  }
  element.selectedOptions[optionName] = value

  // Trigger re-render through attribute change to update visual state
  const renderer = (element as { renderer?: { updateSelection?: (el: VariantSelector) => void } }).renderer
  if (renderer && renderer.updateSelection) {
    renderer.updateSelection(element)
  }

  // Fetch product data and emit variant change
  const productData = await fetchProduct(element.handle)
  const variant = getSelectedVariant(element, productData)
  if (variant) {
    const { parseId } = await import("@/shopify/graphql/utils")
    element.variantId = parseId(variant.id)
    element.dispatchEvent(
      new CustomEvent("variantchange", {
        detail: { variant },
        bubbles: true
      })
    )
  }
}

/**
 * Helper function to get the currently selected variant based on the element's selectedOptions.
 */
export function getSelectedVariant(element: VariantSelector, product: ShopifyProduct): ShopifyVariant | null {
  return (
    product.variants?.find(variant => {
      if (!variant.selectedOptions) return false
      return product.options.every(option => {
        const selectedValue = element.selectedOptions[option.name]
        const variantOption = variant.selectedOptions!.find(so => so.name === option.name)
        return variantOption && selectedValue === variantOption.value
      })
    }) || null
  )
}
