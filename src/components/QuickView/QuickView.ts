import { assertRequired, createShopifyUrl } from "@/utils"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import { addSkuToCart } from "@nosto/nosto-js"

/** Event name for the QuickView open event */
const QUICK_VIEW_OPEN_EVENT = "@nosto/QuickView/open"

/** Event name for the QuickView close event */
const QUICK_VIEW_CLOSE_EVENT = "@nosto/QuickView/close"

/** Event name for the QuickView loaded event */
const QUICK_VIEW_LOADED_EVENT = "@nosto/QuickView/loaded"

/** Event name for the QuickView error event */
const QUICK_VIEW_ERROR_EVENT = "@nosto/QuickView/error"

/** Event name for the QuickView add to cart event */
const QUICK_VIEW_ADD_TO_CART_EVENT = "@nosto/QuickView/addToCart"

interface ShopifyProduct {
  id: number
  title: string
  handle: string
  description: string
  published_at: string
  created_at: string
  updated_at: string
  vendor: string
  product_type: string
  tags: string[]
  price: number
  price_min: number
  price_max: number
  available: boolean
  price_varies: boolean
  compare_at_price: number | null
  compare_at_price_min: number
  compare_at_price_max: number
  compare_at_price_varies: boolean
  variants: ShopifyVariant[]
  images: string[]
  featured_image: string
  options: ShopifyOption[]
  url: string
}

interface ShopifyVariant {
  id: number
  title: string
  option1: string | null
  option2: string | null
  option3: string | null
  sku: string
  requires_shipping: boolean
  taxable: boolean
  featured_image: string | null
  available: boolean
  price: number
  grams: number
  compare_at_price: number | null
  position: number
  product_id: number
  created_at: string
  updated_at: string
}

interface ShopifyOption {
  name: string
  position: number
  values: string[]
}

interface SelectedOptions {
  [optionName: string]: string
}

/**
 * A custom element that displays a modal dialog for product quick view.
 * 
 * This component fetches product data from Shopify's public product API and displays
 * a modal with product image, swatch pickers, title, price, and add to cart functionality.
 * 
 * @property {string} handle - The product handle to fetch data for. Required.
 * @property {boolean} open - Whether the modal is currently open. Defaults to false.
 * @property {string} [productId] - Optional Nosto product ID for tracking.
 * @property {string} [recoId] - Optional Nosto recommendation ID for tracking.
 * 
 * @example
 * ```html
 * <nosto-quick-view handle="awesome-product" product-id="123" reco-id="frontpage">
 * </nosto-quick-view>
 * ```
 */
@customElement("nosto-quick-view", { observe: true })
export class QuickView extends NostoElement {
  /** @private */
  static attributes = {
    handle: String,
    open: Boolean,
    productId: String,
    recoId: String
  }

  handle!: string
  open: boolean = false
  productId?: string
  recoId?: string

  private product: ShopifyProduct | null = null
  private selectedOptions: SelectedOptions = {}
  private selectedVariant: ShopifyVariant | null = null
  private previouslyFocusedElement: HTMLElement | null = null
  private isLoading = false

  async attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    if (name === "open" && this.isConnected) {
      if (newValue !== null) {
        this.open = true
        await this.openModal()
      } else {
        this.open = false
        this.closeModal()
      }
    }
    if (name === "handle" && this.isConnected && this.open) {
      await this.loadProductData()
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    this.setupModal()
    if (this.hasAttribute("open")) {
      this.open = true
      await this.openModal()
    }
  }

  disconnectedCallback() {
    this.removeEventListeners()
    this.restoreFocus()
  }

  private setupModal() {
    this.setAttribute("role", "dialog")
    this.setAttribute("aria-modal", "true")
    this.setAttribute("aria-labelledby", "quick-view-title")
    this.style.position = "fixed"
    this.style.top = "0"
    this.style.left = "0"
    this.style.width = "100%"
    this.style.height = "100%"
    this.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
    this.style.display = "none"
    this.style.alignItems = "center"
    this.style.justifyContent = "center"
    this.style.zIndex = "9999"

    // Add close button and modal content structure
    this.innerHTML = `
      <div class="quick-view-modal" style="
        background: white;
        border-radius: 8px;
        max-width: 800px;
        max-height: 90vh;
        width: 90%;
        display: flex;
        overflow: hidden;
        position: relative;
      ">
        <button 
          class="quick-view-close" 
          aria-label="Close quick view"
          style="
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            z-index: 1;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.9);
          "
        >×</button>
        <div class="quick-view-content" style="
          display: flex;
          width: 100%;
          min-height: 400px;
        ">
          <div class="quick-view-loading" style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            font-size: 18px;
            color: #666;
          ">Loading...</div>
        </div>
      </div>
    `

    this.addEventListener("click", this.handleBackdropClick.bind(this))
    this.addEventListener("keydown", this.handleKeyDown.bind(this))
  }

  private async openModal() {
    if (this.isLoading) return

    this.previouslyFocusedElement = document.activeElement as HTMLElement
    this.style.display = "flex"
    
    // Prevent body scroll
    document.body.style.overflow = "hidden"
    
    // Focus the modal
    this.focus()
    
    await this.loadProductData()
    
    this.dispatchEvent(new CustomEvent(QUICK_VIEW_OPEN_EVENT, { 
      bubbles: true, 
      cancelable: true,
      detail: { handle: this.handle }
    }))
  }

  private closeModal() {
    this.style.display = "none"
    this.open = false
    this.removeAttribute("open")
    
    // Restore body scroll
    document.body.style.overflow = ""
    
    this.restoreFocus()
    
    this.dispatchEvent(new CustomEvent(QUICK_VIEW_CLOSE_EVENT, { 
      bubbles: true, 
      cancelable: true,
      detail: { handle: this.handle }
    }))
  }

  private restoreFocus() {
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus()
      this.previouslyFocusedElement = null
    }
  }

  private handleBackdropClick(event: MouseEvent) {
    if (event.target === this) {
      this.closeModal()
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.closeModal()
      return
    }

    // Implement focus trap
    if (event.key === "Tab") {
      this.trapFocus(event)
    }
  }

  private trapFocus(event: KeyboardEvent) {
    const focusableElements = this.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus()
        event.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus()
        event.preventDefault()
      }
    }
  }

  private async loadProductData() {
    if (this.isLoading) return

    this.isLoading = true
    this.showLoading()

    try {
      const productUrl = createShopifyUrl(`products/${this.handle}.js`)
      this.product = await getJSON(productUrl.href) as ShopifyProduct
      
      // Initialize with first variant if available
      if (this.product.variants.length > 0) {
        this.selectedVariant = this.product.variants[0]
        this.initializeSelectedOptions()
      }
      
      this.renderModal()
      
      this.dispatchEvent(new CustomEvent(QUICK_VIEW_LOADED_EVENT, { 
        bubbles: true, 
        cancelable: true,
        detail: { product: this.product }
      }))
    } catch (error) {
      this.showError(error instanceof Error ? error.message : "Failed to load product")
      
      this.dispatchEvent(new CustomEvent(QUICK_VIEW_ERROR_EVENT, { 
        bubbles: true, 
        cancelable: true,
        detail: { error }
      }))
    } finally {
      this.isLoading = false
    }
  }

  private initializeSelectedOptions() {
    if (!this.product || !this.selectedVariant) return

    this.selectedOptions = {}
    this.product.options.forEach((option, index) => {
      const variantOption = this.selectedVariant![`option${index + 1}` as keyof ShopifyVariant] as string
      if (variantOption) {
        this.selectedOptions[option.name] = variantOption
      }
    })
  }

  private showLoading() {
    const content = this.querySelector(".quick-view-content")
    if (content) {
      content.innerHTML = `
        <div class="quick-view-loading" style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          font-size: 18px;
          color: #666;
        ">Loading...</div>
      `
    }
  }

  private showError(message: string) {
    const content = this.querySelector(".quick-view-content")
    if (content) {
      content.innerHTML = `
        <div class="quick-view-error" style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          font-size: 18px;
          color: #d32f2f;
          text-align: center;
          padding: 40px;
        ">
          <div>
            <div style="margin-bottom: 16px;">⚠️</div>
            <div>Error: ${message}</div>
          </div>
        </div>
      `
    }
  }

  private renderModal() {
    if (!this.product) return

    const content = this.querySelector(".quick-view-content")
    if (!content) return

    const variant = this.selectedVariant || this.product.variants[0]
    const price = variant ? `$${(variant.price / 100).toFixed(2)}` : `$${(this.product.price / 100).toFixed(2)}`
    const compareAtPrice = variant?.compare_at_price ? `$${(variant.compare_at_price / 100).toFixed(2)}` : null
    const available = variant ? variant.available : this.product.available

    content.innerHTML = `
      <div class="quick-view-image" style="
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f5f5;
        min-height: 400px;
      ">
        <img 
          src="${this.product.featured_image || this.product.images[0] || ''}" 
          alt="${this.product.title}"
          style="
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          "
        />
      </div>
      <div class="quick-view-details" style="
        flex: 1;
        padding: 32px;
        display: flex;
        flex-direction: column;
        gap: 24px;
      ">
        <div>
          <h2 id="quick-view-title" style="
            margin: 0 0 16px 0;
            font-size: 24px;
            font-weight: 600;
            line-height: 1.3;
          ">${this.product.title}</h2>
          <div class="quick-view-price" style="
            font-size: 20px;
            font-weight: 600;
            ${compareAtPrice ? 'color: #d32f2f;' : ''}
          ">
            ${price}
            ${compareAtPrice ? `<span style="text-decoration: line-through; color: #666; font-weight: normal; margin-left: 8px;">${compareAtPrice}</span>` : ''}
          </div>
        </div>
        
        ${this.renderSwatches()}
        
        <div class="quick-view-actions" style="
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: auto;
        ">
          <div style="
            display: flex;
            align-items: center;
            gap: 16px;
          ">
            <button 
              class="quantity-decrease"
              style="
                width: 40px;
                height: 40px;
                border: 1px solid #ddd;
                background: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
              "
              ${!available ? 'disabled' : ''}
            >−</button>
            <input 
              type="number" 
              value="1" 
              min="1" 
              class="quantity-input"
              style="
                width: 60px;
                height: 40px;
                text-align: center;
                border: 1px solid #ddd;
                font-size: 16px;
              "
              ${!available ? 'disabled' : ''}
            />
            <button 
              class="quantity-increase"
              style="
                width: 40px;
                height: 40px;
                border: 1px solid #ddd;
                background: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
              "
              ${!available ? 'disabled' : ''}
            >+</button>
          </div>
          
          <button 
            class="add-to-cart-btn"
            style="
              background: ${available ? '#000' : '#ccc'};
              color: white;
              border: none;
              padding: 16px 32px;
              font-size: 16px;
              font-weight: 600;
              cursor: ${available ? 'pointer' : 'not-allowed'};
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
            "
            ${!available ? 'disabled' : ''}
          >
            <span>🛒</span> ${available ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>
    `

    this.setupEventListeners()
  }

  private renderSwatches(): string {
    if (!this.product || this.product.options.length === 0) {
      return ""
    }

    return this.product.options.map(option => {
      const selectedValue = this.selectedOptions[option.name] || option.values[0]
      
      return `
        <div class="swatch-group" data-option="${option.name}">
          <label style="
            display: block;
            font-weight: 600;
            margin-bottom: 12px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          ">${option.name}</label>
          <div class="swatch-options" style="
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          ">
            ${option.values.map(value => `
              <button 
                class="swatch-option" 
                data-option="${option.name}" 
                data-value="${value}"
                style="
                  padding: 12px 20px;
                  border: 2px solid ${selectedValue === value ? '#000' : '#ddd'};
                  background: ${selectedValue === value ? '#000' : 'white'};
                  color: ${selectedValue === value ? 'white' : '#000'};
                  cursor: pointer;
                  border-radius: 4px;
                  font-size: 14px;
                  font-weight: 500;
                  min-width: 60px;
                  transition: all 0.2s ease;
                "
                onmouseover="this.style.borderColor='#000'"
                onmouseout="this.style.borderColor='${selectedValue === value ? '#000' : '#ddd'}'"
              >
                ${value}
              </button>
            `).join("")}
          </div>
        </div>
      `
    }).join("")
  }

  private setupEventListeners() {
    // Close button
    const closeBtn = this.querySelector(".quick-view-close") as HTMLButtonElement
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeModal())
    }

    // Swatch selection
    const swatchOptions = this.querySelectorAll(".swatch-option") as NodeListOf<HTMLButtonElement>
    swatchOptions.forEach(button => {
      button.addEventListener("click", () => {
        const optionName = button.dataset.option!
        const value = button.dataset.value!
        this.selectOption(optionName, value)
      })
    })

    // Quantity controls
    const decreaseBtn = this.querySelector(".quantity-decrease") as HTMLButtonElement
    const increaseBtn = this.querySelector(".quantity-increase") as HTMLButtonElement
    const quantityInput = this.querySelector(".quantity-input") as HTMLInputElement

    if (decreaseBtn && quantityInput) {
      decreaseBtn.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value) || 1
        if (currentValue > 1) {
          quantityInput.value = String(currentValue - 1)
        }
      })
    }

    if (increaseBtn && quantityInput) {
      increaseBtn.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value) || 1
        quantityInput.value = String(currentValue + 1)
      })
    }

    // Add to cart button
    const addToCartBtn = this.querySelector(".add-to-cart-btn") as HTMLButtonElement
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => this.addToCart())
    }
  }

  private selectOption(optionName: string, value: string) {
    this.selectedOptions[optionName] = value
    this.updateSelectedVariant()
    this.renderModal() // Re-render to update UI
  }

  private updateSelectedVariant() {
    if (!this.product) return

    // Find variant that matches all selected options
    const matchingVariant = this.product.variants.find(variant => {
      return this.product!.options.every((option, index) => {
        const selectedValue = this.selectedOptions[option.name]
        const variantValue = variant[`option${index + 1}` as keyof ShopifyVariant]
        return !selectedValue || selectedValue === variantValue
      })
    })

    if (matchingVariant) {
      this.selectedVariant = matchingVariant
    }
  }

  private async addToCart() {
    if (!this.selectedVariant || !this.selectedVariant.available) return

    const quantityInput = this.querySelector(".quantity-input") as HTMLInputElement
    const quantity = parseInt(quantityInput?.value || "1")

    try {
      const addToCartBtn = this.querySelector(".add-to-cart-btn") as HTMLButtonElement
      if (addToCartBtn) {
        addToCartBtn.disabled = true
        addToCartBtn.innerHTML = '<span>⏳</span> Adding...'
      }

      // Use Shopify AJAX Cart API directly
      const response = await fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: this.selectedVariant.id,
          quantity: quantity
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to add to cart: ${response.statusText}`)
      }

      // If we have productId and recoId, also use nosto-js tracking
      if (this.productId && this.recoId) {
        await addSkuToCart(
          { productId: this.productId, skuId: String(this.selectedVariant.id) },
          this.recoId,
          quantity
        )
      }

      this.dispatchEvent(new CustomEvent(QUICK_VIEW_ADD_TO_CART_EVENT, {
        bubbles: true,
        cancelable: true,
        detail: {
          variant: this.selectedVariant,
          quantity,
          productId: this.productId,
          recoId: this.recoId
        }
      }))

      // Close modal after successful add to cart
      this.closeModal()

    } catch (error) {
      console.error("Failed to add to cart:", error)
      
      const addToCartBtn = this.querySelector(".add-to-cart-btn") as HTMLButtonElement
      if (addToCartBtn) {
        addToCartBtn.disabled = false
        addToCartBtn.innerHTML = '<span>🛒</span> Add to Cart'
      }
      
      // Could show an error message to user here
      alert(error instanceof Error ? error.message : "Failed to add to cart")
    }
  }

  private removeEventListeners() {
    // Clean up is handled by component removal
  }

  /** Open the modal programmatically */
  openQuickView() {
    this.open = true
    this.setAttribute("open", "")
  }

  /** Close the modal programmatically */
  closeQuickView() {
    this.open = false
    this.removeAttribute("open")
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-quick-view": QuickView
  }
}