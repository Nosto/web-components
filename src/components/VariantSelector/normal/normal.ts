import { fetchProduct } from "@/shopify/graphql/fetchProduct"
import { ShopifyProduct } from "@/shopify/graphql/types"
import type { VariantSelector } from "../VariantSelector"
import { emitVariantChange } from "../VariantSelector"

export function setupDefaultListeners(element: VariantSelector) {
  // Handle click events for option buttons in default mode
  element.shadowRoot!.addEventListener("click", async e => {
    const target = e.target as HTMLElement
    if (target.classList.contains("value")) {
      e.preventDefault()
      const { optionName, optionValue } = target.dataset
      if (optionName && optionValue) {
        await selectOption(element, optionName, optionValue)
      }
    }
  })
}

export async function selectOption(element: VariantSelector, optionName: string, value: string) {
  if (element.selectedOptions[optionName] === value) {
    return
  }
  element.selectedOptions[optionName] = value
  updateDefaultActiveStates(element)

  // Fetch product data and emit variant change
  const productData = await fetchProduct(element.handle)
  emitVariantChange(element, productData)
}

export function updateDefaultActiveStates(element: VariantSelector) {
  // Update pill buttons in default mode
  element.shadowRoot!.querySelectorAll<HTMLElement>(".value").forEach(button => {
    const { optionName, optionValue } = button.dataset
    const active = !!optionName && element.selectedOptions[optionName] === optionValue
    togglePart(button, "active", active)
  })
}

export function updateUnavailableStates(element: VariantSelector, product: ShopifyProduct) {
  const availableOptions = new Set<string>()
  product.variants
    .filter(v => v.availableForSale)
    .forEach(variant => {
      if (variant.selectedOptions) {
        variant.selectedOptions.forEach(selectedOption => {
          availableOptions.add(`${selectedOption.name}::${selectedOption.value}`)
        })
      }
    })
  element.shadowRoot!.querySelectorAll<HTMLElement>(".value").forEach(button => {
    const { optionName, optionValue } = button.dataset
    const available = availableOptions.has(`${optionName}::${optionValue}`)
    togglePart(button, "unavailable", !available)
  })
}

function togglePart(element: HTMLElement, partName: string, enable: boolean) {
  const parts = new Set(element.getAttribute("part")?.split(" ").filter(Boolean) || [])
  if (enable) {
    parts.add(partName)
  } else {
    parts.delete(partName)
  }
  element.setAttribute("part", Array.from(parts).join(" "))
}
