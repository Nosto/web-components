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
 * The component renders inside a shadow DOM with encapsulated styles. Styling can be
 * customized using the following CSS custom properties:
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

  private _shadowRoot!: ShadowRoot

  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: "open" })
  }

  get cardShadowRoot(): ShadowRoot {
    return this._shadowRoot
  }

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

  // Create the shadow DOM content with styles and markup
  const cardHTML = generateCardHTML(element, productData)
  element.cardShadowRoot.innerHTML = `
    <style>${getCardStyles()}</style>
    ${cardHTML.html}
  `

  element.toggleAttribute("loading", false)
}

async function fetchProductData(handle: string) {
  const url = createShopifyUrl(`products/${handle}.js`)
  return getJSON<ShopifyProduct>(url.href)
}

function getCardStyles(): string {
  return `
    :host {
      display: var(--simple-card-display, block);
      border: 1px solid var(--simple-card-border, #e1e1e1);
      border-radius: var(--simple-card-border-radius, 8px);
      overflow: hidden;
      background: var(--simple-card-bg, white);
      transition: box-shadow 0.2s ease;
    }

    :host(:hover) { 
      box-shadow: var(--simple-card-hover-shadow, 0 4px 12px rgba(0, 0, 0, 0.1)); 
    }
    
    :host([loading]) { 
      opacity: var(--simple-card-loading-opacity, 0.7); 
    }

    /* Card structure */
    .simple-card { 
      display: flex; 
      flex-direction: column; 
      height: 100%; 
    }
    
    .simple-card__image { 
      position: relative; 
      width: 100%; 
      overflow: hidden; 
    }
    
    .simple-card__img { 
      width: 100%; 
      height: 100%; 
      object-fit: cover; 
      transition: opacity 0.3s ease; 
    }

    /* Alternate image hover */
    .simple-card__image--alternate .simple-card__img--alternate { 
      position: absolute; 
      top: 0; 
      left: 0; 
      opacity: 0; 
    }
    
    .simple-card__image--alternate:hover .simple-card__img--primary { 
      opacity: 0; 
    }
    
    .simple-card__image--alternate:hover .simple-card__img--alternate { 
      opacity: 1; 
    }

    /* Content */
    .simple-card__content { 
      padding: var(--simple-card-content-padding, 1rem); 
      flex: 1; 
    }
    
    .simple-card__brand { 
      font-size: 12px; 
      color: var(--simple-card-brand-color, #666); 
      text-transform: uppercase; 
      margin-bottom: 0.5rem; 
    }
    
    .simple-card__title { 
      margin: 0 0 0.5rem; 
      color: var(--simple-card-title-color, inherit);
    }
    
    .simple-card__link { 
      text-decoration: none; 
      color: var(--simple-card-link-color, #333); 
      font-weight: 500; 
    }
    
    .simple-card__link:hover { 
      color: var(--simple-card-link-hover-color, #0066cc); 
    }
    
    .simple-card__price { 
      margin: 0.5rem 0; 
      display: flex; 
      gap: 0.5rem; 
    }
    
    .simple-card__price-current { 
      font-size: 18px; 
      font-weight: 600; 
      color: var(--simple-card-price-color, inherit);
    }
    
    .simple-card__price-original { 
      color: var(--simple-card-price-original-color, #999); 
      text-decoration: line-through; 
    }
    
    .simple-card__discount { 
      background: var(--simple-card-discount-bg, #e74c3c); 
      color: var(--simple-card-discount-color, white); 
      padding: 0.25rem 0.5rem; 
      border-radius: 4px; 
      font-size: 12px; 
      width: fit-content; 
    }

    .simple-card__rating { 
      color: var(--simple-card-rating-color, inherit);
      font-size: 14px;
      margin-top: 0.5rem;
    }

    .simple-card__image--placeholder {
      background: var(--simple-card-placeholder-bg, #f5f5f5);
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--simple-card-placeholder-color, #999);
    }

    .simple-card__image--placeholder::after {
      content: "No image available";
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": SimpleCard
  }
}
