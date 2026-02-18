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
 * @property {string} [titleSelector] - CSS selector for the title element to inject the campaign title (attribute: "title-selector"). Defaults to ".nosto-title".
 */
@customElement("nosto-section-campaign")
export class SectionCampaign extends NostoElement {
  @property(String) placement!: string
  @property(String) section!: string
  @property(String) titleSelector?: string

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
    const markup = await this.#getMarkup(rec)
    this.innerHTML = markup
    api.attributeProductClicksInCampaign(this, rec)
  }

  async #getMarkup(rec: JSONResult) {
    const handles = rec.products.map(product => product.handle).join(" OR ")
    const target = getShopifyUrl("/search")
    target.searchParams.set("section_id", this.section)
    target.searchParams.set("q", handles)
    const sectionHtml = await getText(target.href)
    const parser = new DOMParser()
    const doc = parser.parseFromString(sectionHtml, "text/html")
    // Check if nosto-section-campaign element exists in the section body
    const nostoSectionCampaign = doc.body.querySelector(`nosto-section-campaign[placement="${this.placement}"]`)
    const targetElement = nostoSectionCampaign || doc.body.firstElementChild
    if (rec.title && targetElement) {
      const selector = this.titleSelector || ".nosto-title"
      const headingEl = targetElement.querySelector(selector)
      if (headingEl) {
        headingEl.textContent = rec.title
      }
    }
    return targetElement?.innerHTML?.trim() || sectionHtml
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-section-campaign": SectionCampaign
  }
}
