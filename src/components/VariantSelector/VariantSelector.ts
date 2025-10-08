import { assertRequired } from "@/utils/assertRequired"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct, ShopifyVariant, VariantChangeDetail } from "../SimpleCard/types"
import { generateVariantSelectorHTML } from "./markup"
import styles from "./styles.css?raw"

// Cache the stylesheet for reuse across component instances
let cachedStyleSheet: CSSStyleSheet | null = null

/**
 * A custom element that displays product variant options as clickable pills.
 *
 * Fetches product data from `/products/<handle>.js` and renders option rows with
 * clickable value pills. Optionally preselects the first value for each option and highlights
 * the currently selected choices. Emits a custom event when variant selections change.
 *
 * The component renders inside a shadow DOM with encapsulated styles. Styling can be
 * customized using CSS custom properties.
 *
 * @category Category level templating
 *
 * @property {string} handle - The Shopify product handle to fetch data for. Required.
 * @property {boolean} preselect - Whether to automatically preselect the first value for each option. Defaults to false.
 *
 * @fires variantchange - Emitted when variant selection changes, contains { variant, product }
 *
 * @example
 * ```html
 * <nosto-variant-selector handle="awesome-product"></nosto-variant-selector>
 * ```
 */
@customElement("nosto-variant-selector", { observe: true })
export class VariantSelector extends NostoElement {
  /** @private */
  static attributes = {
    handle: String,
    preselect: Boolean
  }

  handle!: string
  preselect?: boolean

  /** Internal state for current selections */
  selectedOptions: Record<string, string> = {}

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  async attributeChangedCallback() {
    if (this.isConnected) {
      await loadAndRenderMarkup(this)
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    await loadAndRenderMarkup(this)
  }
}

async function loadAndRenderMarkup(element: VariantSelector) {
  element.toggleAttribute("loading", true)
  try {
    const productData = await fetchProductData(element.handle)

    // Initialize selections with first value of each option
    initializeDefaultSelections(element, productData)

    const selectorHTML = generateVariantSelectorHTML(element, productData)

    // Use constructible stylesheets if supported, fallback to inline styles
    if ("adoptedStyleSheets" in element.shadowRoot!) {
      if (!cachedStyleSheet) {
        cachedStyleSheet = new CSSStyleSheet()
        await cachedStyleSheet.replace(styles)
      }
      element.shadowRoot!.adoptedStyleSheets = [cachedStyleSheet]
      element.shadowRoot!.innerHTML = selectorHTML.html
    } else {
      element.shadowRoot!.innerHTML = `
        <style>${styles}</style>
        ${selectorHTML.html}
      `
    }

    // Setup event listeners for option buttons
    setupOptionListeners(element)

    updateActiveStates(element)

    // Update availability states based on current selections
    updateAvailabilityStates(element, productData)

    if (Object.keys(element.selectedOptions).length > 0) {
      emitVariantChange(element, productData)
    }
  } finally {
    element.toggleAttribute("loading", false)
  }
}

function initializeDefaultSelections(element: VariantSelector, product: ShopifyProduct) {
  if (element.preselect) {
    product.options.forEach(option => {
      if (option.values.length > 0) {
        element.selectedOptions[option.name] = option.values[0]
      }
    })
  }
}

function setupOptionListeners(element: VariantSelector) {
  if (!element.shadowRoot) return

  element.shadowRoot.addEventListener("click", async e => {
    const target = e.target as HTMLElement
    if (target.classList.contains("value")) {
      e.preventDefault()

      // Prevent selection of disabled options
      if (target.hasAttribute("disabled")) {
        return
      }

      const optionName = target.getAttribute("data-option-name")
      const optionValue = target.getAttribute("data-option-value")

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

  // Update active states synchronously first
  updateActiveStates(element)

  // Fetch product data for availability updates and variant change
  const productData = await fetchProductData(element.handle)
  
  // Update availability states with fresh data
  updateAvailabilityStates(element, productData)
  
  emitVariantChange(element, productData)
}

function updateActiveStates(element: VariantSelector) {
  if (!element.shadowRoot) return

  element.shadowRoot.querySelectorAll(".value").forEach(button => {
    const optionName = button.getAttribute("data-option-name")
    const optionValue = button.getAttribute("data-option-value")

    if (optionName && element.selectedOptions[optionName] === optionValue) {
      button.classList.add("active")
    } else {
      button.classList.remove("active")
    }
  })
}

function updateAvailabilityStates(element: VariantSelector, product: ShopifyProduct) {
  if (!element.shadowRoot) return

  element.shadowRoot.querySelectorAll(".value").forEach(button => {
    const optionName = button.getAttribute("data-option-name")
    const optionValue = button.getAttribute("data-option-value")

    if (optionName && optionValue) {
      // Update availability state
      const isDisabled = isOptionValueDisabled(product, optionName, optionValue, element.selectedOptions)
      const isUnavailable = isOptionValueUnavailable(product, optionName, optionValue, element.selectedOptions)

      button.toggleAttribute("disabled", isDisabled)
      if (isUnavailable) {
        button.setAttribute("data-status", "unavailable")
      } else {
        button.removeAttribute("data-status")
      }
    }
  })
}

function updateActiveAndAvailabilityStates(element: VariantSelector, product: ShopifyProduct) {
  if (!element.shadowRoot) return

  element.shadowRoot.querySelectorAll(".value").forEach(button => {
    const optionName = button.getAttribute("data-option-name")
    const optionValue = button.getAttribute("data-option-value")

    if (optionName && optionValue) {
      // Update active state
      if (element.selectedOptions[optionName] === optionValue) {
        button.classList.add("active")
      } else {
        button.classList.remove("active")
      }

      // Update availability state
      const isDisabled = isOptionValueDisabled(product, optionName, optionValue, element.selectedOptions)
      const isUnavailable = isOptionValueUnavailable(product, optionName, optionValue, element.selectedOptions)

      button.toggleAttribute("disabled", isDisabled)
      if (isUnavailable) {
        button.setAttribute("data-status", "unavailable")
      } else {
        button.removeAttribute("data-status")
      }
    }
  })
}

function emitVariantChange(element: VariantSelector, product: ShopifyProduct) {
  const variant = getSelectedVariant(element, product)
  if (variant) {
    const detail: VariantChangeDetail = { variant }
    element.dispatchEvent(
      new CustomEvent("variantchange", {
        detail,
        bubbles: true
      })
    )
  }
}

export function getSelectedVariant(element: VariantSelector, product: ShopifyProduct): ShopifyVariant | null {
  if (!product?.variants) return null

  return (
    product.variants.find(variant => {
      return product.options.every((option, index) => {
        const selectedValue = element.selectedOptions[option.name]
        const variantValue = variant.options[index]
        return selectedValue === variantValue
      })
    }) || null
  )
}

async function fetchProductData(handle: string) {
  const url = createShopifyUrl(`products/${handle}.js`)
  return getJSON<ShopifyProduct>(url.href, { cached: true })
}

/**
 * Get all variants that would match if a specific option value is selected
 */
function getVariantsForOptionValue(
  product: ShopifyProduct,
  targetOptionName: string,
  targetValue: string,
  currentSelections: Record<string, string>
): ShopifyVariant[] {
  if (!product?.variants) return []

  return product.variants.filter(variant => {
    return product.options.every((option, index) => {
      const variantValue = variant.options[index]

      if (option.name === targetOptionName) {
        // For the target option, check if it matches the target value
        return variantValue === targetValue
      } else if (currentSelections[option.name]) {
        // For other options that have selections, check if they match
        return variantValue === currentSelections[option.name]
      } else {
        // For options without selections, any value is acceptable
        return true
      }
    })
  })
}

/**
 * Check if an option value should be disabled (no variants available)
 */
export function isOptionValueDisabled(
  product: ShopifyProduct,
  optionName: string,
  optionValue: string,
  currentSelections: Record<string, string>
): boolean {
  const matchingVariants = getVariantsForOptionValue(product, optionName, optionValue, currentSelections)
  return matchingVariants.length === 0
}

/**
 * Check if an option value should be marked as unavailable (variants exist but all are out of stock)
 */
export function isOptionValueUnavailable(
  product: ShopifyProduct,
  optionName: string,
  optionValue: string,
  currentSelections: Record<string, string>
): boolean {
  const matchingVariants = getVariantsForOptionValue(product, optionName, optionValue, currentSelections)

  // If no variants, it's disabled, not unavailable
  if (matchingVariants.length === 0) return false

  // If all matching variants are not available, then it's unavailable
  return matchingVariants.every(variant => !variant.available)
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-variant-selector": VariantSelector
  }
}
