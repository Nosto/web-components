import { customElement } from "../decorators"
import { JSONResult } from "@nosto/nosto-js/client"
import { NostoBaseCampaign } from "../NostoBaseCampaign/NostoBaseCampaign"

/**
 * Grid layout campaign component.
 */
@customElement("nosto-grid-campaign")
export class NostoGridCampaign extends NostoBaseCampaign {
  protected async render(campaign: JSONResult) {
    const container = document.createElement("div")
    container.className = "nosto-grid"

    const productElements = campaign.products.map(product => this.createProductElement(product))
    container.append(...productElements)

    this.replaceChildren(container)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-grid-campaign": NostoGridCampaign
  }
}
