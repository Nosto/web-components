import { customElement } from "../decorators"
import { nostojs } from "@nosto/nosto-js"
import { JSONResult, JSONProduct } from "@nosto/nosto-js/client"
import { NostoElement } from "../NostoElement"
import { addRequest } from "../NostoCampaign/orchestrator"

/**
 * A Shopify-specific custom element that renders a Nosto campaign with different display modes.
 * This component fetches campaign data from Nosto and renders it in grid, carousel, or bundle layout.
 * It can optionally delegate product card rendering to Shopify via NostoDynamicCard.
 *
 * @property {string} placement - The placement identifier for the campaign. Required.
 * @property {string} [mode] - The rendering mode: 'grid', 'carousel', or 'bundle'. Defaults to 'grid'.
 * @property {string} [card] - If provided, delegates card rendering to Shopify via NostoDynamicCard.
 *
 * @example
 * ```html
 * <!-- Basic grid layout -->
 * <nosto-simple-campaign placement="frontpage-nosto-1"></nosto-simple-campaign>
 *
 * <!-- Carousel layout with Shopify card rendering -->
 * <nosto-simple-campaign
 *   placement="frontpage-nosto-2"
 *   mode="carousel"
 *   card="product-card">
 * </nosto-simple-campaign>
 * ```
 */
@customElement("nosto-simple-campaign")
export class NostoSimpleCampaign extends NostoElement {
  /** @private */
  static attributes = {
    placement: String,
    mode: String,
    card: String,
    productId: String,
    variantId: String
  }

  placement!: string
  mode?: string
  card?: string
  productId?: string
  variantId?: string

  async connectedCallback() {
    if (!this.placement) {
      throw new Error("placement attribute is required for NostoSimpleCampaign")
    }

    this.toggleAttribute("loading", true)
    try {
      await this.#initializeCampaign()
    } finally {
      this.toggleAttribute("loading", false)
    }
  }

  async #initializeCampaign() {
    const api = await new Promise(nostojs)
    const rec = (await addRequest({
      placement: this.placement,
      productId: this.productId,
      variantId: this.variantId,
      responseMode: "JSON_ORIGINAL"
    })) as JSONResult

    if (!rec) {
      return
    }

    const mode = this.mode || "grid"
    const markup = await this.#renderCampaign(rec, mode)
    this.innerHTML = markup
    api.attributeProductClicksInCampaign(this, rec)
  }

  async #renderCampaign(rec: JSONResult, mode: string): Promise<string> {
    const products = (rec.products || []) as JSONProduct[]

    if (products.length === 0) {
      return ""
    }

    if (this.card) {
      return this.#renderWithDynamicCards(products, mode)
    } else {
      return this.#renderWithBasicCards(products, mode)
    }
  }

  #renderWithDynamicCards(products: JSONProduct[], mode: string): string {
    const containerClass = this.#getContainerClass(mode)
    const productCards = products
      .map((product: JSONProduct) => {
        const handle = this.#extractProductHandle(product)
        if (!handle) return ""

        return `<nosto-dynamic-card
            handle="${handle}"
            template="${this.card}"
            ${this.variantId ? `variant-id="${this.variantId}"` : ""}
          ></nosto-dynamic-card>`
      })
      .filter(card => card !== "")
      .join("")

    return `<div class="nosto-simple-campaign nosto-${mode}">
        ${containerClass ? `<div class="${containerClass}">` : ""}
          ${productCards}
        ${containerClass ? "</div>" : ""}
      </div>`
  }

  #renderWithBasicCards(products: JSONProduct[], mode: string): string {
    const containerClass = this.#getContainerClass(mode)
    const productCards = products
      .map((product: JSONProduct) => {
        return `<div class="nosto-product-card">
        <div class="nosto-product-image">
          ${product.thumb_url ? `<img src="${product.thumb_url}" alt="${product.name || ""}" />` : ""}
        </div>
        <div class="nosto-product-info">
          <h3 class="nosto-product-title">${product.name || ""}</h3>
          <div class="nosto-product-price">${product.price_text || ""}</div>
        </div>
      </div>`
      })
      .join("")

    return `<div class="nosto-simple-campaign nosto-${mode}">${containerClass ? `<div class="${containerClass}">` : ""}${productCards}${containerClass ? "</div>" : ""}</div>`
  }

  #getContainerClass(mode: string): string {
    switch (mode) {
      case "carousel":
        return "nosto-carousel-container"
      case "bundle":
        return "nosto-bundle-container"
      case "grid":
      default:
        return "nosto-grid-container"
    }
  }

  #extractProductHandle(product: JSONProduct): string | null {
    // Try to extract Shopify product handle from various possible fields
    if (product.url) {
      // Extract handle from URL like "/products/product-handle", ignoring query params and hash
      const match = product.url.match(/\/products\/([^/?#]+)/)
      if (match) return match[1]
    }

    // Fallback to handle or product_id if available
    return product.handle || product.product_id || null
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-campaign": NostoSimpleCampaign
  }
}
