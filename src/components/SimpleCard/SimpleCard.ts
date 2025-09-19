import { assertRequired, createShopifyUrl } from "@/utils"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct } from "./types"

async function fetchProductData(handle: string): Promise<ShopifyProduct> {
  const url = createShopifyUrl(`products/${handle}.js`)
  return getJSON(url.href)
}

function renderCard(element: SimpleCard, product: ShopifyProduct) {
  const cardWrapper = document.createElement("div")
  cardWrapper.className = "card-wrapper product-card-wrapper underline-links-hover"

  const card = document.createElement("div")
  card.className = "card card--standard"
  if (product.featured_image) {
    card.classList.add("card--media")
  } else {
    card.classList.add("card--text")
  }

  // Create card inner with media
  const cardInner = document.createElement("div")
  cardInner.className = "card__inner ratio"

  if (product.featured_image) {
    const cardMedia = createMediaSection(element, product)
    cardInner.appendChild(cardMedia)
  }

  // Create card content
  const cardContent = document.createElement("div")
  cardContent.className = "card__content"

  const cardInformation = document.createElement("div")
  cardInformation.className = "card__information"

  // Title
  const heading = document.createElement("h3")
  heading.className = "card__heading"
  const link = document.createElement("a")
  link.href = product.url
  link.className = "full-unstyled-link"
  link.textContent = product.title
  heading.appendChild(link)
  cardInformation.appendChild(heading)

  // Additional information based on attributes
  const cardInfo = document.createElement("div")
  cardInfo.className = "card-information"

  // Brand/Vendor
  if (element.brand && product.vendor) {
    const vendorDiv = document.createElement("div")
    vendorDiv.className = "caption-with-letter-spacing light"
    vendorDiv.textContent = product.vendor
    cardInfo.appendChild(vendorDiv)
  }

  // Rating placeholder (Shopify doesn't provide rating in .js endpoint by default)
  if (element.rating) {
    const ratingDiv = document.createElement("div")
    ratingDiv.className = "rating"
    ratingDiv.textContent = "Rating not available"
    cardInfo.appendChild(ratingDiv)
  }

  // Price
  const priceDiv = createPriceSection(element, product)
  cardInfo.appendChild(priceDiv)

  cardInformation.appendChild(cardInfo)
  cardContent.appendChild(cardInformation)

  // Badge for discount
  if (element.discount && product.compare_at_price && product.compare_at_price > product.price) {
    const badge = document.createElement("div")
    badge.className = "card__badge"
    const span = document.createElement("span")
    span.className = "badge badge--bottom-left"
    span.textContent = "Sale"
    badge.appendChild(span)
    cardContent.appendChild(badge)
  }

  // Availability badge
  if (!product.available) {
    const badge = document.createElement("div")
    badge.className = "card__badge"
    const span = document.createElement("span")
    span.className = "badge badge--bottom-left"
    span.textContent = "Sold out"
    badge.appendChild(span)
    cardContent.appendChild(badge)
  }

  card.appendChild(cardInner)
  card.appendChild(cardContent)
  cardWrapper.appendChild(card)

  // Clear existing content and append new card
  element.innerHTML = ""
  element.appendChild(cardWrapper)
}

function createMediaSection(element: SimpleCard, product: ShopifyProduct): HTMLElement {
  const cardMedia = document.createElement("div")
  cardMedia.className = "card__media"

  const media = document.createElement("div")
  media.className = "media media--transparent"
  if (element.alternate && product.images.length > 1) {
    media.classList.add("media--hover-effect")
  }

  const img = document.createElement("img")
  img.src = product.featured_image || product.images[0]
  img.alt = product.title
  img.className = "motion-reduce"
  img.loading = "lazy"
  media.appendChild(img)

  // Add alternate image for hover effect
  if (element.alternate && product.images.length > 1) {
    const altImg = document.createElement("img")
    altImg.src = product.images[1]
    altImg.alt = product.title
    altImg.className = "motion-reduce"
    altImg.loading = "lazy"
    media.appendChild(altImg)
  }

  cardMedia.appendChild(media)
  return cardMedia
}

function createPriceSection(element: SimpleCard, product: ShopifyProduct): HTMLElement {
  const priceDiv = document.createElement("div")
  priceDiv.className = "price"

  const currentPrice = document.createElement("span")
  currentPrice.className = "price-item price-item--regular"
  currentPrice.textContent = formatPrice(product.price)
  priceDiv.appendChild(currentPrice)

  // Compare at price (original price when on sale)
  if (element.discount && product.compare_at_price && product.compare_at_price > product.price) {
    const comparePrice = document.createElement("span")
    comparePrice.className = "price-item price-item--sale"
    comparePrice.textContent = formatPrice(product.compare_at_price)
    priceDiv.appendChild(comparePrice)
  }

  return priceDiv
}

function formatPrice(price: number): string {
  // Simple price formatting - in a real implementation, this should respect locale and currency
  return `$${(price / 100).toFixed(2)}`
}

function renderError(element: SimpleCard) {
  element.innerHTML = `
    <div class="card-wrapper product-card-wrapper">
      <div class="card card--text">
        <div class="card__content">
          <div class="card__information">
            <h3 class="card__heading">Error loading product</h3>
            <p>Could not load product with handle: ${element.handle}</p>
          </div>
        </div>
      </div>
    </div>
  `
}

/**
 * A simple custom element that renders a product card by fetching Shopify product data
 * based on the provided handle and rendering it in the light DOM.
 *
 * @property {string} handle - The product handle to fetch data for. Required.
 * @property {boolean} [alternate=false] - Show alternate product on hover.
 * @property {boolean} [brand=false] - Show brand data.
 * @property {boolean} [discount=false] - Show discount data.
 * @property {boolean} [rating=false] - Show rating.
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

  async attributeChangedCallback() {
    if (this.isConnected) {
      await this.loadAndRender()
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    await this.loadAndRender()
  }

  async loadAndRender() {
    this.toggleAttribute("loading", true)
    try {
      const product = await fetchProductData(this.handle)
      renderCard(this, product)
    } catch (error) {
      console.error("Failed to load product data:", error)
      renderError(this)
    } finally {
      this.toggleAttribute("loading", false)
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": SimpleCard
  }
}
