import { assertRequired, createShopifyUrl } from "@/utils"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct, ShopifyImage, ShopifyVariant } from "./types"

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
      const productData = await fetchProductData(this.handle)
      renderCard(this, productData)
    } catch (error) {
      console.error("Failed to load product data:", error)
      renderError(this)
    } finally {
      this.toggleAttribute("loading", false)
    }
  }
}

async function fetchProductData(handle: string): Promise<ShopifyProduct> {
  const url = createShopifyUrl(`products/${handle}.js`)
  return getJSON(url.href) as Promise<ShopifyProduct>
}

function renderCard(element: SimpleCard, product: ShopifyProduct) {
  const cardHTML = generateCardHTML(element, product)
  element.innerHTML = cardHTML
}

function generateCardHTML(element: SimpleCard, product: ShopifyProduct): string {
  const hasDiscount =
    element.discount &&
    product.variants?.[0]?.compare_at_price &&
    product.variants[0].compare_at_price > product.variants[0].price

  return `
    <div class="simple-card">
      ${generateImageHTML(element, product)}
      <div class="simple-card__content">
        ${element.brand && product.vendor ? `<div class="simple-card__brand">${escapeHTML(product.vendor)}</div>` : ""}
        <h3 class="simple-card__title">
          <a href="/products/${product.handle}" class="simple-card__link">
            ${escapeHTML(product.title)}
          </a>
        </h3>
        <div class="simple-card__price">
          <span class="simple-card__price-current">
            ${formatPrice(product.variants?.[0]?.price || 0)}
          </span>
          ${hasDiscount ? `<span class="simple-card__price-original">${formatPrice(product.variants[0].compare_at_price)}</span>` : ""}
        </div>
        ${element.discount && hasDiscount ? generateDiscountHTML(product.variants[0]) : ""}
        ${element.rating ? generateRatingHTML() : ""}
      </div>
    </div>
  `
}

function generateImageHTML(element: SimpleCard, product: ShopifyProduct): string {
  const primaryImage = product.images?.[0]
  if (!primaryImage) {
    return '<div class="simple-card__image simple-card__image--placeholder"></div>'
  }

  const hasAlternate = element.alternate && product.images.length > 1

  return `
    <div class="simple-card__image ${hasAlternate ? "simple-card__image--alternate" : ""}">
      <a href="/products/${product.handle}" class="simple-card__image-link">
        <img 
          src="${primaryImage.src}" 
          alt="${escapeHTML(primaryImage.alt || product.title)}"
          width="${primaryImage.width || 300}"
          height="${primaryImage.height || 300}"
          loading="lazy"
          class="simple-card__img simple-card__img--primary"
        />
        ${hasAlternate ? generateAlternateImageHTML(product.images[1], product) : ""}
      </a>
    </div>
  `
}

function generateAlternateImageHTML(alternateImage: ShopifyImage, product: ShopifyProduct): string {
  return `
    <img 
      src="${alternateImage.src}" 
      alt="${escapeHTML(alternateImage.alt || product.title)}"
      width="${alternateImage.width || 300}"
      height="${alternateImage.height || 300}"
      loading="lazy"
      class="simple-card__img simple-card__img--alternate"
    />
  `
}

function generateDiscountHTML(variant: ShopifyVariant): string {
  const discountPercent = Math.round(((variant.compare_at_price - variant.price) / variant.compare_at_price) * 100)
  return `<div class="simple-card__discount">Save ${discountPercent}%</div>`
}

function generateRatingHTML(): string {
  // Since product rating isn't typically in Shopify product.js,
  // this is a placeholder for potential integration with review apps
  return `<div class="simple-card__rating">★★★★☆ (4.0)</div>`
}

function formatPrice(price: number): string {
  // Convert from cents to dollars and format
  const dollars = price / 100
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(dollars)
}

function escapeHTML(text: string): string {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

function renderError(element: SimpleCard) {
  element.innerHTML = `
    <div class="simple-card simple-card--error">
      <div class="simple-card__error">
        Failed to load product "${element.handle}"
      </div>
    </div>
  `
}
declare global {
  interface HTMLElementTagNameMap {
    "simple-card": SimpleCard
  }
}
