import { assertRequired, createShopifyUrl } from "@/utils"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct } from "@/types"

/**
 * A modal dialog component for product quick view functionality.
 *
 * Fetches product data from Shopify's public product API and displays it in a modal
 * with product image, variant selection swatches, and add to cart functionality.
 *
 * @property {string} handle - Required. The Shopify product handle to fetch data for.
 *
 * @example
 * ```html
 * <nosto-quick-view handle="awesome-product"></nosto-quick-view>
 * ```
 */
@customElement("nosto-quick-view")
export class QuickView extends NostoElement {
  /** @private */
  static attributes = {
    handle: String
  }

  handle!: string
  private modal?: HTMLElement
  private backdrop?: HTMLElement
  private previouslyFocused?: HTMLElement

  connectedCallback() {
    assertRequired(this, "handle")
    this.addEventListener("click", this.handleClick)
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick)
    this.closeModal()
  }

  private handleClick = async () => {
    if (this.modal) {
      this.closeModal()
    } else {
      await this.openModal()
    }
  }

  private async openModal() {
    this.previouslyFocused = document.activeElement as HTMLElement

    try {
      const productData = await this.fetchProductData()
      this.createModal(productData)
      this.showModal()
      this.setupAccessibility()
    } catch (error) {
      this.showError(error instanceof Error ? error.message : "Failed to load product data")
    }
  }

  private async fetchProductData(): Promise<ShopifyProduct> {
    const url = createShopifyUrl(`products/${this.handle}.js`)
    return getJSON(url.href)
  }

  private createModal(product: ShopifyProduct) {
    // Create backdrop
    this.backdrop = document.createElement("div")
    this.backdrop.className = "nosto-quick-view-backdrop"
    this.backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    `

    // Create modal
    this.modal = document.createElement("div")
    this.modal.className = "nosto-quick-view-modal"
    this.modal.setAttribute("role", "dialog")
    this.modal.setAttribute("aria-labelledby", "quick-view-title")
    this.modal.setAttribute("aria-modal", "true")
    this.modal.style.cssText = `
      background: white;
      border-radius: 8px;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      margin: 20px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    `

    this.modal.innerHTML = this.renderModalContent(product)

    this.backdrop.appendChild(this.modal)
    document.body.appendChild(this.backdrop)
  }

  private renderModalContent(product: ShopifyProduct): string {
    const firstVariant = product.variants[0]
    const productId = String(product.id)

    return `
      <div style="display: flex; min-height: 400px;">
        <div style="flex: 1; padding: 20px;">
          <img 
            src="${product.featured_image}" 
            alt="${product.title}"
            style="width: 100%; height: auto; border-radius: 4px;"
            n-img
          />
        </div>
        <div style="flex: 1; padding: 20px; display: flex; flex-direction: column;">
          <button 
            type="button" 
            aria-label="Close modal"
            style="
              position: absolute;
              top: 15px;
              right: 15px;
              background: none;
              border: none;
              font-size: 24px;
              cursor: pointer;
              padding: 5px;
              line-height: 1;
              color: #666;
            "
            class="nosto-quick-view-close"
          >&times;</button>
          
          <h2 id="quick-view-title" style="margin: 0 0 10px 0; font-size: 24px;">${product.title}</h2>
          
          <div style="margin-bottom: 20px;">
            <span n-price style="font-size: 20px; font-weight: bold; color: #333;">
              ${this.formatPrice(firstVariant.price)}
            </span>
            ${
              firstVariant.compare_at_price
                ? `
              <span n-list-price style="font-size: 16px; color: #999; text-decoration: line-through; margin-left: 10px;">
                ${this.formatPrice(firstVariant.compare_at_price)}
              </span>
            `
                : ""
            }
          </div>

          <nosto-product product-id="${productId}" reco-id="quickview" style="flex-grow: 1;">
            ${this.renderOptions(product)}
            
            <div style="margin-top: auto; padding-top: 20px;">
              <button 
                n-atc 
                style="
                  background: #007bff;
                  color: white;
                  border: none;
                  padding: 12px 24px;
                  font-size: 16px;
                  border-radius: 4px;
                  cursor: pointer;
                  width: 100%;
                  transition: background-color 0.2s;
                "
                onmouseover="this.style.background='#0056b3'"
                onmouseout="this.style.background='#007bff'"
              >
                Add to Cart
              </button>
            </div>

            <script n-sku-data type="application/json">
              ${JSON.stringify(this.formatSkuData(product))}
            </script>
          </nosto-product>
        </div>
      </div>
    `
  }

  private renderOptions(product: ShopifyProduct): string {
    if (product.options.length <= 1 && product.options[0]?.name === "Title") {
      return ""
    }

    return product.options
      .map((option, index) => {
        const optionElements = option.values
          .map(value => {
            const matchingVariants = product.variants.filter(v => {
              const optionValue = index === 0 ? v.option1 : index === 1 ? v.option2 : v.option3
              return optionValue === value
            })

            const availableSkus = matchingVariants.filter(v => v.available).map(v => String(v.id))

            const unavailableSkus = matchingVariants.filter(v => !v.available).map(v => String(v.id))

            const skuAttrs = []
            if (availableSkus.length) skuAttrs.push(`n-skus="${availableSkus.join(",")}"`)
            if (unavailableSkus.length) skuAttrs.push(`n-skus-oos="${unavailableSkus.join(",")}"`)

            return `
          <span 
            n-option 
            ${skuAttrs.join(" ")}
            style="
              display: inline-block;
              padding: 8px 16px;
              margin: 4px;
              border: 2px solid #ddd;
              border-radius: 4px;
              cursor: pointer;
              user-select: none;
              transition: all 0.2s;
            "
            onmouseover="if (!this.hasAttribute('disabled') && !this.hasAttribute('unavailable')) this.style.borderColor='#007bff'"
            onmouseout="if (!this.hasAttribute('selected')) this.style.borderColor='#ddd'"
          >
            ${value}
          </span>
        `
          })
          .join("")

        return `
        <nosto-sku-options name="${option.name.toLowerCase()}">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 8px; font-weight: bold;">${option.name}:</label>
            ${optionElements}
          </div>
        </nosto-sku-options>
      `
      })
      .join("")
  }

  private formatSkuData(product: ShopifyProduct) {
    return product.variants.map(variant => ({
      id: String(variant.id),
      image: variant.featured_image?.src || product.featured_image,
      price: this.formatPrice(variant.price),
      listPrice: variant.compare_at_price ? this.formatPrice(variant.compare_at_price) : null
    }))
  }

  private formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`
  }

  private showModal() {
    if (!this.modal || !this.backdrop) return

    // Animate in
    this.backdrop.style.opacity = "0"
    this.modal.style.transform = "scale(0.9)"
    this.modal.style.opacity = "0"

    requestAnimationFrame(() => {
      if (this.backdrop && this.modal) {
        this.backdrop.style.transition = "opacity 0.2s ease"
        this.backdrop.style.opacity = "1"
        this.modal.style.transition = "transform 0.2s ease, opacity 0.2s ease"
        this.modal.style.transform = "scale(1)"
        this.modal.style.opacity = "1"
      }
    })
  }

  private setupAccessibility() {
    if (!this.modal) return

    // Focus the modal
    this.modal.focus()
    this.modal.setAttribute("tabindex", "-1")

    // Setup close button
    const closeBtn = this.modal.querySelector(".nosto-quick-view-close")
    closeBtn?.addEventListener("click", () => this.closeModal())

    // Setup backdrop click
    this.backdrop?.addEventListener("click", e => {
      if (e.target === this.backdrop) {
        this.closeModal()
      }
    })

    // Setup keyboard events
    document.addEventListener("keydown", this.handleKeydown)

    // Setup focus trap
    this.setupFocusTrap()
  }

  private handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this.closeModal()
    }
  }

  private setupFocusTrap() {
    if (!this.modal) return

    const focusableElements = this.modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    this.modal.addEventListener("keydown", e => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    })

    // Focus first element
    firstElement.focus()
  }

  private closeModal() {
    if (!this.modal || !this.backdrop) return

    // Remove event listeners
    document.removeEventListener("keydown", this.handleKeydown)

    // Animate out
    this.backdrop.style.opacity = "0"
    this.modal.style.transform = "scale(0.9)"
    this.modal.style.opacity = "0"

    setTimeout(() => {
      if (this.backdrop && this.backdrop.parentNode) {
        try {
          document.body.removeChild(this.backdrop)
        } catch {
          // Ignore errors if element is already removed
        }
      }
      this.backdrop = undefined
      this.modal = undefined

      // Restore focus
      if (this.previouslyFocused) {
        this.previouslyFocused.focus()
      }
    }, 200)
  }

  private showError(message: string) {
    // Simple error display - could be enhanced
    const errorDiv = document.createElement("div")
    errorDiv.textContent = `Error: ${message}`
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      z-index: 1001;
    `
    document.body.appendChild(errorDiv)

    setTimeout(() => {
      if (errorDiv.parentNode) {
        document.body.removeChild(errorDiv)
      }
    }, 5000)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-quick-view": QuickView
  }
}
