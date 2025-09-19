import { assertRequired, createShopifyUrl } from "@/utils"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import { html } from "@/templating/lit"
import { renderTemplate } from "@/templating/lit"

/**
 * A custom element that renders a simple product card by fetching Shopify product data.
 *
 * This component fetches product data from Shopify and renders it using lit-html templating
 * in the light DOM.
 *
 * @property {string} handle - The product handle to fetch data for. Required.
 * @property {boolean} [alternate] - Show alternate product on hover. Defaults to false.
 * @property {boolean} [brand] - Show brand data. Defaults to false.
 * @property {boolean} [discount] - Show discount data. Defaults to false.
 * @property {boolean} [rating] - Show rating. Defaults to false.
 *
 * @example
 * ```html
 * <nosto-simple-card handle="awesome-product" brand discount>
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

  private productData?: ShopifyProduct

  async connectedCallback() {
    assertRequired(this, "handle")
    await this.loadAndRender()
  }

  async attributeChangedCallback() {
    if (this.isConnected && this.handle) {
      await this.loadAndRender()
    }
  }

  private async loadAndRender() {
    try {
      this.toggleAttribute("loading", true)
      this.productData = await this.fetchProductData()
      this.render()
    } catch (error) {
      console.error("Failed to load product data:", error)
      this.renderError()
    } finally {
      this.toggleAttribute("loading", false)
    }
  }

  private async fetchProductData(): Promise<ShopifyProduct> {
    const url = createShopifyUrl(`products/${this.handle}.js`)
    return await getJSON(url.href)
  }

  private render() {
    if (!this.productData) return

    const product = this.productData
    const template = html`
      <div class="card-wrapper product-card-wrapper">
        <div class="card card--standard card--media">
          <div class="card__inner">
            ${product.featured_image
              ? html`
                  <div class="card__media">
                    <div class="media">
                      <img
                        src="${product.featured_image}"
                        alt="${product.title}"
                        loading="lazy"
                        class="motion-reduce"
                      />
                      ${this.alternate && product.images?.[1]
                        ? html`
                            <img
                              src="${product.images[1]}"
                              alt="${product.title}"
                              loading="lazy"
                              class="motion-reduce media--hover"
                            />
                          `
                        : ""}
                    </div>
                  </div>
                `
              : ""}

            <div class="card__content">
              <div class="card__information">
                <h3 class="card__heading">
                  <a href="/products/${product.handle}" class="full-unstyled-link"> ${product.title} </a>
                </h3>

                ${this.brand && product.vendor ? html` <div class="card__vendor">${product.vendor}</div> ` : ""}

                <div class="card__price">
                  ${product.compare_at_price && product.compare_at_price > product.price && this.discount
                    ? html`
                        <span class="price__sale">
                          <span class="price__current">${this.formatPrice(product.price)}</span>
                          <span class="price__compare">${this.formatPrice(product.compare_at_price)}</span>
                        </span>
                        <span class="badge badge--sale">Sale</span>
                      `
                    : html` <span class="price__current">${this.formatPrice(product.price)}</span> `}
                </div>

                ${this.rating
                  ? html`
                      <div class="card__rating">
                        <!-- Rating would be implemented based on available data -->
                        <div class="rating" role="img" aria-label="Rating placeholder">★★★★☆</div>
                      </div>
                    `
                  : ""}
              </div>

              <div class="card__badge">
                ${!product.available ? html` <span class="badge badge--sold-out">Sold out</span> ` : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    renderTemplate(this, template)
  }

  private renderError() {
    const template = html`
      <div class="card-wrapper product-card-wrapper">
        <div class="card card--standard">
          <div class="card__content">
            <p>Failed to load product: ${this.handle}</p>
          </div>
        </div>
      </div>
    `
    renderTemplate(this, template)
  }

  private formatPrice(price?: number): string {
    if (typeof price !== "number") return ""
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price / 100) // Shopify prices are in cents
  }
}

/**
 * Basic Shopify product data structure
 */
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
  compare_at_price?: number
  compare_at_price_min?: number
  compare_at_price_max?: number
  compare_at_price_varies?: boolean
  variants: ShopifyVariant[]
  images: string[]
  featured_image?: string
  options: ShopifyOption[]
  url: string
}

interface ShopifyVariant {
  id: number
  title: string
  option1?: string
  option2?: string
  option3?: string
  sku: string
  requires_shipping: boolean
  taxable: boolean
  featured_image?: string
  available: boolean
  name: string
  public_title: string
  options: string[]
  price: number
  weight: number
  compare_at_price?: number
  inventory_management: string
  barcode: string
  featured_media?: {
    alt?: string
    id: number
    position: number
    preview_image: {
      aspect_ratio: number
      height: number
      width: number
      src: string
    }
  }
}

interface ShopifyOption {
  name: string
  position: number
  values: string[]
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": SimpleCard
  }
}
