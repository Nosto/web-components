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
  try {
    element.toggleAttribute("loading", true)
    element.product = await fetchProductData(element)
    render(element)
    preselectFirstVariant(element)
    element.toggleAttribute("loading", false)
  } catch (error) {
    console.error(`Failed to load product data for handle "${element.handle}":`, error)

    if (!element.shadowRoot) {
      element.attachShadow({ mode: "open" })
    }

    element.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--nosto-font-family, inherit);
        }
        .variant-selector-error {
          color: var(--nosto-error-color, #dc3545);
          background: var(--nosto-error-bg, #f8d7da);
          padding: var(--nosto-error-padding, 1rem);
          border-radius: var(--nosto-error-radius, 4px);
          border: var(--nosto-error-border, 1px solid #f5c6cb);
        }
      </style>
      <div class="variant-selector-error">Failed to load product options</div>
    `
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
    if (!element.shadowRoot) {
      element.attachShadow({ mode: "open" })
    }
    element.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--nosto-font-family, inherit);
        }
        .variant-selector-empty {
          color: var(--nosto-text-color, #666);
          padding: var(--nosto-padding, 1rem);
        }
      </style>
      <div class="variant-selector-empty">No options available</div>
    `
    return
  }

  if (!element.shadowRoot) {
    element.attachShadow({ mode: "open" })
  }

  const optionsHTML = options
    .map(option => {
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
    })
    .join("")

  element.shadowRoot.innerHTML = `
    <style>
      :host {
        display: block;
        font-family: var(--nosto-font-family, inherit);
      }
      
      :host([loading]) {
        opacity: var(--nosto-loading-opacity, 0.6);
      }
      
      .variant-selector {
        display: flex;
        flex-direction: column;
        gap: var(--nosto-option-spacing, 1rem);
      }
      
      .variant-option {
        display: flex;
        flex-direction: column;
        gap: var(--nosto-label-spacing, 0.5rem);
      }
      
      .option-label {
        font-weight: var(--nosto-label-weight, 600);
        color: var(--nosto-label-color, #333);
        font-size: var(--nosto-label-size, 1rem);
      }
      
      .option-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: var(--nosto-button-spacing, 0.5rem);
      }
      
      .option-button {
        padding: var(--nosto-button-padding, 0.5rem 1rem);
        border: var(--nosto-button-border, 1px solid #ccc);
        border-radius: var(--nosto-button-radius, 4px);
        background: var(--nosto-button-bg, white);
        color: var(--nosto-button-color, #333);
        font-size: var(--nosto-button-size, 0.875rem);
        cursor: pointer;
        transition: var(--nosto-button-transition, all 0.2s ease);
        min-width: var(--nosto-button-min-width, 2.5rem);
        text-align: center;
      }
      
      .option-button:hover {
        background: var(--nosto-button-hover-bg, #f5f5f5);
        border-color: var(--nosto-button-hover-border, #999);
      }
      
      .option-button:focus {
        outline: none;
        border-color: var(--nosto-button-focus-border, #007bff);
        box-shadow: var(--nosto-button-focus-shadow, 0 0 0 2px rgba(0, 123, 255, 0.25));
      }
      
      .option-button.selected {
        background: var(--nosto-button-selected-bg, #007bff);
        color: var(--nosto-button-selected-color, white);
        border-color: var(--nosto-button-selected-border, #007bff);
      }
      
      .option-button:disabled {
        opacity: var(--nosto-button-disabled-opacity, 0.5);
        cursor: not-allowed;
        background: var(--nosto-button-disabled-bg, #f5f5f5);
        color: var(--nosto-button-disabled-color, #999);
      }
      
      .variant-selector-error {
        color: var(--nosto-error-color, #dc3545);
        background: var(--nosto-error-bg, #f8d7da);
        padding: var(--nosto-error-padding, 1rem);
        border-radius: var(--nosto-error-radius, 4px);
        border: var(--nosto-error-border, 1px solid #f5c6cb);
      }
    </style>
    <form class="variant-selector" role="group" aria-label="Product variant selection">
      ${optionsHTML}
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
