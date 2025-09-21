import { assertRequired, createShopifyUrl } from "@/utils"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct, ShopifyVariant } from "./types"
import { VARIANT_SELECTOR_STYLES, VARIANT_SELECTOR_EMPTY_STYLES } from "./styles"

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
  private buttons: HTMLButtonElement[] = []

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
  element.toggleAttribute("loading", true)
  element.product = await fetchProductData(element)
  render(element)
  preselectFirstVariant(element)
  element.toggleAttribute("loading", false)
}

async function fetchProductData(element: VariantSelector) {
  const url = createShopifyUrl(`products/${element.handle}.js`)
  return getJSON(url.toString()) as Promise<ShopifyProduct>
}

function renderOption(option: ShopifyProduct["options"][0]) {
  return `
    <div class="variant-option" data-option-name="${option.name}" data-option-position="${option.position}">
      <div class="option-label">${option.name}:</div>
      <div class="option-buttons" role="group" aria-label="Select ${option.name}">
        ${option.values
          .map(
            value => `
              <button 
                type="button" 
                class="option-button" 
                data-value="${value}" 
                data-option-name="${option.name}"
                aria-label="Select ${option.name}: ${value}"
              >
                ${value}
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `
}

function render(element: VariantSelector) {
  if (!element.product) return

  const { options } = element.product

  if (options.length === 0) {
    if (!element.shadowRoot) {
      element.attachShadow({ mode: "open" })
    }
    element.shadowRoot!.innerHTML = `
      <style>${VARIANT_SELECTOR_EMPTY_STYLES}</style>
      <div class="variant-selector-empty">No options available</div>
    `
    return
  }

  if (!element.shadowRoot) {
    element.attachShadow({ mode: "open" })
  }

  element.shadowRoot.innerHTML = `
    <style>${VARIANT_SELECTOR_STYLES}</style>
    <form class="variant-selector" role="group" aria-label="Product variant selection">
      ${options.map(option => renderOption(option)).join("")}
    </form>
  `

  setupEventListeners(element)
}

function setupEventListeners(element: VariantSelector) {
  if (!element.shadowRoot) return

  const buttons = Array.from(element.shadowRoot.querySelectorAll<HTMLButtonElement>(".option-button"))
  element.buttons = buttons // Store buttons instead of selects

  buttons.forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault()
      const clickedButton = event.target as HTMLButtonElement
      const optionName = clickedButton.dataset.optionName!

      // Update selection state - only one button per option group can be selected
      const optionButtons = element.shadowRoot!.querySelectorAll<HTMLButtonElement>(
        `.option-button[data-option-name="${optionName}"]`
      )

      optionButtons.forEach(btn => btn.classList.remove("selected"))
      clickedButton.classList.add("selected")

      updateSelectedVariant(element)
    })
  })
}

function preselectFirstVariant(element: VariantSelector) {
  if (!element.product?.variants.length || !element.shadowRoot) return

  const firstVariant = element.product.variants[0]

  // Set button selection based on first variant's options
  firstVariant.options.forEach((optionValue, index) => {
    if (optionValue) {
      const optionName = element.product!.options[index].name
      const button = element.shadowRoot!.querySelector<HTMLButtonElement>(
        `.option-button[data-option-name="${optionName}"][data-value="${optionValue}"]`
      )
      if (button) {
        // Clear other selections in the same option group
        const optionButtons = element.shadowRoot!.querySelectorAll<HTMLButtonElement>(
          `.option-button[data-option-name="${optionName}"]`
        )
        optionButtons.forEach(btn => btn.classList.remove("selected"))

        // Select the correct button
        button.classList.add("selected")
      }
    }
  })

  element.selectedVariant = firstVariant
  emitVariantSelectedEvent(element)
}

function updateSelectedVariant(element: VariantSelector) {
  if (!element.product || !element.shadowRoot) return

  // Get current selected options from buttons
  const selectedOptions: string[] = []

  element.product.options.forEach(option => {
    const selectedButton = element.shadowRoot!.querySelector<HTMLButtonElement>(
      `.option-button[data-option-name="${option.name}"].selected`
    )
    if (selectedButton) {
      selectedOptions.push(selectedButton.dataset.value!)
    } else {
      selectedOptions.push("") // No selection for this option
    }
  })

  // Find matching variant - only if all options are selected
  const variant = selectedOptions.every(option => option !== "")
    ? element.product.variants.find(v => {
        return selectedOptions.every((option, index) => v.options[index] === option)
      })
    : null

  if (variant !== element.selectedVariant) {
    element.selectedVariant = variant || null
    emitVariantSelectedEvent(element)
  }
}

function emitVariantSelectedEvent(element: VariantSelector) {
  if (!element.product) return

  const detail = {
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
