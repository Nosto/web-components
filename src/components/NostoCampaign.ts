import { assertRequired } from "@/utils"
import { customElement } from "./decorators"
import { nostojs } from "@nosto/nosto-js"

@customElement("nosto-campaign")
export class NostoCampaign extends HTMLElement {
  static attributes = {
    placement: String,
    product: String,
    variant: String
  }

  placement!: string
  product!: string
  variant?: string

  async connectedCallback() {
    assertRequired(this, "placement")
    this.classList.add("nosto_element")
    this.id = this.placement!
    await this.loadCampaign()
  }

  async loadCampaign() {
    const api = await new Promise(nostojs)
    const request = api
      .createRecommendationRequest({ includeTagging: true })
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

    await request.load()
  }
}
