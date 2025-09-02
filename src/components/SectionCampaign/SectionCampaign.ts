import { nostojs } from "@nosto/nosto-js"
import { getText, postJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import { addRequest } from "../Campaign/orchestrator"
import { JSONResult } from "@nosto/nosto-js/client"

/**
 * NostoSectionCampaign is a custom element that fetches Nosto placement results and renders the results
 * using a Shopify section template via the Section Rendering API.
 *
 * default mode:
 * Section is fetched via /search endpoint with product handles as query param
 *
 * bundled mode:
 * Section is fetched via /cart/update.js endpoint with section name in payload
 * and campaign metadata is persisted in cart attributes
 *
 * @property {string} placement - The placement identifier for the campaign.
 * @property {string} section - The section to be used for Section Rendering API based rendering.
 * @property {string} handles - (internal) colon-separated list of product handles currently rendered
 * @property {string} mode - (internal) rendering mode, supported values: "section" (default), "bundled"
 */
@customElement("nosto-section-campaign")
export class SectionCampaign extends NostoElement {
  /** @private */
  static attributes = {
    placement: String,
    section: String,
    handles: String,
    mode: String
  }

  placement!: string
  section!: string
  handles!: string
  mode?: "section" | "bundled"

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
    const bundled = this.mode === "bundled"
    if (!bundled || this.handles !== handles) {
      const markup = await (bundled ? getBundledMarkup : getSectionMarkup)(this, handles, rec)
      if (markup) {
        this.innerHTML = markup
      }
    }
    api.attributeProductClicksInCampaign(this, rec)
  }
}

async function getBundledMarkup(element: SectionCampaign, handles: string, rec: JSONResult) {
  const target = new URL("/cart/update.js", window.location.href)
  const payload = {
    attributes: {
      [`nosto_${element.placement}_title`]: rec.title || "",
      [`nosto_${element.placement}_handles`]: handles
    },
    sections: element.section
  }
  const reponse = await postJSON<{ sections: Record<string, string> }>(target.href, payload)
  const sectionHtml = reponse.sections[element.section] || ""
  if (sectionHtml) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(sectionHtml, "text/html")
    return doc.querySelector(`nosto-bundled-campaign[placement="${element.placement}"]`)?.innerHTML || ""
  }
  return undefined
}

async function getSectionMarkup(element: SectionCampaign, handles: string, rec: JSONResult) {
  const target = new URL("/search", window.location.href)
  target.searchParams.set("section_id", element.section)
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
    "nosto-section-campaign": SectionCampaign
  }
}
