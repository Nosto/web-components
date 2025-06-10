import { assertRequired } from "@/utils"
import { customElement } from "../decorators"
import { loadCampaign } from "./loadCampaign"

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
    await loadCampaign(this)
  }
}
