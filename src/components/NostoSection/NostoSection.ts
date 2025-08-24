import { nostojs } from "@nosto/nosto-js"
import { customElement } from "../decorators"
import { NostoElement } from "../NostoElement"
import { addRequest } from "../NostoCampaign/orchestrator"
import { JSONResult } from "@nosto/nosto-js/client"

@customElement("nosto-section")
export class NostoSection extends NostoElement {
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
    const markup = await getSectionMarkup(this, rec)
    this.innerHTML = markup
    api.attributeProductClicksInCampaign(this, rec)
  }
}

async function getSectionMarkup(element: NostoSection, rec: JSONResult) {
  const handles = rec.products.map(product => product.handle).join(":")
  const target = new URL("/search", window.location.href)
  target.searchParams.set("section_id", element.section)
  target.searchParams.set("q", handles)
  const result = await fetch(target)
  if (!result.ok) {
    throw new Error(`Failed to fetch section ${element.section}`)
  }
  const sectionHtml = await result.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(sectionHtml, "text/html")
  if (rec.title) {
    const headingEl = doc.querySelector("h1, h2, h3, h4, h5, h6")
    if (headingEl) {
      headingEl.textContent = rec.title
    }
  }
  return doc.body.firstElementChild?.innerHTML?.trim() || sectionHtml
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-section": NostoSection
  }
}
