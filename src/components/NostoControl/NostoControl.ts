import { nostojs } from "@nosto/nosto-js"
import { customElement } from "../decorators"
import { NostoElement } from "../NostoElement"

/**
 * This component replaces its children with the content of the first template
 * that matches any of the current user's Nosto segments.
 */
@customElement("nosto-control", { observe: true })
export class NostoControl extends NostoElement {
  attributeChangedCallback() {
    if (this.isConnected) {
      this.connectedCallback()
    }
  }

  async connectedCallback() {
    const api = await new Promise(nostojs)
    const { segments } = await api.getSearchSessionParams()
    const template = Array.from(this.querySelectorAll<HTMLTemplateElement>(":scope > template[segment]")).find(el =>
      // TODO provide more filtering options: schedule, affinities etc
      segments?.includes(el.getAttribute("segment")!)
    )
    if (template) {
      const clone = template.content.cloneNode(true) as DocumentFragment
      this.replaceChildren(...clone.childNodes)
    }
  }
}
