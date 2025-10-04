import { assertRequired } from "@/utils/assertRequired"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct, ShopifyVariant } from "../SimpleCard/types"
import { generateVariantSelectorHTML } from "./markup"
import { variantSelectorStyles } from "./styles"

// Cache the stylesheet for reuse across component instances
let cachedStyleSheet: CSSStyleSheet | null = null

/**
 * Event detail for variant change events
 */
export type VariantChangeDetail = {
  variant: ShopifyVariant
  product: ShopifyProduct
}

/**
 * A custom element that displays product variant options as clickable pills.
 *
 * Fetches product data from `/products/<handle>.js` and renders option rows with
 * clickable value pills. Preselects the first value for each option and highlights
 * the currently selected choices. Emits a custom event when variant selections change.
 *
 * The component renders inside a shadow DOM with encapsulated styles. Styling can be
 * customized using CSS custom properties.
 *
 * @property {string} handle - The Shopify product handle to fetch data for. Required.
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
    handle: String
  }

  handle!: string

  /** Internal state for current selections */
  selectedOptions: Record<string, string> = {}

  /** Product data cache */
  product: ShopifyProduct | null = null

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

  /**
   * Get the currently selected variant based on option selections
   */
  get selectedVariant(): ShopifyVariant | null {
    if (!this.product?.variants) return null

    return (
      this.product.variants.find(variant => {
        return this.product!.options.every((option, index) => {
          const selectedValue = this.selectedOptions[option.name]
          const variantValue = variant.options[index]
          return selectedValue === variantValue
        })
      }) || null
    )
  }

  /**
   * Update option selection and emit variant change event
   */
  selectOption(optionName: string, value: string) {
    this.selectedOptions[optionName] = value
    this.updateActiveStates()
    this.emitVariantChange()
  }

  /** Update active states in the DOM */
  updateActiveStates() {
    if (!this.shadowRoot) return

    // Update active states in the DOM
    this.shadowRoot.querySelectorAll(".variant-option-value").forEach(button => {
      const optionName = button.getAttribute("data-option-name")
      const optionValue = button.getAttribute("data-option-value")

      if (optionName && this.selectedOptions[optionName] === optionValue) {
        button.classList.add("variant-option-value--active")
      } else {
        button.classList.remove("variant-option-value--active")
      }
    })
  }

  /** Emit variant change event */
  emitVariantChange() {
    const variant = this.selectedVariant
    if (variant && this.product) {
      const detail: VariantChangeDetail = { variant, product: this.product }
      this.dispatchEvent(
        new CustomEvent("variantchange", {
          detail,
          bubbles: true
        })
      )
    }
  }
}

async function loadAndRenderMarkup(element: VariantSelector) {
  element.toggleAttribute("loading", true)
  try {
    const productData = await fetchProductData(element.handle)
    element.product = productData

    // Initialize selections with first value of each option
    initializeDefaultSelections(element, productData)

    const selectorHTML = generateVariantSelectorHTML(element, productData)

    // Use constructible stylesheets if supported, fallback to inline styles
    if ("adoptedStyleSheets" in element.shadowRoot!) {
      if (!cachedStyleSheet) {
        cachedStyleSheet = new CSSStyleSheet()
        await cachedStyleSheet.replace(variantSelectorStyles)
      }
      element.shadowRoot!.adoptedStyleSheets = [cachedStyleSheet]
      element.shadowRoot!.innerHTML = selectorHTML.html
    } else {
      element.shadowRoot!.innerHTML = `
        <style>${variantSelectorStyles}</style>
        ${selectorHTML.html}
      `
    }

    // Setup event listeners for option buttons
    setupOptionListeners(element)

    // Update active states based on current selections
    element.updateActiveStates()

    // Emit initial variant change event
    element.emitVariantChange()
  } finally {
    element.toggleAttribute("loading", false)
  }
}

function initializeDefaultSelections(element: VariantSelector, product: ShopifyProduct) {
  // Select first value for each option by default
  product.options.forEach(option => {
    if (option.values.length > 0) {
      element.selectedOptions[option.name] = option.values[0]
    }
  })
}

function setupOptionListeners(element: VariantSelector) {
  if (!element.shadowRoot) return

  element.shadowRoot.querySelectorAll(".variant-option-value").forEach(button => {
    button.addEventListener("click", e => {
      e.preventDefault()
      const optionName = (e.target as Element).getAttribute("data-option-name")
      const optionValue = (e.target as Element).getAttribute("data-option-value")

      if (optionName && optionValue) {
        element.selectOption(optionName, optionValue)
      }
    })
  })
}

async function fetchProductData(handle: string) {
  const url = createShopifyUrl(`products/${handle}.js`)
  return getJSON<ShopifyProduct>(url.href, { cached: true })
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-variant-selector": VariantSelector
  }
}
