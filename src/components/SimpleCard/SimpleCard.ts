import { assertRequired, createShopifyUrl } from "@/utils"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct } from "./types"
import { renderCard } from "./renderCard"

async function fetchProductData(handle: string): Promise<ShopifyProduct> {
  const url = createShopifyUrl(`products/${handle}.js`)
  return getJSON(url.href)
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
