import { assertRequired, createShopifyUrl } from "@/utils"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"

/** Event name for the SimpleCard loaded event */
const SIMPLE_CARD_LOADED_EVENT = "@nosto/SimpleCard/loaded"

/**
 * A custom element that displays a product card using Shopify product data.
 *
 * Fetches product data from `/products/<handle>.js` and renders a card with
 * product image, title, price, and optional brand, discount, and rating information.
 *
 * @property {string} handle - The Shopify product handle to fetch data for. Required.
 * @property {boolean} [alternate] - Show alternate product image on hover. Defaults to false.
 * @property {boolean} [brand] - Show brand/vendor data. Defaults to false.
 * @property {boolean} [discount] - Show discount data. Defaults to false.
 * @property {boolean} [rating] - Show product rating. Defaults to false.
 *
 * @example
 * ```html
 * <simple-card handle="awesome-product" alternate brand discount rating></simple-card>
 * ```
 */
@customElement("simple-card", { observe: true })
export class SimpleCard extends NostoElement {
  /** @private */
  static attributes = {
    handle: String,
    alternate: Boolean,
    brand: Boolean,
    discount: Boolean,
    rating: Boolean
  }

  handle!: string
  alternate?: boolean
  brand?: boolean
  discount?: boolean
  rating?: boolean

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
    this.toggleAttribute("loading", true)
    try {
      const productData = await this.fetchProductData()
      this.renderCard(productData)
      this.dispatchEvent(new CustomEvent(SIMPLE_CARD_LOADED_EVENT, { bubbles: true, cancelable: true }))
    } catch (error) {
      console.error("Failed to load product data:", error)
      this.renderError()
    } finally {
      this.toggleAttribute("loading", false)
    }
  }

  private async fetchProductData(): Promise<ShopifyProduct> {
    const url = createShopifyUrl(`products/${this.handle}.js`)
    return getJSON(url.href) as Promise<ShopifyProduct>
  }

  private renderCard(product: ShopifyProduct) {
    const cardHTML = this.generateCardHTML(product)
    this.innerHTML = cardHTML

    // Add hover functionality for alternate image if enabled
    if (this.alternate && product.images && product.images.length > 1) {
      this.setupAlternateImageHover()
    }
  }

  private generateCardHTML(product: ShopifyProduct): string {
    const hasDiscount =
      this.discount &&
      product.variants?.[0]?.compare_at_price &&
      product.variants[0].compare_at_price > product.variants[0].price

    return `
      <div class="simple-card">
        ${this.generateImageHTML(product)}
        <div class="simple-card__content">
          ${this.brand && product.vendor ? `<div class="simple-card__brand">${this.escapeHTML(product.vendor)}</div>` : ""}
          <h3 class="simple-card__title">
            <a href="/products/${product.handle}" class="simple-card__link">
              ${this.escapeHTML(product.title)}
            </a>
          </h3>
          <div class="simple-card__price">
            <span class="simple-card__price-current">
              ${this.formatPrice(product.variants?.[0]?.price || 0)}
            </span>
            ${hasDiscount ? `<span class="simple-card__price-original">${this.formatPrice(product.variants[0].compare_at_price)}</span>` : ""}
          </div>
          ${this.discount && hasDiscount ? this.generateDiscountHTML(product.variants[0]) : ""}
          ${this.rating ? this.generateRatingHTML() : ""}
        </div>
      </div>
    `
  }

  private generateImageHTML(product: ShopifyProduct): string {
    const primaryImage = product.images?.[0]
    if (!primaryImage) {
      return '<div class="simple-card__image simple-card__image--placeholder"></div>'
    }

    return `
      <div class="simple-card__image">
        <a href="/products/${product.handle}" class="simple-card__image-link">
          <img 
            src="${primaryImage.src}" 
            alt="${this.escapeHTML(primaryImage.alt || product.title)}"
            width="${primaryImage.width || 300}"
            height="${primaryImage.height || 300}"
            loading="lazy"
            class="simple-card__img ${this.alternate && product.images.length > 1 ? "simple-card__img--primary" : ""}"
          />
          ${this.alternate && product.images.length > 1 ? this.generateAlternateImageHTML(product.images[1], product) : ""}
        </a>
      </div>
    `
  }

  private generateAlternateImageHTML(alternateImage: ShopifyImage, product: ShopifyProduct): string {
    return `
      <img 
        src="${alternateImage.src}" 
        alt="${this.escapeHTML(alternateImage.alt || product.title)}"
        width="${alternateImage.width || 300}"
        height="${alternateImage.height || 300}"
        loading="lazy"
        class="simple-card__img simple-card__img--alternate"
        style="opacity: 0; position: absolute; top: 0; left: 0;"
      />
    `
  }

  private generateDiscountHTML(variant: ShopifyVariant): string {
    const discountPercent = Math.round(((variant.compare_at_price - variant.price) / variant.compare_at_price) * 100)
    return `<div class="simple-card__discount">Save ${discountPercent}%</div>`
  }

  private generateRatingHTML(): string {
    // Since product rating isn't typically in Shopify product.js,
    // this is a placeholder for potential integration with review apps
    return `<div class="simple-card__rating">★★★★☆ (4.0)</div>`
  }

  private setupAlternateImageHover() {
    const imageContainer = this.querySelector(".simple-card__image-link")
    const primaryImg = this.querySelector(".simple-card__img--primary") as HTMLImageElement
    const alternateImg = this.querySelector(".simple-card__img--alternate") as HTMLImageElement

    if (!imageContainer || !primaryImg || !alternateImg) return

    imageContainer.addEventListener("mouseenter", () => {
      primaryImg.style.opacity = "0"
      alternateImg.style.opacity = "1"
    })

    imageContainer.addEventListener("mouseleave", () => {
      primaryImg.style.opacity = "1"
      alternateImg.style.opacity = "0"
    })
  }

  private formatPrice(price: number): string {
    // Convert from cents to dollars and format
    const dollars = price / 100
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(dollars)
  }

  private escapeHTML(text: string): string {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  private renderError() {
    this.innerHTML = `
      <div class="simple-card simple-card--error">
        <div class="simple-card__error">
          Failed to load product "${this.handle}"
        </div>
      </div>
    `
  }
}

// Shopify product JSON type definitions
interface ShopifyImage {
  id: number
  src: string
  alt: string | null
  width: number
  height: number
}

interface ShopifyVariant {
  id: number
  price: number
  compare_at_price: number
  available: boolean
  title: string
}

interface ShopifyProduct {
  id: number
  title: string
  handle: string
  description: string
  vendor: string
  product_type: string
  tags: string[]
  images: ShopifyImage[]
  variants: ShopifyVariant[]
}

declare global {
  interface HTMLElementTagNameMap {
    "simple-card": SimpleCard
  }
}
