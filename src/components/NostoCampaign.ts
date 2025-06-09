import { customElement } from "./decorators"
import { nostojs } from "@nosto/nosto-js"

@customElement("nosto-campaign")
export class NostoCampaign extends HTMLElement {
  static attributes = {
    placement: String,
    "div-id": String,
    product: String,
    variant: String
  }

  placement?: string
  product?: string
  variant?: string

  constructor() {
    super()
  }

  connectedCallback() {
    this.placement = this.getAttribute("placement") || this.getAttribute("div-id") || undefined
    this.product = this.getAttribute("product") ?? undefined
    this.variant = this.getAttribute("variant") ?? undefined

    if (!this.placement) {
      console.error('<nosto-campaign> requires a "placement" or "div-id" attribute.')
      return
    }

    this.loadCampaign()
  }

  async loadCampaign() {
    try {
      const api = await new Promise(nostojs)
      const request = api
        .createRecommendationRequest({ includeTagging: true })
        .disableCampaignInjection()
        .setElements([this.placement!])
        .setResponseMode("HTML")

      if (this.product) {
        const product = { product_id: this.product }
        request.setProducts([product])
      }

      if (this.variant) {
        request.addCurrentVariation(this.variant)
      }

      const result = await request.load()
      const html = result.recommendations[this.placement!]

      if (html && typeof html === "string") {
        this.innerHTML = html
      } else {
        console.warn(`No recommendation result for div ID: ${this.placement}`)
      }
    } catch (error) {
      console.error("Failed to load campaign", error)
    }
  }
}
