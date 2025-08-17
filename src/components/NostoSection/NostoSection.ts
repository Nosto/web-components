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
  // TODO init & lazy attributes can be added later if needed

  async connectedCallback() {
    this.toggleAttribute("loading", true)
    try {
      const api = await new Promise(nostojs)
      const rec = (await addRequest({
        placement: this.placement,
        responseMode: "JSON_ORIGINAL" // TODO use a responseMode that returns only the needed data
      })) as JSONResult
      if (rec) {
        const handles = rec.products.map(product => product.handle).join(":")
        const markup = await getSectionMarkup(this, handles)
        // TODO inject extra substitutions if needed (heading, etc.)
        this.innerHTML = markup
        api.attributeProductClicksInCampaign(this, rec)
      }
    } finally {
      this.toggleAttribute("loading", false)
    }
  }
}

async function getSectionMarkup(element: NostoSection, handles: string) {
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
  return doc.body.firstElementChild?.innerHTML?.trim() || sectionHtml
}
