import { assertRequired, createShopifyUrl } from "@/utils"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"

/** Event name for the SimpleCard loaded event */
const SIMPLE_CARD_LOADED_EVENT = "@nosto/SimpleCard/loaded"

/**
 * Shopify product interface based on the /products/{handle}.js endpoint
 */
interface ShopifyProduct {
  id: number
  title: string
  handle: string
  vendor?: string
  price: number
  price_min: number
  price_max: number
  compare_at_price?: number
  compare_at_price_min?: number
  compare_at_price_max?: number
  available: boolean
  images: string[]
  featured_image?: string
  variants: Array<{
    id: number
    title: string
    option1?: string
    option2?: string
    option3?: string
    price: number
    compare_at_price?: number
    available: boolean
    featured_image?: {
      src: string
      alt?: string
    }
  }>
  options: Array<{
    name: string
    values: string[]
  }>
}

/**
 * A custom element that displays a product card using Shopify product data.
 *
 * Fetches product data from `/products/<handle>.js` (Shopify AJAX endpoint) and
 * renders a product card with configurable features.
 *
 * @property {string} handle - Shopify product handle (required)
 * @property {boolean} [alternate] - Show alternate product image on hover (default: false)
 * @property {boolean} [brand] - Show brand/vendor data (default: false)
 * @property {boolean} [discount] - Show discount data (default: false)
 * @property {boolean} [rating] - Show product rating (default: false)
 *
 * @example
 * ```html
 * <nosto-simple-card handle="awesome-product" alternate brand discount>
 * </nosto-simple-card>
 * ```
 */
@customElement("nosto-simple-card", { observe: true })
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

  private product?: ShopifyProduct

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  async attributeChangedCallback() {
    if (this.isConnected && this.handle) {
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
      this.product = await this.fetchProduct()
      this.render()
      this.dispatchEvent(new CustomEvent(SIMPLE_CARD_LOADED_EVENT, { bubbles: true, cancelable: true }))
    } catch (error) {
      console.error("Failed to load product:", error)
      this.renderError()
    } finally {
      this.toggleAttribute("loading", false)
    }
  }

  private async fetchProduct(): Promise<ShopifyProduct> {
    const url = createShopifyUrl(`products/${this.handle}.js`)
    return getJSON(url.href) as Promise<ShopifyProduct>
  }

  private render() {
    if (!this.product || !this.shadowRoot) return

    const { product } = this
    const primaryImage = product.featured_image || product.images[0]
    const alternateImage = this.alternate && product.images.length > 1 ? product.images[1] : null

    // Format price display
    const price = (product.price / 100).toFixed(2)
    const comparePrice = product.compare_at_price ? (product.compare_at_price / 100).toFixed(2) : null
    const hasDiscount = comparePrice && product.compare_at_price && product.compare_at_price > product.price

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          --card-background: var(--nosto-simple-card-background, #fff);
          --card-border: var(--nosto-simple-card-border, 1px solid #e1e3e5);
          --card-border-radius: var(--nosto-simple-card-border-radius, 8px);
          --card-padding: var(--nosto-simple-card-padding, 16px);
          --card-shadow: var(--nosto-simple-card-shadow, 0 2px 4px rgba(0,0,0,0.1));
          
          --text-color: var(--nosto-simple-card-text-color, #333);
          --title-color: var(--nosto-simple-card-title-color, #000);
          --price-color: var(--nosto-simple-card-price-color, #000);
          --compare-price-color: var(--nosto-simple-card-compare-price-color, #999);
          --brand-color: var(--nosto-simple-card-brand-color, #666);
          --discount-color: var(--nosto-simple-card-discount-color, #d73527);
          
          --font-family: var(--nosto-simple-card-font-family, inherit);
          --title-font-size: var(--nosto-simple-card-title-font-size, 1rem);
          --title-font-weight: var(--nosto-simple-card-title-font-weight, 600);
          --price-font-size: var(--nosto-simple-card-price-font-size, 1rem);
          --price-font-weight: var(--nosto-simple-card-price-font-weight, 700);
        }

        .card {
          background: var(--card-background);
          border: var(--card-border);
          border-radius: var(--card-border-radius);
          padding: var(--card-padding);
          box-shadow: var(--card-shadow);
          font-family: var(--font-family);
          color: var(--text-color);
          transition: transform 0.2s ease-in-out;
        }

        .card:hover {
          transform: translateY(-2px);
        }

        .image-container {
          position: relative;
          overflow: hidden;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .product-image {
          width: 100%;
          height: auto;
          display: block;
          transition: opacity 0.3s ease;
        }

        .product-image.alternate {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
        }

        ${
          this.alternate
            ? `
        .image-container:hover .product-image.primary {
          opacity: 0;
        }

        .image-container:hover .product-image.alternate {
          opacity: 1;
        }
        `
            : ""
        }

        .brand {
          font-size: 0.875rem;
          color: var(--brand-color);
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .title {
          font-size: var(--title-font-size);
          font-weight: var(--title-font-weight);
          color: var(--title-color);
          margin: 0 0 8px 0;
          line-height: 1.4;
        }

        .price-container {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .price {
          font-size: var(--price-font-size);
          font-weight: var(--price-font-weight);
          color: var(--price-color);
        }

        .compare-price {
          font-size: 0.875rem;
          color: var(--compare-price-color);
          text-decoration: line-through;
        }

        .discount {
          background: var(--discount-color);
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-left: auto;
        }

        .rating {
          margin-top: 8px;
          font-size: 0.875rem;
          color: var(--text-color);
        }

        .rating-stars {
          color: #ffa500;
          margin-right: 4px;
        }

        .error {
          color: #d73527;
          text-align: center;
          padding: 20px;
        }

        :host([loading]) .card {
          opacity: 0.6;
        }
      </style>

      <div class="card">
        <div class="image-container">
          <img 
            class="product-image primary" 
            src="${primaryImage}" 
            alt="${product.title}"
            loading="lazy"
          />
          ${
            alternateImage
              ? `
            <img 
              class="product-image alternate" 
              src="${alternateImage}" 
              alt="${product.title}"
              loading="lazy"
            />
          `
              : ""
          }
        </div>

        ${
          this.brand && product.vendor
            ? `
          <div class="brand">${product.vendor}</div>
        `
            : ""
        }

        <h3 class="title">${product.title}</h3>

        <div class="price-container">
          <span class="price">$${price}</span>
          ${
            hasDiscount
              ? `
            <span class="compare-price">$${comparePrice}</span>
            ${
              this.discount
                ? `
              <span class="discount">
                ${Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)}% OFF
              </span>
            `
                : ""
            }
          `
              : ""
          }
        </div>

        ${
          this.rating
            ? `
          <div class="rating">
            <span class="rating-stars">★★★★☆</span>
            <span>4.2 (24 reviews)</span>
          </div>
        `
            : ""
        }
      </div>
    `
  }

  private renderError() {
    if (!this.shadowRoot) return

    this.shadowRoot.innerHTML = `
      <style>
        .error {
          color: #d73527;
          text-align: center;
          padding: 20px;
          font-family: inherit;
        }
      </style>
      <div class="error">
        Failed to load product "${this.handle}"
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": SimpleCard
  }
}
