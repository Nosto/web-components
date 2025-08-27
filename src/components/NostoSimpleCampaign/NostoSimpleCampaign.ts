import { customElement } from "../decorators"
import { nostojs } from "@nosto/nosto-js"
import { JSONResult, JSONProduct } from "@nosto/nosto-js/client"
import { NostoElement } from "../NostoElement"
import { addRequest } from "../NostoCampaign/orchestrator"

async function renderCampaign(rec: JSONResult, mode: string, card?: string, variantId?: string): Promise<string> {
  const products = (rec.products || []) as JSONProduct[]

  if (products.length === 0) {
    return ""
  }

  if (card) {
    return renderWithDynamicCards(products, mode, card, variantId)
  } else {
    return renderWithBasicCards(products, mode)
  }
}

function renderWithDynamicCards(products: JSONProduct[], mode: string, card: string, variantId?: string): string {
  const containerClass = getContainerClass(mode)
  const productCards = products
    .map((product: JSONProduct) => {
      const handle = extractProductHandle(product)
      if (!handle) return ""

      return `<nosto-dynamic-card
          handle="${handle}"
          template="${card}"
          ${variantId ? `variant-id="${variantId}"` : ""}
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

function renderWithBasicCards(products: JSONProduct[], mode: string): string {
  const containerClass = getContainerClass(mode)
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

function getContainerClass(mode: string): string {
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

function extractProductHandle(product: JSONProduct): string | null {
  // Use the handle field if available
  if (product.handle) {
    return product.handle
  }

  // Fallback to extracting from URL
  if (product.url) {
    const match = product.url.match(/\/products\/([^/?#]+)/)
    if (match) return match[1]
  }

  return null
}

/**
 * A Shopify-specific custom element that renders a Nosto campaign with different display modes.
 * This component fetches campaign data from Nosto and renders it in grid, carousel, or bundle layout.
 * It can optionally delegate product card rendering to Shopify via NostoDynamicCard.
 *
 * @property {string} placement - The placement identifier for the campaign. Required.
 * @property {string} [mode] - The rendering mode: 'grid', 'carousel', or 'bundle'. Defaults to 'grid'.
 * @property {string} [card] - If provided, delegates card rendering to Shopify via NostoDynamicCard.
 * @property {string} [productId] - Product context for the campaign.
 * @property {string} [variantId] - Variant context for the campaign.
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
    const markup = await renderCampaign(rec, mode, this.card, this.variantId)
    this.innerHTML = markup
    api.attributeProductClicksInCampaign(this, rec)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-campaign": NostoSimpleCampaign
  }
}
