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
      await this.loadAndRender()
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    await this.loadAndRender()
  }

  private async loadAndRender() {
    try {
      this.toggleAttribute("loading", true)
      this.product = await this.fetchProductData()
      this.render()
      this.preselectFirstVariant()
      this.toggleAttribute("loading", false)
    } catch (error) {
      console.error(`Failed to load product data for handle "${this.handle}":`, error)
      this.innerHTML = `<div class="variant-selector-error">Failed to load product options</div>`
      this.toggleAttribute("loading", false)
    }
  }

  private async fetchProductData(): Promise<ShopifyProduct> {
    const url = createShopifyUrl(`products/${this.handle}.js`)
    return getJSON(url.toString()) as Promise<ShopifyProduct>
  }

  private render() {
    if (!this.product) return

    const { options } = this.product

    if (options.length === 0) {
      this.innerHTML = `<div class="variant-selector-empty">No options available</div>`
      return
    }

    const selectsHTML = options
      .map(option => {
        const selectId = `variant-selector-${this.handle}-${option.name.toLowerCase()}`
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

    this.innerHTML = `
      <form class="variant-selector" role="group" aria-label="Product variant selection">
        ${selectsHTML}
      </form>
    `

    this.setupEventListeners()
  }

  private setupEventListeners() {
    this.selects = Array.from(this.querySelectorAll("select"))

    this.selects.forEach(select => {
      select.addEventListener("change", () => {
        this.updateSelectedVariant()
      })
    })
  }

  private preselectFirstVariant() {
    if (!this.product?.variants.length) return

    const firstVariant = this.product.variants[0]

    // Set select values based on first variant's options
    this.selects.forEach((select, index) => {
      const optionValue = firstVariant.options[index]
      if (optionValue) {
        select.value = optionValue
      }
    })

    this.selectedVariant = firstVariant
    this.emitVariantSelectedEvent()
  }

  private updateSelectedVariant() {
    if (!this.product) return

    // Get current selected options
    const selectedOptions = this.selects.map(select => select.value)

    // Find matching variant
    const variant = this.product.variants.find(v => {
      return selectedOptions.every((option, index) => v.options[index] === option)
    })

    if (variant !== this.selectedVariant) {
      this.selectedVariant = variant || null
      this.emitVariantSelectedEvent()
    }
  }

  private emitVariantSelectedEvent() {
    if (!this.product) return

    const detail: VariantSelectionEvent = {
      variant: this.selectedVariant || null,
      product: this.product
    }

    const event = new CustomEvent(VARIANT_SELECTED_EVENT, {
      bubbles: true,
      cancelable: true,
      detail
    })

    this.dispatchEvent(event)
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

declare global {
  interface HTMLElementTagNameMap {
    "nosto-variant-selector": VariantSelector
  }
}
