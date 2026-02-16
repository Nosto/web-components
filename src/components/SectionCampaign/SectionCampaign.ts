import { nostojs } from "@nosto/nosto-js"
import { getText } from "@/utils/fetch"
import { getShopifyUrl } from "@/shopify/getShopifyUrl"
import { customElement, property } from "../decorators"
import { NostoElement } from "../Element"
import { addRequest } from "../Campaign/orchestrator"
import { JSONResult } from "@nosto/nosto-js/client"

/**
 * A custom element that fetches Nosto placement results and renders them using Shopify section templates.
 * This component integrates with Shopify's Section Rendering API to dynamically render campaign content.
 *
 * {@include ./examples.md}
 *
 * @category Store level templating
 *
 * @property {string} placement - The placement identifier for the campaign.
 * @property {string} section - The section to be used for Section Rendering API based rendering.
 * @property {string} mode - (Optional) Query mode: "handle" (default) uses product handles, "id" uses product IDs with OR operator.
 */
@customElement("nosto-section-campaign")
export class SectionCampaign extends NostoElement {
  @property(String) placement!: string
  @property(String) section!: string
  @property(String) mode?: "handle" | "id"

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
    const markup = await this.#getSectionMarkup(rec)
    this.innerHTML = markup
    api.attributeProductClicksInCampaign(this, rec)
  }

  async #getSectionMarkup(rec: JSONResult) {
    const target = getShopifyUrl("/search")
    target.searchParams.set("section_id", this.section)

    // Format q parameter based on mode
    if (this.mode === "id") {
      const idQuery = rec.products.map(product => `id:${product.product_id}`).join(" OR ")
      target.searchParams.set("q", idQuery)
    } else {
      // Default mode: use handles separated by colon
      const handles = rec.products.map(product => product.handle).join(":")
      target.searchParams.set("q", handles)
    }

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
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-section-campaign": SectionCampaign
  }
}
