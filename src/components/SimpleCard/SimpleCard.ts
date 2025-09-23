import { assertRequired } from "@/utils/assertRequired"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct } from "./types"
import { generateCardHTML } from "./markup"

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
 * <nosto-simple-card handle="awesome-product" alternate brand discount rating></nosto-simple-card>
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
    rating: Number
  }

  handle!: string
  alternate?: boolean
  brand?: boolean
  discount?: boolean
  rating?: number

  async attributeChangedCallback() {
    if (this.isConnected) {
      await loadAndRenderMarkup(this)
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    await loadAndRenderMarkup(this)
  }
}

async function loadAndRenderMarkup(element: SimpleCard) {
  element.toggleAttribute("loading", true)
  const productData = await fetchProductData(element.handle)
  // Instead of setting innerHTML, append the JSX-generated element
  const cardElement = generateCardHTML(element, productData)
  element.replaceChildren(cardElement)
  element.toggleAttribute("loading", false)
}

async function fetchProductData(handle: string) {
  const url = createShopifyUrl(`products/${handle}.js`)
  return getJSON(url.href) as Promise<ShopifyProduct>
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": SimpleCard
  }
}
