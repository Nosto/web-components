import { assertRequired } from "@/utils/assertRequired"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct } from "./types"
import { generateCardHTML, updateSimpleCardContent } from "./markup"
import styles from "./styles.css?raw"
import type { VariantChangeDetail } from "./types"

// Cache the stylesheet for reuse across component instances
let cachedStyleSheet: CSSStyleSheet | null = null

/**
 * A custom element that displays a product card using Shopify product data.
 *
 * Fetches product data from `/products/<handle>.js` and renders a card with
 * product image, title, price, and optional brand, discount, and rating information.
 *
 * The component renders inside a shadow DOM with encapsulated styles. Styling can be
 * customized using the following CSS custom properties:
 *
 * @category Campaign level templating
 *
 * @csspart host - The host element styles
 * @cssprop --simple-card-border - Border color (default: #e1e1e1)
 * @cssprop --simple-card-bg - Background color (default: white)
 * @cssprop --simple-card-hover-shadow - Box shadow on hover (default: 0 4px 12px rgba(0, 0, 0, 0.1))
 * @cssprop --simple-card-loading-opacity - Opacity when loading (default: 0.7)
 * @cssprop --simple-card-border-radius - Border radius (default: 8px)
 * @cssprop --simple-card-content-padding - Content area padding (default: 1rem)
 * @cssprop --simple-card-brand-color - Brand text color (default: #666)
 * @cssprop --simple-card-title-color - Title text color (default: inherit)
 * @cssprop --simple-card-link-color - Link color (default: #333)
 * @cssprop --simple-card-link-hover-color - Link hover color (default: #0066cc)
 * @cssprop --simple-card-price-color - Current price color (default: inherit)
 * @cssprop --simple-card-price-original-color - Original price color (default: #999)
 * @cssprop --simple-card-discount-bg - Discount badge background (default: #e74c3c)
 * @cssprop --simple-card-discount-color - Discount badge text color (default: white)
 *
 * @property {string} handle - The Shopify product handle to fetch data for. Required.
 * @property {boolean} [alternate] - Show alternate product image on hover. Defaults to false.
 * @property {boolean} [brand] - Show brand/vendor data. Defaults to false.
 * @property {boolean} [discount] - Show discount data. Defaults to false.
 * @property {boolean} [rating] - Show product rating. Defaults to false.
 * @property {string} [sizes] - The sizes attribute for responsive images to help the browser choose the right image size.
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
    rating: Number,
    sizes: String
  }

  handle!: string
  alternate?: boolean
  brand?: boolean
  discount?: boolean
  rating?: number
  sizes?: string

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  async attributeChangedCallback() {
    if (this.isConnected) {
      await loadAndRenderMarkup(this)
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    await loadAndRenderMarkup(this)
    this.addEventListener("variantchange", this)
  }

  handleEvent(event: Event) {
    event.stopPropagation()
    const customEvent = event as CustomEvent<VariantChangeDetail>
    const { variant } = customEvent.detail
    updateSimpleCardContent(this, variant)
  }
}

async function loadAndRenderMarkup(element: SimpleCard) {
  element.toggleAttribute("loading", true)
  try {
    const productData = await fetchProductData(element.handle)

    const cardHTML = generateCardHTML(element, productData)

    // Use constructible stylesheets if supported, fallback to inline styles
    if ("adoptedStyleSheets" in element.shadowRoot!) {
      if (!cachedStyleSheet) {
        cachedStyleSheet = new CSSStyleSheet()
        await cachedStyleSheet.replace(styles)
      }
      element.shadowRoot!.adoptedStyleSheets = [cachedStyleSheet]
      element.shadowRoot!.innerHTML = cardHTML.html
    } else {
      element.shadowRoot!.innerHTML = `
        <style>${styles}</style>
        ${cardHTML.html}
      `
    }
  } finally {
    element.toggleAttribute("loading", false)
  }
}

async function fetchProductData(handle: string) {
  const url = createShopifyUrl(`products/${handle}.js`)
  return getJSON<ShopifyProduct>(url.href, { cached: true })
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": SimpleCard
  }
}
