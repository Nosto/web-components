import { assertRequired, createShopifyUrl } from "@/utils"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct } from "./types"

function element(tagName: string, attributes: Record<string, string> = {}, text = ""): HTMLElement {
  const el = document.createElement(tagName)
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "className") {
      el.className = value
    } else {
      el.setAttribute(key, value)
    }
  })
  
  // Set text content if provided
  if (text) {
    el.textContent = text
  }
  
  return el
}

async function fetchProductData(handle: string): Promise<ShopifyProduct> {
  const url = createShopifyUrl(`products/${handle}.js`)
  return getJSON(url.href)
}

function renderCard(simpleCard: SimpleCard, product: ShopifyProduct) {
  const cardWrapper = element("div", { className: "card-wrapper product-card-wrapper underline-links-hover" })

  const card = element("div", { className: "card card--standard" })
  if (product.featured_image) {
    card.classList.add("card--media")
  } else {
    card.classList.add("card--text")
  }

  // Create card inner with media
  const cardInner = element("div", { className: "card__inner ratio" })

  if (product.featured_image) {
    const cardMedia = createMediaSection(simpleCard, product)
    cardInner.appendChild(cardMedia)
  }

  // Create card content
  const cardContent = element("div", { className: "card__content" })

  const cardInformation = element("div", { className: "card__information" })

  // Title
  const heading = element("h3", { className: "card__heading" })
  const link = element("a", { 
    href: product.url, 
    className: "full-unstyled-link" 
  }, product.title)
  heading.appendChild(link)
  cardInformation.appendChild(heading)

  // Additional information based on attributes
  const cardInfo = element("div", { className: "card-information" })

  // Brand/Vendor
  if (simpleCard.brand && product.vendor) {
    const vendorDiv = element("div", { 
      className: "caption-with-letter-spacing light" 
    }, product.vendor)
    cardInfo.appendChild(vendorDiv)
  }

  // Rating placeholder (Shopify doesn't provide rating in .js endpoint by default)
  if (simpleCard.rating) {
    const ratingDiv = element("div", { className: "rating" }, "Rating not available")
    cardInfo.appendChild(ratingDiv)
  }

  // Price
  const priceDiv = createPriceSection(simpleCard, product)
  cardInfo.appendChild(priceDiv)

  cardInformation.appendChild(cardInfo)
  cardContent.appendChild(cardInformation)

  // Badge for discount
  if (simpleCard.discount && product.compare_at_price && product.compare_at_price > product.price) {
    const badge = element("div", { className: "card__badge" })
    const span = element("span", { className: "badge badge--bottom-left" }, "Sale")
    badge.appendChild(span)
    cardContent.appendChild(badge)
  }

  // Availability badge
  if (!product.available) {
    const badge = element("div", { className: "card__badge" })
    const span = element("span", { className: "badge badge--bottom-left" }, "Sold out")
    badge.appendChild(span)
    cardContent.appendChild(badge)
  }

  card.appendChild(cardInner)
  card.appendChild(cardContent)
  cardWrapper.appendChild(card)

  // Clear existing content and append new card
  simpleCard.innerHTML = ""
  simpleCard.appendChild(cardWrapper)
}

function createMediaSection(simpleCard: SimpleCard, product: ShopifyProduct): HTMLElement {
  const cardMedia = element("div", { className: "card__media" })

  const media = element("div", { className: "media media--transparent" })
  if (simpleCard.alternate && product.images.length > 1) {
    media.classList.add("media--hover-effect")
  }

  const img = element("img", {
    src: product.featured_image || product.images[0],
    alt: product.title,
    className: "motion-reduce",
    loading: "lazy"
  }) as HTMLImageElement

  media.appendChild(img)

  // Add alternate image for hover effect
  if (simpleCard.alternate && product.images.length > 1) {
    const altImg = element("img", {
      src: product.images[1],
      alt: product.title,
      className: "motion-reduce",
      loading: "lazy"
    }) as HTMLImageElement
    media.appendChild(altImg)
  }

  cardMedia.appendChild(media)
  return cardMedia
}

function createPriceSection(simpleCard: SimpleCard, product: ShopifyProduct): HTMLElement {
  const priceDiv = element("div", { className: "price" })

  const currentPrice = element("span", { 
    className: "price-item price-item--regular" 
  }, formatPrice(product.price))
  priceDiv.appendChild(currentPrice)

  // Compare at price (original price when on sale)
  if (simpleCard.discount && product.compare_at_price && product.compare_at_price > product.price) {
    const comparePrice = element("span", { 
      className: "price-item price-item--sale" 
    }, formatPrice(product.compare_at_price))
    priceDiv.appendChild(comparePrice)
  }

  return priceDiv
}

function formatPrice(price: number): string {
  // Simple price formatting - in a real implementation, this should respect locale and currency
  return `$${(price / 100).toFixed(2)}`
}

function renderError(simpleCard: SimpleCard) {
  simpleCard.innerHTML = `
    <div class="card-wrapper product-card-wrapper">
      <div class="card card--text">
        <div class="card__content">
          <div class="card__information">
            <h3 class="card__heading">Error loading product</h3>
            <p>Could not load product with handle: ${simpleCard.handle}</p>
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
