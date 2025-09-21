import { assertRequired, createShopifyUrl } from "@/utils"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct, ShopifyVariant, VariantSelectionEvent } from "./types"

/** Event name for variant selection */
const VARIANT_SELECTED_EVENT = "@nosto/VariantSelector/variant-selected"

/**
 * A custom element that renders a variant selector for Shopify products.
 *
 * Fetches product data from Shopify's `/products/<handle>.js` endpoint and renders
 * select inputs for each product option (color, size, etc.). Emits events when
 * the selected variant changes.
 *
 * @property {string} handle - The product handle to fetch data for. Required.
 *
 * @example
 * ```html
 * <nosto-variant-selector handle="awesome-t-shirt">
 * </nosto-variant-selector>
 * ```
 */
@customElement("nosto-variant-selector", { observe: true })
export class VariantSelector extends NostoElement {
  /** @private */
  static attributes = {
    handle: String
  }

  handle!: string

  private product?: ShopifyProduct
  private selectedVariant?: ShopifyVariant | null
  private selects: HTMLSelectElement[] = []

  async attributeChangedCallback() {
    if (this.isConnected) {
      await loadAndRender(this)
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    await loadAndRender(this)
  }

  /**
   * Get the currently selected variant
   */
  getSelectedVariant(): ShopifyVariant | null {
    return this.selectedVariant || null
  }

  /**
   * Get the product data
   */
  getProduct(): ShopifyProduct | undefined {
    return this.product
  }
}

async function loadAndRender(element: VariantSelector) {
  try {
    element.toggleAttribute("loading", true)
    element.product = await fetchProductData(element)
    render(element)
    preselectFirstVariant(element)
    element.toggleAttribute("loading", false)
  } catch (error) {
    console.error(`Failed to load product data for handle "${element.handle}":`, error)
    element.innerHTML = `<div class="variant-selector-error">Failed to load product options</div>`
    element.toggleAttribute("loading", false)
  }
}

async function fetchProductData(element: VariantSelector): Promise<ShopifyProduct> {
  const url = createShopifyUrl(`products/${element.handle}.js`)
  return getJSON(url.toString()) as Promise<ShopifyProduct>
}

function render(element: VariantSelector) {
  if (!element.product) return

  const { options } = element.product

  if (options.length === 0) {
    element.innerHTML = `<div class="variant-selector-empty">No options available</div>`
    return
  }

  const selectsHTML = options
    .map(option => {
      const selectId = `variant-selector-${element.handle}-${option.name.toLowerCase()}`
      return `
        <div class="variant-option">
          <label for="${selectId}">${option.name}:</label>
          <select id="${selectId}" data-option-position="${option.position}" aria-label="Select ${option.name}">
            ${option.values
              .map(
                value => `
              <option value="${value}">${value}</option>
            `
              )
              .join("")}
          </select>
        </div>
      `
    })
    .join("")

  element.innerHTML = `
      <form class="variant-selector" role="group" aria-label="Product variant selection">
        ${selectsHTML}
      </form>
    `

  setupEventListeners(element)
}

function setupEventListeners(element: VariantSelector) {
  element.selects = Array.from(element.querySelectorAll("select"))

  element.selects.forEach(select => {
    select.addEventListener("change", () => {
      updateSelectedVariant(element)
    })
  })
}

function preselectFirstVariant(element: VariantSelector) {
  if (!element.product?.variants.length) return

  const firstVariant = element.product.variants[0]

  // Set select values based on first variant's options
  element.selects.forEach((select, index) => {
    const optionValue = firstVariant.options[index]
    if (optionValue) {
      select.value = optionValue
    }
  })

  element.selectedVariant = firstVariant
  emitVariantSelectedEvent(element)
}

function updateSelectedVariant(element: VariantSelector) {
  if (!element.product) return

  // Get current selected options
  const selectedOptions = element.selects.map(select => select.value)

  // Find matching variant
  const variant = element.product.variants.find(v => {
    return selectedOptions.every((option, index) => v.options[index] === option)
  })

  if (variant !== element.selectedVariant) {
    element.selectedVariant = variant || null
    emitVariantSelectedEvent(element)
  }
}

function emitVariantSelectedEvent(element: VariantSelector) {
  if (!element.product) return

  const detail: VariantSelectionEvent = {
    variant: element.selectedVariant || null,
    product: element.product
  }

  const event = new CustomEvent(VARIANT_SELECTED_EVENT, {
    bubbles: true,
    cancelable: true,
    detail
  })

  element.dispatchEvent(event)
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-variant-selector": VariantSelector
  }
}
