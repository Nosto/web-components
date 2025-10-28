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
  @property({ type: String })
  handle!: string

  @property({ type: Number })
  variantId?: number

  @property({ type: Boolean })
  preselect?: boolean

  @property({ type: Boolean })
  filtered?: boolean

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
    const productData = await fetchProductData(element)

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

    element.dispatchEvent(new CustomEvent(VARIANT_SELECTOR_RENDERED_EVENT, { bubbles: true, cancelable: true }))
  } finally {
    element.toggleAttribute("loading", false)
  }
}

function initializeDefaultSelections(element: VariantSelector, product: ShopifyProduct) {
  let variant: ShopifyVariant | undefined
  if (element.variantId) {
    variant = product.variants.find(v => v.id === element.variantId)
  } else if (element.preselect) {
    variant = product.variants.find(v => v.available)
  }
  if (variant) {
    product.options.forEach((option, index) => {
      element.selectedOptions[option.name] = variant.options[index]
    })
  } else {
    product.options.forEach(option => {
      if (option.values.length === 1) {
        element.selectedOptions[option.name] = option.values[0]
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
  const productData = await fetchProductData(element)
  emitVariantChange(element, productData)
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

function emitVariantChange(element: VariantSelector, product: ShopifyProduct) {
  const variant = getSelectedVariant(element, product)
  if (variant) {
    element.variantId = variant.id
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

async function fetchProductData({ handle, filtered }: VariantSelector) {
  const url = createShopifyUrl(`/products/${handle}.js`)
  const data = await getJSON<ShopifyProduct>(url.href, { cached: true })

  if (filtered) {
    return { ...data, options: filteredOptions(data) }
  }
  return data
}

function filteredOptions(product: ShopifyProduct) {
  return product.options.map(option => {
    return {
      ...option,
      values: option.values.filter(value => product.variants.some(variant => variant.options.includes(value)))
    }
  })
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-variant-selector": VariantSelector
  }
}
