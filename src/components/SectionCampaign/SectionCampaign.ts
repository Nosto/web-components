import { nostojs } from "@nosto/nosto-js"
import { getText } from "@/utils/fetch"
import { getShopifyUrl } from "@/shopify/getShopifyUrl"
import { customElement, property } from "../decorators"
import { NostoElement } from "../Element"
import { addRequest } from "../Campaign/orchestrator"
import { JSONResult } from "@nosto/nosto-js/client"
import { isNavigationApiSupported } from "@/utils/navigationApi"

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
 * @property {string} [titleSelector] - CSS selector for the title element to inject the campaign title (attribute: "title-selector").
 * @property {boolean} [cartSynced] (`cart-synced`) - If true, the component will reload the campaign
 * whenever a cart update event occurs. Useful for keeping cart-related campaigns in sync
 * with cart changes. Defaults to false.
 * @property {boolean} [navSynced] (`nav-synced`) - If true, the component will reload the campaign
 * whenever a successful page navigation occurs via the Navigation API. Useful for keeping
 * campaigns in sync with URL changes (e.g., category-specific recommendations). Requires
 * browser support for the Navigation API. Defaults to false.
 */
@customElement("nosto-section-campaign")
export class SectionCampaign extends NostoElement {
  @property(String) placement!: string
  @property(String) section!: string
  @property(String) titleSelector?: string
  @property(Boolean) cartSynced?: boolean
  @property(Boolean) navSynced?: boolean

  #load = this.load.bind(this)

  async connectedCallback() {
    if (this.cartSynced) {
      const api = await new Promise(nostojs)
      api.listen("cartupdated", this.#load)
    }
    if (this.navSynced) {
      if (isNavigationApiSupported()) {
        navigation.addEventListener("navigatesuccess", this.#load)
      } else {
        console.warn("Navigation API is not supported in this browser. The nav-synced feature will not work.")
      }
    }

    await this.load()
  }

  async disconnectedCallback() {
    if (this.cartSynced) {
      const api = await new Promise(nostojs)
      api.unlisten("cartupdated", this.#load)
    }
    if (this.navSynced && isNavigationApiSupported()) {
      navigation.removeEventListener("navigatesuccess", this.#load)
    }
  }

  async load() {
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
    if (rec.title && targetElement && this.titleSelector) {
      const headingEl = targetElement.querySelector(this.titleSelector)
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
