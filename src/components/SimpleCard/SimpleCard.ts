import { assertRequired, createShopifyUrl } from "@/utils"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import { html, render, TemplateResult } from "lit"
import type { ShopifyProduct } from "./types"

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

  async connectedCallback() {
    assertRequired(this, "handle")
    await loadAndRender(this)
  }

  async attributeChangedCallback() {
    if (this.isConnected && this.handle) {
      await loadAndRender(this)
    }
  }
}

/**
 * Fetches product data from Shopify
 */
async function fetchProductData(handle: string): Promise<ShopifyProduct> {
  const url = createShopifyUrl(`products/${handle}.js`)
  return await getJSON(url.href)
}

/**
 * Formats price from cents to currency string
 */
function formatPrice(price?: number): string {
  if (typeof price !== "number") return ""
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(price / 100) // Shopify prices are in cents
}

/**
 * Renders media section (product images)
 */
function renderMedia(product: ShopifyProduct, showAlternate: boolean) {
  if (!product.featured_image) return ""
  
  return html`
    <div class="card__media">
      <div class="media">
        <img
          src="${product.featured_image}"
          alt="${product.title}"
          loading="lazy"
          class="motion-reduce"
        />
        ${showAlternate && product.images?.[1]
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
}

/**
 * Renders price section with discount handling
 */
function renderPrice(product: ShopifyProduct, showDiscount: boolean) {
  return html`
    <div class="card__price">
      ${product.compare_at_price && product.compare_at_price > product.price && showDiscount
        ? html`
            <span class="price__sale">
              <span class="price__current">${formatPrice(product.price)}</span>
              <span class="price__compare">${formatPrice(product.compare_at_price)}</span>
            </span>
            <span class="badge badge--sale">Sale</span>
          `
        : html` <span class="price__current">${formatPrice(product.price)}</span> `}
    </div>
  `
}

/**
 * Renders rating section
 */
function renderRating() {
  return html`
    <div class="card__rating">
      <!-- Rating would be implemented based on available data -->
      <div class="rating" role="img" aria-label="Rating placeholder">★★★★☆</div>
    </div>
  `
}

/**
 * Renders the complete product card
 */
function renderProductCard(
  product: ShopifyProduct,
  options: {
    alternate: boolean
    brand: boolean
    discount: boolean
    rating: boolean
  }
) {
  return html`
    <div class="card-wrapper product-card-wrapper">
      <div class="card card--standard card--media">
        <div class="card__inner">
          <a href="/products/${product.handle}" class="full-unstyled-link">
            ${renderMedia(product, options.alternate)}
            
            <div class="card__content">
              <div class="card__information">
                <h3 class="card__heading">${product.title}</h3>
                
                ${options.brand && product.vendor ? html`<div class="card__vendor">${product.vendor}</div>` : ""}
                
                ${renderPrice(product, options.discount)}

                ${options.rating ? renderRating() : ""}
              </div>
              
              <div class="card__badge">
                ${!product.available ? html`<span class="badge badge--sold-out">Sold out</span>` : ""}
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  `
}

/**
 * Loads and renders the product card
 */
async function loadAndRender(element: SimpleCard) {
  element.toggleAttribute("loading", true)
  const productData = await fetchProductData(element.handle)
  
  const template = renderProductCard(productData, {
    alternate: element.alternate || false,
    brand: element.brand || false,
    discount: element.discount || false,
    rating: element.rating || false
  })
  
  render(template, element)
  element.toggleAttribute("loading", false)
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": SimpleCard
  }
}
