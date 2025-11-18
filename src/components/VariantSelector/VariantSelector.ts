import { assertRequired } from "@/utils/assertRequired"
import { customElement, property } from "../decorators"
import { NostoElement } from "../Element"
import { generateVariantSelectorHTML } from "./markup"
import normalStyles from "./normal/styles.css?raw"
import compactStyles from "./compact/compact.css?raw"
import { shadowContentFactory } from "@/utils/shadowContentFactory"
import { fetchProduct } from "@/shopify/graphql/fetchProduct"
import { ShopifyProduct, ShopifyVariant, VariantChangeDetail } from "@/shopify/graphql/types"
import { parseId, toVariantGid } from "@/shopify/graphql/utils"
import { setupCompactListeners, updateCompactActiveStates } from "./compact/compact"
import { setupDefaultListeners, updateDefaultActiveStates, updateUnavailableStates } from "./normal/normal"

// Re-export selectOption for tests and external use
export { selectOption } from "./normal/normal"

const setShadowContent = shadowContentFactory(normalStyles + compactStyles)

let placeholder = ""

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
 * @property {boolean} placeholder - If true, the component will display placeholder content while loading. Defaults to false.
 * @property {number} maxValues - (Optional) Maximum number of option values to display per option. When exceeded, shows an ellipsis indicator.
 * @property {boolean} compact - If true, renders variants in a single select dropdown instead of option pills. Defaults to false.
 *
 * @fires variantchange - Emitted when variant selection changes, contains { variant, product }
 * @fires @nosto/VariantSelector/rendered - Emitted when the component has finished rendering
 */
@customElement("nosto-variant-selector", { observe: true })
export class VariantSelector extends NostoElement {
  @property(String) handle!: string
  @property(Number) variantId?: number
  @property(Boolean) preselect?: boolean
  @property(Boolean) placeholder?: boolean
  @property(Number) maxValues?: number
  @property(Boolean) compact?: boolean

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
    if (this.placeholder && placeholder) {
      this.toggleAttribute("loading", true)
      setShadowContent(this, placeholder)
    }
    await loadAndRenderMarkup(this)
  }
}

async function loadAndRenderMarkup(element: VariantSelector) {
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
    const variantIdStr = toVariantGid(element.variantId)
    variant = product.variants.find(v => v.id === variantIdStr)
  } else if (element.preselect) {
    variant = product.variants.find(v => v.availableForSale)
  }
  if (variant && variant.selectedOptions) {
    variant.selectedOptions.forEach(selectedOption => {
      element.selectedOptions[selectedOption.name] = selectedOption.value
    })
  } else if (!element.compact) {
    // Only auto-select single-value options in non-compact mode
    product.options.forEach(option => {
      if (option.optionValues.length === 1) {
        element.selectedOptions[option.name] = option.optionValues[0].name
      }
    })
  }
}

function setupOptionListeners(element: VariantSelector) {
  if (element.compact) {
    setupCompactListeners(element)
  } else {
    setupDefaultListeners(element)
  }
}

function updateActiveStates(element: VariantSelector) {
  if (element.compact) {
    updateCompactActiveStates(element)
  } else {
    updateDefaultActiveStates(element)
  }
}

export function emitVariantChange(element: VariantSelector, product: ShopifyProduct) {
  const variant = getSelectedVariant(element, product)
  if (variant) {
    element.variantId = parseId(variant.id)
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
      if (!variant.selectedOptions) return false
      return product.options.every(option => {
        const selectedValue = element.selectedOptions[option.name]
        const variantOption = variant.selectedOptions!.find(so => so.name === option.name)
        return variantOption && selectedValue === variantOption.value
      })
    }) || null
  )
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-variant-selector": VariantSelector
  }
}
