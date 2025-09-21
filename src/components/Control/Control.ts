import { nostojs } from "@nosto/nosto-js"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"

/**
 * This component replaces its children with the content of the first template
 * that matches any of the current user's Nosto segments.
 *
 * @example
 * Conditional content based on user segments:
 * ```html
 * <nosto-control>
 *   <template segment="premium-customers">
 *     <div class="premium-offer">
 *       <h2>Exclusive Premium Offer!</h2>
 *       <p>Get 20% off your next purchase</p>
 *     </div>
 *   </template>
 *   <template segment="new-customers">
 *     <div class="welcome-offer">
 *       <h2>Welcome! Get Started</h2>
 *       <p>Use code WELCOME10 for 10% off your first order</p>
 *     </div>
 *   </template>
 *   <template segment="frequent-buyers">
 *     <div class="loyalty-message">
 *       <h2>Thank you for your loyalty!</h2>
 *       <p>Free shipping on all orders this month</p>
 *     </div>
 *   </template>
 * </nosto-control>
 * ```
 */
@customElement("nosto-control")
export class Control extends NostoElement {
  async connectedCallback() {
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
