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
        await this.render(rec)
        api.attributeProductClicksInCampaign(this, rec)
      }
    } finally {
      this.toggleAttribute("loading", false)
    }
  }

  protected abstract render(campaign: JSONResult): Promise<void>

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
