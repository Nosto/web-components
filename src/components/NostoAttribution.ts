import { customElement } from "./decorators"
import { nostojs } from "@nosto/nosto-js"

@customElement("nosto-attribution")
export class NostoAttribution extends HTMLElement {
  static attributes = {
    productId: String,
    recoId: String,
    search: String
  }

  productId!: string
  recoId!: string
  search!: "serp" | "category" | "autocomplete"

  constructor() {
    super()
  }

  connectedCallback() {
    this.validate()
    this.setAttribution()
  }

  private validate() {
    if (!this.productId) {
      throw new Error("Product ID is required.")
    }
    if (!this.recoId && !this.search) {
      throw new Error("Either recoId or search is required.")
    }
  }

  private setAttribution() {
    if (this.recoId) {
      // @ts-expect-error not yet available
      nostojs(api => api.attributeCampaignElement(this, { ref: this.recoId }))
    } else if (this.search) {
      this.addEventListener("click", () => {
        // TODO provide url as well
        nostojs(api => api.recordSearchClick(this.search, { productId: this.productId }))
      })
    }
  }
}
