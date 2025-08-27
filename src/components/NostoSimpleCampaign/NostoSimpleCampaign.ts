import { customElement } from "../decorators"
import { nostojs } from "@nosto/nosto-js"
import { JSONResult, JSONProduct } from "@nosto/nosto-js/client"
import { NostoElement } from "../NostoElement"
import { addRequest } from "../NostoCampaign/orchestrator"

/**
 * A Shopify-specific custom element that renders Nosto campaigns with configurable display modes.
 * This component fetches campaign data from Nosto and renders it in grid, carousel, or bundle formats.
 * It can optionally delegate card rendering to Shopify via NostoDynamicCard usage.
 *
 * @property {string} placement - The placement identifier for the campaign. Required.
 * @property {string} [mode] - The rendering mode: 'grid', 'carousel', or 'bundle'. Defaults to 'grid'.
 * @property {string} [card] - Optional card template for delegating rendering to NostoDynamicCard.
 *
 * @example
 * ```html
 * <nosto-simple-campaign placement="product-recommendations" mode="grid"></nosto-simple-campaign>
 * <nosto-simple-campaign placement="cart-recommendations" mode="carousel" card="product-card"></nosto-simple-campaign>
 * ```
 */
@customElement("nosto-simple-campaign")
export class NostoSimpleCampaign extends NostoElement {
  /** @private */
  static attributes = {
    placement: String,
    mode: String,
    card: String
  }

  placement!: string
  mode?: string
  card?: string

  async connectedCallback() {
    if (!this.placement) {
      throw new Error("placement attribute is required for NostoSimpleCampaign")
    }
    await loadSimpleCampaign(this)
  }
}

/**
 * Loads and renders the campaign data for a NostoSimpleCampaign element.
 */
export async function loadSimpleCampaign(element: NostoSimpleCampaign) {
  element.toggleAttribute("loading", true)

  try {
    const api = await new Promise(nostojs)
    const rec = (await addRequest({
      placement: element.placement,
      responseMode: "JSON_ORIGINAL"
    })) as JSONResult

    if (rec?.products?.length > 0) {
      const mode = element.mode || "grid"
      await renderCampaign(element, rec, mode)
      api.attributeProductClicksInCampaign(element, rec)
    }
  } finally {
    element.toggleAttribute("loading", false)
  }
}

/**
 * Renders the campaign based on the specified mode.
 */
export async function renderCampaign(element: NostoSimpleCampaign, campaign: JSONResult, mode: string) {
  switch (mode) {
    case "carousel":
      await renderCarousel(element, campaign)
      break
    case "bundle":
      await renderBundle(element, campaign)
      break
    case "grid":
    default:
      await renderGrid(element, campaign)
      break
  }
}

/**
 * Renders the campaign in grid layout.
 */
export async function renderGrid(element: NostoSimpleCampaign, campaign: JSONResult) {
  const container = document.createElement("div")
  container.className = "nosto-grid"

  for (const product of campaign.products) {
    const productElement = createProductElement(element, product)
    container.appendChild(productElement)
  }

  element.replaceChildren(container)
}

/**
 * Renders the campaign in carousel layout.
 */
export async function renderCarousel(element: NostoSimpleCampaign, campaign: JSONResult) {
  const container = document.createElement("div")
  container.className = "nosto-carousel"

  for (const product of campaign.products) {
    const productElement = createProductElement(element, product)
    container.appendChild(productElement)
  }

  element.replaceChildren(container)
}

/**
 * Renders the campaign in bundle layout.
 */
export async function renderBundle(element: NostoSimpleCampaign, campaign: JSONResult) {
  const container = document.createElement("div")
  container.className = "nosto-bundle"

  for (const product of campaign.products) {
    const productElement = createProductElement(element, product)
    container.appendChild(productElement)
  }

  element.replaceChildren(container)
}

/**
 * Creates a product element, optionally using NostoDynamicCard if card attribute is specified.
 */
export function createProductElement(element: NostoSimpleCampaign, product: Partial<JSONProduct>) {
  if (element.card && product.handle) {
    const dynamicCard = document.createElement("nosto-dynamic-card")
    dynamicCard.setAttribute("handle", product.handle)
    dynamicCard.setAttribute("template", element.card)
    return dynamicCard
  }

  // Fallback to basic product display
  const productDiv = document.createElement("div")
  productDiv.className = "nosto-product"
  productDiv.innerHTML = `
    <div class="nosto-product-info">
      ${product.image_url ? `<img src="${product.image_url}" alt="${product.name || "Product"}" />` : ""}
      <h3>${product.name || "Unnamed Product"}</h3>
      ${product.price ? `<p class="price">${product.price}</p>` : ""}
    </div>
  `

  return productDiv
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-campaign": NostoSimpleCampaign
  }
}
