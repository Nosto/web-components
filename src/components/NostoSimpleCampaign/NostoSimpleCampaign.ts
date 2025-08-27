import { customElement } from "../decorators"
import { nostojs } from "@nosto/nosto-js"
import { JSONResult, JSONProduct } from "@nosto/nosto-js/client"
import { NostoElement } from "../NostoElement"
import { addRequest } from "../NostoCampaign/orchestrator"

/**
 * Base class for Nosto campaign components with shared functionality for campaign loading and product rendering.
 */
export abstract class NostoBaseCampaign extends NostoElement {
  /** @private */
  static attributes = {
    placement: String,
    card: String
  }

  placement!: string
  card?: string

  async connectedCallback() {
    if (!this.placement) {
      throw new Error("placement attribute is required")
    }
    await this.loadCampaign()
  }

  private async loadCampaign() {
    this.toggleAttribute("loading", true)

    try {
      const api = await new Promise(nostojs)
      const rec = (await addRequest({
        placement: this.placement,
        responseMode: "JSON_ORIGINAL"
      })) as JSONResult

      if (rec?.products?.length > 0) {
        await this.renderCampaign(rec)
        api.attributeProductClicksInCampaign(this, rec)
      }
    } finally {
      this.toggleAttribute("loading", false)
    }
  }

  protected abstract renderCampaign(campaign: JSONResult): Promise<void>

  protected createProductElement(product: Partial<JSONProduct>) {
    if (this.card && product.handle) {
      const dynamicCard = document.createElement("nosto-dynamic-card")
      dynamicCard.setAttribute("handle", product.handle)
      dynamicCard.setAttribute("template", this.card)
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
}

/**
 * Grid layout campaign component.
 */
@customElement("nosto-grid-campaign")
export class NostoGridCampaign extends NostoBaseCampaign {
  protected async renderCampaign(campaign: JSONResult) {
    const container = document.createElement("div")
    container.className = "nosto-grid"

    const productElements = campaign.products.map(product => this.createProductElement(product))
    container.append(...productElements)

    this.replaceChildren(container)
  }
}

/**
 * Carousel layout campaign component with Swiper structure.
 */
@customElement("nosto-carousel-campaign")
export class NostoCarouselCampaign extends NostoBaseCampaign {
  protected async renderCampaign(campaign: JSONResult) {
    const container = document.createElement("swiper-container")
    container.className = "nosto-carousel"

    const productSlides = campaign.products.map(product => {
      const slide = document.createElement("swiper-slide")
      slide.appendChild(this.createProductElement(product))
      return slide
    })
    container.append(...productSlides)

    this.replaceChildren(container)
  }
}

/**
 * Bundle layout campaign component.
 */
@customElement("nosto-bundle-campaign")
export class NostoBundleCampaign extends NostoBaseCampaign {
  protected async renderCampaign(campaign: JSONResult) {
    const container = document.createElement("div")
    container.className = "nosto-bundle"

    const productElements = campaign.products.map(product => this.createProductElement(product))
    container.append(...productElements)

    this.replaceChildren(container)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-grid-campaign": NostoGridCampaign
    "nosto-carousel-campaign": NostoCarouselCampaign
    "nosto-bundle-campaign": NostoBundleCampaign
  }
}
