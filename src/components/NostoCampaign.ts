import { customElement } from "./decorators"
import { nostojs } from "@nosto/nosto-js"

@customElement("nosto-campaign")
export class NostoCampaign extends HTMLElement {
  static attributes = {
    placement: String,
    product: String,
    variant: String
  }

  placement?: string
  product?: string
  variant?: string

  async connectedCallback() {
    if (!this.placement) {
      console.error('<nosto-campaign> requires a "placement" or "div-id" attribute.')
      return
    }

    await this.loadCampaign()
  }

  async loadCampaign() {
    const api = await new Promise(nostojs)
    const request = api
      .createRecommendationRequest({ includeTagging: true })
      .disableCampaignInjection()
      .setElements([this.placement!])
      .setResponseMode("HTML")

    if (this.product) {
      request.setProducts([
        {
          product_id: this.product,
          ...(this.variant ? { sku_id: this.variant } : {})
        }
      ])
    }

    const result = await request.load()
    const html = result.recommendations[this.placement!]

    if (html && typeof html === "string") {
      this.innerHTML = html
    } else {
      console.warn(`No recommendation result for div ID: ${this.placement}`)
    }
  }
}
