import { nostojs } from "@nosto/nosto-js"
import { getText } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import { addRequest } from "../Campaign/orchestrator"
import { JSONResult } from "@nosto/nosto-js/client"

/**
 * NostoBundledCampaign is a custom element that fetches Nosto placement results and renders the results
 * using a Shopify bundled section template via the Cart Update API.
 *
 * @property {string} placement - The placement identifier for the campaign.
 * @property {string} handles - The product handles to compare against fetched results.
 */
@customElement("nosto-bundled-campaign")
export class BundledCampaign extends NostoElement {
  /** @private */
  static attributes = {
    placement: String,
    handles: String
  }

  placement!: string
  handles!: string

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
    const markup = await getBundledSectionMarkup(this, rec)
    this.innerHTML = markup
    api.attributeProductClicksInCampaign(this, rec)
  }
}

async function getBundledSectionMarkup(element: BundledCampaign, rec: JSONResult) {
  const handles = rec.products.map(product => product.handle).join(":")

  // Only fetch new content if handles don't match the existing handles
  if (handles === element.handles) {
    return ""
  }

  const target = new URL("/cart/update", window.location.href)
  target.searchParams.set("nosto_bundled_campaign", `nosto-bundled-campaign[placement="${element.placement}"]`)
  target.searchParams.set("q", handles)

  const sectionHtml = await getText(target.href)
  const parser = new DOMParser()
  const doc = parser.parseFromString(sectionHtml, "text/html")

  if (rec.title) {
    const headingEl = doc.querySelector("[nosto-title]")
    if (headingEl) {
      headingEl.textContent = rec.title
    }
  }

  return doc.body.firstElementChild?.innerHTML?.trim() || sectionHtml
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-bundled-campaign": BundledCampaign
  }
}
