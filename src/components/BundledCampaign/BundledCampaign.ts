import { nostojs } from "@nosto/nosto-js"
import { postJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import { addRequest } from "../Campaign/orchestrator"
import { JSONResult } from "@nosto/nosto-js/client"

/**
 * BundledCampaign is a custom element that fetches Nosto placement results and renders the results
 * using a Shopify bundled section template via the Cart Update API.
 *
 * @property {string} placement - The placement identifier for the campaign.
 * @property {string} handles - The product handles to compare against fetched results.
 * @property {string} section - The Shopify section to render via the Cart Update API.
 */
@customElement("nosto-bundled-campaign")
export class BundledCampaign extends NostoElement {
  /** @private */
  static attributes = {
    placement: String,
    handles: String,
    section: String
  }

  placement!: string
  handles!: string
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

    const handles = rec.products.map(product => product.handle).join(":")

    // Only fetch new content if handles don't match the existing handles
    if (handles !== this.handles) {
      const markup = await getBundledSectionMarkup(this, rec, handles)
      this.innerHTML = markup
    }

    api.attributeProductClicksInCampaign(this, rec)
  }
}

async function getBundledSectionMarkup(element: BundledCampaign, rec: JSONResult, handles: string) {
  const target = new URL("/cart/update.js", window.location.href)

  const payload = {
    sections: element.section,
    attributes: {
      nosto_bundled_campaign: `nosto-bundled-campaign[placement="${element.placement}"]`,
      [`nosto_${element.placement}_handles`]: handles,
      [`nosto_${element.placement}_title`]: rec.title || ""
    }
  }

  const sectionHtml = await postJSON(target.href, payload)
  const parser = new DOMParser()
  const doc = parser.parseFromString(sectionHtml, "text/html")

  return doc.body.firstElementChild?.innerHTML?.trim() || sectionHtml
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-bundled-campaign": BundledCampaign
  }
}
