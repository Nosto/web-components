import { nostojs } from "@nosto/nosto-js"
import { customElement } from "../decorators"
import { NostoElement } from "../NostoElement"
import { addRequest } from "../NostoCampaign/orchestrator"
import { JSONResult } from "@nosto/nosto-js/client"
import { getCampaignSectionMarkup } from "@/utils"

/**
 * NostoSectionCampaign is a custom element that fetches Nosto placement results and renders the results
 * using a Shopify section template via the Section Rendering API.
 *
 * @property {string} placement - The placement identifier for the campaign.
 * @property {string} section - The section to be used for Section Rendering API based rendering.
 */
@customElement("nosto-section-campaign")
export class NostoSectionCampaign extends NostoElement {
  /** @private */
  static attributes = {
    placement: String,
    section: String
  }

  placement!: string
  section!: string

  async connectedCallback() {
    this.toggleAttribute("loading", true)
    try {
      await this.#initializeMarkup()
    } finally {
      this.toggleAttribute("loading", false)
    }
  }

  async #initializeMarkup() {
    const api = await new Promise(nostojs)
    const rec = (await addRequest({
      placement: this.placement,
      responseMode: "JSON_ORIGINAL" // TODO use a responseMode that returns only the needed data
    })) as JSONResult
    if (!rec) {
      return
    }
    const markup = await getCampaignSectionMarkup(this, rec)
    this.innerHTML = markup
    api.attributeProductClicksInCampaign(this, rec)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-section-campaign": NostoSectionCampaign
  }
}
