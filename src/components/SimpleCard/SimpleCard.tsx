/** @jsx createElement */
import { assertRequired, createShopifyUrl } from "@/utils"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct } from "./types"
import { createElement } from "@/utils/jsx"
import { Media } from "./Media"
import { Price } from "./Price"
import { Brand } from "./Brand"
import { Badge } from "./Badge"

async function fetchProductData(handle: string): Promise<ShopifyProduct> {
  const url = createShopifyUrl(`products/${handle}.js`)
  return getJSON(url.href)
}

/**
 * A simple custom element that renders a product card by fetching Shopify product data
 * based on the provided handle and rendering it in the light DOM.
 *
 * @property {string} handle - The product handle to fetch data for. Required.
 * @property {boolean} [alternate=false] - Show alternate product on hover.
 * @property {boolean} [brand=false] - Show brand data.
 * @property {boolean} [discount=false] - Show discount data.

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
    discount: Boolean
  }

  handle!: string
  alternate?: boolean
  brand?: boolean
  discount?: boolean

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
    const product = await fetchProductData(this.handle)

    // Inline CardWrapper logic - render the card structure directly
    const cardWrapper = (
      <div className="card-wrapper product-card-wrapper underline-links-hover">
        <div className={`card card--standard${product.featured_image ? " card--media" : " card--text"}`}>
          <a href={product.url} className="full-unstyled-link">
            <div className="card__inner ratio">
              {product.featured_image && <Media alternate={this.alternate} product={product} />}
            </div>
            <div className="card__content">
              <div className="card__information">
                <h3 className="card__heading">{product.title}</h3>
                <div className="card-information">
                  {this.brand && product.vendor && <Brand product={product} />}
                  <Price discount={this.discount} product={product} />
                </div>
              </div>
              <Badge product={product} discount={this.discount} />
            </div>
          </a>
        </div>
      </div>
    )

    // Clear existing content and append new card
    this.innerHTML = ""
    this.appendChild(cardWrapper)
    this.toggleAttribute("loading", false)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": SimpleCard
  }
}
