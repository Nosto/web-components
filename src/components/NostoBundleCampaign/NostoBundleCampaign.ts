import { customElement } from "../decorators"
import { JSONResult } from "@nosto/nosto-js/client"
import { NostoBaseCampaign } from "../NostoBaseCampaign/NostoBaseCampaign"

/**
 * Bundle layout campaign component.
 */
@customElement("nosto-bundle-campaign")
export class NostoBundleCampaign extends NostoBaseCampaign {
  protected async render(campaign: JSONResult) {
    const container = document.createElement("div")
    container.className = "nosto-bundle"

    const productElements = campaign.products.map(product => this.createProductElement(product))
    container.append(...productElements)

    this.replaceChildren(container)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-bundle-campaign": NostoBundleCampaign
  }
}
