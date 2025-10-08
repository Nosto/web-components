import { assertRequired } from "@/utils/assertRequired"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct, ShopifyVariant, VariantChangeDetail } from "../SimpleCard/types"
import type { SimpleCard } from "../SimpleCard/SimpleCard"
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
 * @property {string} handle - The Shopify product handle to fetch data for. Optional when nested in SimpleCard.
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

  handle?: string
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
    // Try to derive handle from closest SimpleCard ancestor if not explicitly provided
    if (!this.handle) {
      const simpleCard = this.closest("nosto-simple-card") as SimpleCard | null
      if (simpleCard?.handle) {
        this.handle = simpleCard.handle
      }
    }

    assertRequired(this, "handle")
    await loadAndRenderMarkup(this)
  }
}

async function loadAndRenderMarkup(element: VariantSelector) {
  element.toggleAttribute("loading", true)
  try {
    const productData = await fetchProductData(element.handle!)

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
  updateActiveStates(element)

  // Fetch product data and emit variant change
  const productData = await fetchProductData(element.handle!)
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

declare global {
  interface HTMLElementTagNameMap {
    "nosto-variant-selector": VariantSelector
  }
}
