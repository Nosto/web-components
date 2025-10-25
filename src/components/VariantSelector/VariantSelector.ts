import { assertRequired } from "@/utils/assertRequired"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct, ShopifyVariant, VariantChangeDetail } from "@/shopify/types"
import { generateVariantSelectorHTML } from "./markup"
import styles from "./styles.css?raw"
import { shadowContentFactory } from "@/utils/shadowContentFactory"

const setShadowContent = shadowContentFactory(styles)

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
 * @property {string} preselect-variant-id - Specific variant ID to preselect. Takes precedence over preselect attribute.
 *
 * @fires variantchange - Emitted when variant selection changes, contains { variant, product }
 *
 * @example
 * ```html
 * <nosto-variant-selector handle="awesome-product"></nosto-variant-selector>
 * <nosto-variant-selector handle="awesome-product" preselect-variant-id="1234567890"></nosto-variant-selector>
 * ```
 */
@customElement("nosto-variant-selector", { observe: true })
export class VariantSelector extends NostoElement {
  /** @private */
  static properties = {
    handle: String,
    preselect: Boolean,
    "preselect-variant-id": String
  }

  handle!: string
  preselect?: boolean
  "preselect-variant-id"?: string

  /**
   * Getter for the preselect variant ID to improve code readability
   * @private
   */
  get preselectVariantId(): string | undefined {
    return this["preselect-variant-id"]
  }

  /**
   * Internal state for current selections
   * @hidden
   */
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
    setShadowContent(element, selectorHTML.html)

    // Setup event listeners for option buttons
    setupOptionListeners(element)

    // active state for selected options
    updateActiveStates(element)
    // unavailable state for options without available variants
    updateUnavailableStates(element, productData)
    // TODO disabled state

    if (Object.keys(element.selectedOptions).length > 0) {
      emitVariantChange(element, productData)
    }
  } finally {
    element.toggleAttribute("loading", false)
  }
}

function initializeDefaultSelections(element: VariantSelector, product: ShopifyProduct) {
  // If a specific variant ID is requested, preselect that variant
  const preselectedVariantId = element.preselectVariantId
  if (preselectedVariantId) {
    const targetVariant = product.variants.find(variant => variant.id.toString() === preselectedVariantId)
    if (targetVariant) {
      // Set selections based on the target variant's options
      product.options.forEach((option, index) => {
        element.selectedOptions[option.name] = targetVariant.options[index]
      })
      return
    }
  }

  // Fallback to existing preselection logic
  product.options.forEach(option => {
    // Always auto-select single-value options, or multi-value options when preselect is true
    if (option.values.length === 1 || (element.preselect && option.values.length > 1)) {
      element.selectedOptions[option.name] = option.values[0]
    }
  })
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
  const productData = await fetchProductData(element.handle)
  emitVariantChange(element, productData)
}

function updateActiveStates(element: VariantSelector) {
  element.shadowRoot!.querySelectorAll<HTMLElement>(".value").forEach(button => {
    const { optionName, optionValue } = button.dataset
    const active = !!optionName && element.selectedOptions[optionName] === optionValue
    button.toggleAttribute("active", active)
  })
}

function updateUnavailableStates(element: VariantSelector, product: ShopifyProduct) {
  const availableOptions = new Set<string>()
  const optionNames = product.options.map(option => option.name)
  product.variants
    .filter(v => v.available)
    .forEach(variant => {
      variant.options.forEach((optionValue, i) => {
        availableOptions.add(`${optionNames[i]}::${optionValue}`)
      })
    })
  element.shadowRoot!.querySelectorAll<HTMLElement>(".value").forEach(button => {
    const { optionName, optionValue } = button.dataset
    const available = availableOptions.has(`${optionName}::${optionValue}`)
    button.toggleAttribute("unavailable", !available)
  })
}

function emitVariantChange(element: VariantSelector, product: ShopifyProduct) {
  const variant = getSelectedVariant(element, product)
  if (variant) {
    // reflect selected variant ID in a data attribute
    element.dataset.variantId = variant.id.toString()
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
  return (
    product.variants?.find(variant => {
      return product.options.every((option, index) => {
        const selectedValue = element.selectedOptions[option.name]
        const variantValue = variant.options[index]
        return selectedValue === variantValue
      })
    }) || null
  )
}

async function fetchProductData(handle: string) {
  const url = createShopifyUrl(`/products/${handle}.js`)
  return getJSON<ShopifyProduct>(url.href, { cached: true })
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-variant-selector": VariantSelector
  }
}
