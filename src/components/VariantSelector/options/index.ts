import { fetchProduct } from "@/shopify/graphql/fetchProduct"
import { VariantSelector } from "../VariantSelector"
import { generateVariantSelectorHTML } from "./markup"
import { shadowContentFactory } from "@/utils/shadowContentFactory"
import styles from "./styles.css?raw"
import { ShopifyProduct, ShopifyVariant } from "@/shopify/graphql/types"
import { toVariantGid } from "@/shopify/graphql/utils"
import { emitVariantChange } from "../emitVariantChange"

const VARIANT_SELECTOR_RENDERED_EVENT = "@nosto/VariantSelector/rendered"

const setShadowContent = shadowContentFactory(styles)

let placeholder = ""

export async function loadAndRenderMarkup(element: VariantSelector, initial = false) {
  if (initial && element.placeholder && placeholder) {
    element.toggleAttribute("loading", true)
    setShadowContent(element, placeholder)
  }
  element.toggleAttribute("loading", true)
  try {
    const productData = await fetchProduct(element.handle)

    // Initialize selections with first value of each option
    initializeDefaultSelections(element, productData)

    const selectorHTML = generateVariantSelectorHTML(element, productData)
    setShadowContent(element, selectorHTML.html)

    // Cache the rendered HTML for placeholder use
    placeholder = selectorHTML.html

    // Setup event listeners for option buttons
    setupOptionListeners(element)

    // active state for selected options
    updateActiveStates(element)
    // unavailable state for options without available variants
    updateUnavailableStates(element, productData)
    // TODO disabled state

    if (Object.keys(element.selectedOptions).length > 0) {
      const variant = getSelectedVariant(element, productData)
      if (variant) {
        emitVariantChange(element, { productId: productData.id, handle: productData.handle }, variant)
      }
    }

    element.dispatchEvent(new CustomEvent(VARIANT_SELECTOR_RENDERED_EVENT, { bubbles: true, cancelable: true }))
  } finally {
    element.toggleAttribute("loading", false)
  }
}

function initializeDefaultSelections(element: VariantSelector, product: ShopifyProduct) {
  let variant: ShopifyVariant | undefined
  if (element.variantId) {
    const variantIdStr = toVariantGid(element.variantId)
    variant = product.combinedVariants.find(v => v.id === variantIdStr)
  } else if (element.preselect) {
    variant = product.combinedVariants.find(
      v => v.availableForSale && v.product.onlineStoreUrl === product.onlineStoreUrl
    )
  }
  if (variant && variant.selectedOptions) {
    variant.selectedOptions.forEach(selectedOption => {
      element.selectedOptions[selectedOption.name] = selectedOption.value
    })
  } else {
    product.options.forEach(option => {
      if (option.optionValues.length === 1) {
        element.selectedOptions[option.name] = option.optionValues[0].name
      }
    })
  }
}

function setupOptionListeners(element: VariantSelector) {
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
  updateActiveStates(element)

  // Fetch product data and emit variant change
  const productData = await fetchProduct(element.handle)
  const variant = getSelectedVariant(element, productData)
  if (variant) {
    emitVariantChange(element, { productId: productData.id, handle: productData.handle }, variant)
  }
}

function updateActiveStates(element: VariantSelector) {
  element.shadowRoot!.querySelectorAll<HTMLElement>(".value").forEach(button => {
    const { optionName, optionValue } = button.dataset
    const active = !!optionName && element.selectedOptions[optionName] === optionValue
    togglePart(button, "active", active)
  })
}

function updateUnavailableStates(element: VariantSelector, product: ShopifyProduct) {
  const availableOptions = new Set<string>()
  product.combinedVariants
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

export function getSelectedVariant(element: VariantSelector, product: ShopifyProduct): ShopifyVariant | null {
  return (
    product.combinedVariants?.find(variant => {
      if (!variant.selectedOptions) return false
      return product.options.every(option => {
        const selectedValue = element.selectedOptions[option.name]
        const variantOption = variant.selectedOptions!.find(so => so.name === option.name)
        return variantOption && selectedValue === variantOption.value
      })
    }) || null
  )
}
