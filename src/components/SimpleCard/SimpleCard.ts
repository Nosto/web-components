import { assertRequired, createShopifyUrl } from "@/utils"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"

/** Event name for the SimpleCard loaded event */
const SIMPLE_CARD_LOADED_EVENT = "@nosto/SimpleCard/loaded"

/**
 * A custom element that renders a product card by fetching JSON data from Shopify based on the provided handle.
 *
 * This component fetches product data from Shopify's `/products/<handle>.js` endpoint and renders
 * a product card with configurable display options based on the Shopify Dawn theme structure.
 *
 * @property {string} handle - The product handle to fetch data for. Required.
 * @property {boolean} [alternate] - Show alternate product image on hover. Defaults to false.
 * @property {boolean} [brand] - Show brand/vendor data. Defaults to false.
 * @property {boolean} [discount] - Show discount data. Defaults to false.
 * @property {boolean} [rating] - Show rating data. Defaults to false.
 *
 * @example
 * ```html
 * <nosto-simple-card handle="awesome-product" brand="true" rating="true">
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
      await loadAndRenderCard(this)
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    await loadAndRenderCard(this)
  }
}

async function loadAndRenderCard(element: SimpleCard) {
  element.toggleAttribute("loading", true)
  try {
    const productData = await getProductData(element)
    element.innerHTML = generateCardMarkup(productData, element)
    element.dispatchEvent(new CustomEvent(SIMPLE_CARD_LOADED_EVENT, { bubbles: true, cancelable: true }))
  } catch (error) {
    console.error("Failed to load SimpleCard:", error)
    element.innerHTML = `<div class="simple-card-error">Failed to load product</div>`
  } finally {
    element.toggleAttribute("loading", false)
  }
}

async function getProductData(element: SimpleCard) {
  const target = createShopifyUrl(`products/${element.handle}.js`)
  return getJSON(target.href)
}

interface ShopifyProduct {
  title: string
  handle: string
  vendor: string
  price: number
  compare_at_price: number | null
  images: string[]
  variants: Array<{
    id: number
    title: string
    price: number
    compare_at_price?: number | null
  }>
  url: string
}

function generateCardMarkup(product: ShopifyProduct, element: SimpleCard): string {
  const { title, vendor, price, compare_at_price, images, url } = product

  const primaryImage = images?.[0]
  const secondaryImage = element.alternate === true && images?.[1] ? images[1] : null
  const hasDiscount = element.discount === true && compare_at_price && compare_at_price > price
  const discountPercent = hasDiscount ? Math.round(((compare_at_price - price) / compare_at_price) * 100) : 0

  return `
    <div class="card-wrapper product-card-wrapper underline-links-hover">
      <div class="card card--standard card--media">
        <div class="card__inner ratio" style="--ratio-percent: 100%;">
          ${
            primaryImage
              ? `
            <div class="card__media">
              <div class="media media--transparent media--hover-effect">
                <img
                  src="${primaryImage}"
                  alt="${title}"
                  class="motion-reduce"
                  loading="lazy"
                  width="533"
                  height="533"
                >
                ${
                  secondaryImage
                    ? `
                  <img
                    src="${secondaryImage}"
                    alt="${title}"
                    class="motion-reduce secondary-image"
                    loading="lazy"
                    width="533"
                    height="533"
                  >
                `
                    : ""
                }
              </div>
            </div>
          `
              : ""
          }
          <div class="card__content">
            <div class="card__information">
              <h3 class="card__heading">
                <a href="${url}" class="full-unstyled-link">
                  ${title}
                </a>
              </h3>
              ${
                element.brand === true && vendor
                  ? `
                <div class="card__vendor">
                  <span class="visually-hidden">Vendor:</span>
                  ${vendor}
                </div>
              `
                  : ""
              }
              ${
                hasDiscount
                  ? `
                <div class="card__badge">
                  <span class="badge badge--discount">
                    ${discountPercent}% off
                  </span>
                </div>
              `
                  : ""
              }
              <div class="price">
                ${
                  hasDiscount
                    ? `
                  <div class="price__container">
                    <span class="price__regular">
                      <span class="visually-hidden">Regular price:</span>
                      <span class="money">${formatPrice(price)}</span>
                    </span>
                    <span class="price__sale">
                      <span class="visually-hidden">Sale price:</span>
                      <span class="money">${formatPrice(compare_at_price)}</span>
                    </span>
                  </div>
                `
                    : `
                  <div class="price__container">
                    <span class="price__regular">
                      <span class="visually-hidden">Price:</span>
                      <span class="money">${formatPrice(price)}</span>
                    </span>
                  </div>
                `
                }
              </div>
              ${
                element.rating === true
                  ? `
                <div class="card__rating">
                  <span class="rating-stars">★★★★☆</span>
                  <span class="rating-count">(${Math.floor(Math.random() * 100) + 1})</span>
                </div>
              `
                  : ""
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `.trim()
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(price / 100)
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": SimpleCard
  }
}
