import { nostojs } from "@nosto/nosto-js"
import { customElement } from "lit/decorators.js"
import { LitElement } from "lit"
import { logFirstUsage } from "@/logger"

/**
 * A custom element that provides conditional content rendering based on user segments.
 * This component replaces its children with the content of the first template
 * that matches any of the current user's Nosto segments.
 *
 * {@include ./examples.md}
 *
 * @category Store level templating
 */
@customElement("nosto-control")
export class Control extends LitElement {
  constructor() {
    super()
    logFirstUsage()
  }

  async connectedCallback() {
    super.connectedCallback()
    const api = await new Promise(nostojs)
    const segments = await api.internal.getSegments()
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

declare global {
  interface HTMLElementTagNameMap {
    "nosto-control": Control
  }
}
