import { assertRequired } from "@/utils/assertRequired"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getJSON } from "@/utils/fetch"
import { customElement, property } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct, ShopifyVariant, VariantChangeDetail } from "@/shopify/types"
import { generateVariantSelectorHTML } from "./markup"
import styles from "./styles.css?raw"
import { shadowContentFactory } from "@/utils/shadowContentFactory"

const setShadowContent = shadowContentFactory(styles)

/** Event name for the VariantSelector rendered event */
const VARIANT_SELECTOR_RENDERED_EVENT = "@nosto/VariantSelector/rendered"

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
 * {@include ./examples.md}
 *
 * @category Campaign level templating
 *
 * @property {string} handle - The Shopify product handle to fetch data for. Required.
 * @property {string} variantId - (Optional) The ID of the variant to preselect on load.
 * @property {boolean} preselect - Whether to automatically preselect the options of the first available variant. Defaults to false.
 * @property {boolean} filtered - Whether to only show options leading to available variants. Defaults to false.
 *
 * @fires variantchange - Emitted when variant selection changes, contains { variant, product }
 * @fires @nosto/VariantSelector/rendered - Emitted when the component has finished rendering
 */
@customElement("nosto-variant-selector")
export class VariantSelector extends NostoElement {
  @property(String) handle!: string
  @property(Number) variantId?: number
  @property(Boolean) preselect?: boolean
  @property(Boolean) filtered?: boolean

  /**
   * Internal state for current selections
   * @hidden
   */
  selectedOptions: Record<string, string> = {}

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  async attributeChangedCallback(_: string, oldValue: string | null, newValue: string | null) {
    if (this.isConnected && oldValue !== newValue) {
      await this.#loadAndRenderMarkup()
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    await this.#loadAndRenderMarkup()
  }

  async #loadAndRenderMarkup() {
    this.toggleAttribute("loading", true)
    try {
      const productData = await this.#fetchProductData()

      // Initialize selections with first value of each option
      this.#initializeDefaultSelections(productData)

      const selectorHTML = generateVariantSelectorHTML(this, productData)
      setShadowContent(this, selectorHTML.html)

      // Setup event listeners for option buttons
      this.#setupOptionListeners()

      // active state for selected options
      this.#updateActiveStates()
      // unavailable state for options without available variants
      this.#updateUnavailableStates(productData)
      // TODO disabled state

      if (Object.keys(this.selectedOptions).length > 0) {
        this.#emitVariantChange(productData)
      }

      this.dispatchEvent(new CustomEvent(VARIANT_SELECTOR_RENDERED_EVENT, { bubbles: true, cancelable: true }))
    } finally {
      this.toggleAttribute("loading", false)
    }
  }

  #initializeDefaultSelections(product: ShopifyProduct) {
    let variant: ShopifyVariant | undefined
    if (this.variantId) {
      variant = product.variants.find(v => v.id === this.variantId)
    } else if (this.preselect) {
      variant = product.variants.find(v => v.available)
    }
    if (variant) {
      product.options.forEach((option, index) => {
        this.selectedOptions[option.name] = variant.options[index]
      })
    } else {
      product.options.forEach(option => {
        if (option.values.length === 1) {
          this.selectedOptions[option.name] = option.values[0]
        }
      })
    }
  }

  #setupOptionListeners() {
    this.shadowRoot!.addEventListener("click", async e => {
      const target = e.target as HTMLElement
      if (target.classList.contains("value")) {
        e.preventDefault()
        const { optionName, optionValue } = target.dataset
        if (optionName && optionValue) {
          await this.selectOption(optionName, optionValue)
        }
      }
    })
  }

  async selectOption(optionName: string, value: string) {
    if (this.selectedOptions[optionName] === value) {
      return
    }
    this.selectedOptions[optionName] = value
    this.#updateActiveStates()

    // Fetch product data and emit variant change
    const productData = await this.#fetchProductData()
    this.#emitVariantChange(productData)
  }

  #updateActiveStates() {
    this.shadowRoot!.querySelectorAll<HTMLElement>(".value").forEach(button => {
      const { optionName, optionValue } = button.dataset
      const active = !!optionName && this.selectedOptions[optionName] === optionValue
      this.#togglePart(button, "active", active)
    })
  }

  #updateUnavailableStates(product: ShopifyProduct) {
    const availableOptions = new Set<string>()
    const optionNames = product.options.map(option => option.name)
    product.variants
      .filter(v => v.available)
      .forEach(variant => {
        variant.options.forEach((optionValue, i) => {
          availableOptions.add(`${optionNames[i]}::${optionValue}`)
        })
      })
    this.shadowRoot!.querySelectorAll<HTMLElement>(".value").forEach(button => {
      const { optionName, optionValue } = button.dataset
      const available = availableOptions.has(`${optionName}::${optionValue}`)
      this.#togglePart(button, "unavailable", !available)
    })
  }

  #togglePart(element: HTMLElement, partName: string, enable: boolean) {
    const parts = new Set(element.getAttribute("part")?.split(" ").filter(Boolean) || [])
    if (enable) {
      parts.add(partName)
    } else {
      parts.delete(partName)
    }
    element.setAttribute("part", Array.from(parts).join(" "))
  }

  #emitVariantChange(product: ShopifyProduct) {
    const variant = getSelectedVariant(this, product)
    if (variant) {
      this.variantId = variant.id
      const detail: VariantChangeDetail = { variant }
      this.dispatchEvent(
        new CustomEvent("variantchange", {
          detail,
          bubbles: true
        })
      )
    }
  }

  async #fetchProductData() {
    const url = createShopifyUrl(`/products/${this.handle}.js`)
    const data = await getJSON<ShopifyProduct>(url.href, { cached: true })

    if (this.filtered) {
      return { ...data, options: this.#filteredOptions(data) }
    }
    return data
  }

  #filteredOptions(product: ShopifyProduct) {
    return product.options.map(option => {
      return {
        ...option,
        values: option.values.filter(value => product.variants.some(variant => variant.options.includes(value)))
      }
    })
  }
}

export async function selectOption(element: VariantSelector, optionName: string, value: string) {
  return element.selectOption(optionName, value)
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

declare global {
  interface HTMLElementTagNameMap {
    "nosto-variant-selector": VariantSelector
  }
}
