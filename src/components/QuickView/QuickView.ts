import { assertRequired } from "@/utils"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct, ShopifyVariant, SelectedOptions, ShopifyCartAddRequest } from "../../types"

/**
 * Custom element that provides a modal dialog for product quick view with swatches and add to cart.
 *
 * This component fetches product data from Shopify's public product API, renders a modal dialog
 * with product image, swatch pickers, and add to cart functionality. It handles option selection
 * to find the correct variant and supports keyboard navigation and screen readers.
 *
 * @property {string} handle - Required. The Shopify product handle to fetch and display.
 *
 * @example
 * ```html
 * <nosto-quick-view handle="sample-product">
 *   <button>Quick View</button>
 * </nosto-quick-view>
 * ```
 */
@customElement("nosto-quick-view")
export class QuickView extends NostoElement {
  /** @private */
  static attributes = {
    handle: String
  }

  handle!: string

  private product: ShopifyProduct | null = null
  private selectedVariant: ShopifyVariant | null = null
  private selectedOptions: SelectedOptions = {}
  private modal: HTMLElement | null = null
  private focusBeforeModal: HTMLElement | null = null

  connectedCallback() {
    assertRequired(this, "handle")
    this.addEventListener("click", this.handleClick)
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick)
    if (this.modal) {
      this.closeModal()
    }
  }

  private handleClick = (event: Event) => {
    event.preventDefault()
    this.openModal()
  }

  private async openModal() {
    this.focusBeforeModal = document.activeElement as HTMLElement

    try {
      if (!this.product) {
        await this.fetchProduct()
      }
      this.createModal()
      this.setupModalListeners()
      this.trapFocus()
    } catch (error) {
      console.error("Failed to open quick view:", error)
      this.showError(error instanceof Error ? error.message : "Failed to load product")
    }
  }

  private async fetchProduct() {
    try {
      this.product = (await getJSON(`/products/${this.handle}.js`)) as ShopifyProduct
      // Select first available variant by default
      this.selectedVariant = this.product.variants.find(v => v.available) || this.product.variants[0]
      // Initialize selected options based on the first variant
      if (this.selectedVariant) {
        this.selectedOptions = this.getVariantOptions(this.selectedVariant)
      }
    } catch (error) {
      throw new Error(`Failed to fetch product: ${error}`)
    }
  }

  private getVariantOptions(variant: ShopifyVariant): SelectedOptions {
    const options: SelectedOptions = {}
    this.product?.options.forEach((option, index) => {
      const optionValue =
        index === 0 ? variant.option1 : index === 1 ? variant.option2 : index === 2 ? variant.option3 : null
      if (optionValue) {
        options[option.name] = optionValue
      }
    })
    return options
  }

  private findVariantByOptions(options: SelectedOptions): ShopifyVariant | null {
    if (!this.product) return null

    return (
      this.product.variants.find(variant => {
        return this.product!.options.every((option, index) => {
          const variantValue =
            index === 0 ? variant.option1 : index === 1 ? variant.option2 : index === 2 ? variant.option3 : null
          return options[option.name] === variantValue
        })
      }) || null
    )
  }

  private createModal() {
    if (this.modal) {
      this.modal.remove()
    }

    this.modal = document.createElement("div")
    this.modal.className = "nosto-quick-view-overlay"
    this.modal.setAttribute("role", "dialog")
    this.modal.setAttribute("aria-modal", "true")
    this.modal.setAttribute("aria-labelledby", "quick-view-title")
    this.modal.innerHTML = this.renderModalContent()

    document.body.appendChild(this.modal)
    document.body.style.overflow = "hidden"

    // Focus the modal container
    this.modal.focus()
  }

  private renderModalContent(): string {
    if (!this.product || !this.selectedVariant) {
      return `
        <div class="nosto-quick-view-modal">
          <div class="nosto-quick-view-loading">Loading...</div>
        </div>
      `
    }

    const variant = this.selectedVariant
    const product = this.product
    const imageUrl = variant.featured_image?.src || product.featured_image || ""
    const price = (variant.price / 100).toFixed(2)
    const comparePrice = variant.compare_at_price ? (variant.compare_at_price / 100).toFixed(2) : null

    return `
      <div class="nosto-quick-view-modal" tabindex="-1">
        <button class="nosto-quick-view-close" aria-label="Close quick view">&times;</button>
        <div class="nosto-quick-view-content">
          <div class="nosto-quick-view-image">
            <img src="${imageUrl}" alt="${product.title}" />
          </div>
          <div class="nosto-quick-view-details">
            <h2 id="quick-view-title">${product.title}</h2>
            <div class="nosto-quick-view-price">
              ${comparePrice ? `<span class="compare-price">$${comparePrice}</span>` : ""}
              <span class="price">$${price}</span>
            </div>
            <div class="nosto-quick-view-availability">
              ${variant.available ? "In Stock" : "Out of Stock"}
            </div>
            ${this.renderOptions()}
            <button class="nosto-quick-view-atc" ${!variant.available ? "disabled" : ""}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `
  }

  private renderOptions(): string {
    if (!this.product || !this.product.options.length) {
      return ""
    }

    return this.product.options
      .map(option => {
        const selectedValue = this.selectedOptions[option.name] || ""
        return `
        <div class="nosto-quick-view-option">
          <label class="nosto-quick-view-option-label">${option.name}:</label>
          <div class="nosto-quick-view-swatches" role="radiogroup" aria-labelledby="option-${option.id}">
            ${option.values
              .map(value => {
                const isSelected = value === selectedValue
                const isAvailable = this.isOptionValueAvailable(option.name, value)
                return `
                <button
                  class="nosto-quick-view-swatch ${isSelected ? "selected" : ""} ${!isAvailable ? "unavailable" : ""}"
                  data-option="${option.name}"
                  data-value="${value}"
                  role="radio"
                  aria-checked="${isSelected}"
                  ${!isAvailable ? "disabled" : ""}
                  tabindex="${isSelected ? "0" : "-1"}"
                >
                  ${value}
                </button>
              `
              })
              .join("")}
          </div>
        </div>
      `
      })
      .join("")
  }

  private isOptionValueAvailable(optionName: string, value: string): boolean {
    if (!this.product) return false

    const testOptions = { ...this.selectedOptions, [optionName]: value }
    const variant = this.findVariantByOptions(testOptions)
    return variant?.available || false
  }

  private setupModalListeners() {
    if (!this.modal) return

    // Close button
    const closeBtn = this.modal.querySelector(".nosto-quick-view-close")
    closeBtn?.addEventListener("click", this.closeModal)

    // Overlay click
    this.modal.addEventListener("click", e => {
      if (e.target === this.modal) {
        this.closeModal()
      }
    })

    // Escape key
    document.addEventListener("keydown", this.handleKeyDown)

    // Option swatches
    const swatches = this.modal.querySelectorAll(".nosto-quick-view-swatch")
    swatches.forEach(swatch => {
      swatch.addEventListener("click", this.handleSwatchClick)
      swatch.addEventListener("keydown", this.handleSwatchKeyDown)
    })

    // Add to cart button
    const atcBtn = this.modal.querySelector(".nosto-quick-view-atc")
    atcBtn?.addEventListener("click", this.handleAddToCart)
  }

  private handleSwatchClick = (event: Event) => {
    const button = event.target as HTMLButtonElement
    if (button.disabled) return

    const optionName = button.dataset.option!
    const value = button.dataset.value!

    this.selectOption(optionName, value)
  }

  private handleSwatchKeyDown = (event: Event) => {
    const keyboardEvent = event as KeyboardEvent
    if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
      keyboardEvent.preventDefault()
      this.handleSwatchClick(event)
    } else if (keyboardEvent.key === "ArrowRight" || keyboardEvent.key === "ArrowDown") {
      keyboardEvent.preventDefault()
      this.focusNextSwatch(event.target as HTMLElement)
    } else if (keyboardEvent.key === "ArrowLeft" || keyboardEvent.key === "ArrowUp") {
      keyboardEvent.preventDefault()
      this.focusPreviousSwatch(event.target as HTMLElement)
    }
  }

  private focusNextSwatch(currentSwatch: HTMLElement) {
    const swatchGroup = currentSwatch.parentElement!
    const swatches = Array.from(swatchGroup.querySelectorAll(".nosto-quick-view-swatch:not([disabled])"))
    const currentIndex = swatches.indexOf(currentSwatch)
    const nextIndex = (currentIndex + 1) % swatches.length
    const nextSwatch = swatches[nextIndex] as HTMLElement
    this.focusSwatch(nextSwatch)
  }

  private focusPreviousSwatch(currentSwatch: HTMLElement) {
    const swatchGroup = currentSwatch.parentElement!
    const swatches = Array.from(swatchGroup.querySelectorAll(".nosto-quick-view-swatch:not([disabled])"))
    const currentIndex = swatches.indexOf(currentSwatch)
    const prevIndex = currentIndex === 0 ? swatches.length - 1 : currentIndex - 1
    const prevSwatch = swatches[prevIndex] as HTMLElement
    this.focusSwatch(prevSwatch)
  }

  private focusSwatch(swatch: HTMLElement) {
    const swatches = swatch.parentElement!.querySelectorAll(".nosto-quick-view-swatch")
    swatches.forEach(s => s.setAttribute("tabindex", "-1"))
    swatch.setAttribute("tabindex", "0")
    swatch.focus()
  }

  private selectOption(optionName: string, value: string) {
    this.selectedOptions[optionName] = value
    this.selectedVariant = this.findVariantByOptions(this.selectedOptions)
    this.updateModalContent()
  }

  private updateModalContent() {
    if (!this.modal) return

    const modalContent = this.modal.querySelector(".nosto-quick-view-modal")!
    modalContent.innerHTML = this.renderModalContent()
    this.setupModalListeners()
  }

  private handleAddToCart = async (event: Event) => {
    event.preventDefault()

    if (!this.selectedVariant || !this.selectedVariant.available) {
      return
    }

    try {
      const payload: ShopifyCartAddRequest = {
        id: this.selectedVariant.id,
        quantity: 1
      }

      const response = await fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error("Failed to add to cart")
      }

      // Close modal on successful add to cart
      this.closeModal()

      // Dispatch cart updated event for other components to listen
      window.dispatchEvent(new CustomEvent("cart:updated"))
    } catch (error) {
      console.error("Failed to add to cart:", error)
      this.showError("Failed to add item to cart")
    }
  }

  private handleKeyDown = (event: Event) => {
    const keyboardEvent = event as KeyboardEvent
    if (keyboardEvent.key === "Escape") {
      keyboardEvent.preventDefault()
      this.closeModal()
    }
  }

  private closeModal = () => {
    if (!this.modal) return

    document.removeEventListener("keydown", this.handleKeyDown)
    document.body.style.overflow = ""
    this.modal.remove()
    this.modal = null

    // Restore focus
    if (this.focusBeforeModal) {
      this.focusBeforeModal.focus()
      this.focusBeforeModal = null
    }
  }

  private trapFocus() {
    if (!this.modal) return

    const focusableElements = this.modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) return

    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

    // Focus first element
    firstFocusable.focus()

    // Trap focus within modal
    this.modal.addEventListener("keydown", e => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault()
            lastFocusable.focus()
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault()
            firstFocusable.focus()
          }
        }
      }
    })
  }

  private showError(message: string) {
    if (!this.modal) return

    const errorEl = document.createElement("div")
    errorEl.className = "nosto-quick-view-error"
    errorEl.textContent = message
    this.modal.querySelector(".nosto-quick-view-modal")?.appendChild(errorEl)

    setTimeout(() => errorEl.remove(), 5000)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-quick-view": QuickView
  }
}
