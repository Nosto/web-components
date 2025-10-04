import { nostojs } from "@nosto/nosto-js"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import { popupStyles } from "./styles"

function renderShadowContent(element: Popup) {
  if (!element.shadowRoot) return
  element.shadowRoot.innerHTML = `
    <style>${popupStyles}</style>
    <dialog open>
      <slot name="default"></slot>
    </dialog>
    <div class="ribbon">
      <slot name="ribbon"></slot>
    </div>
  `
}

function closePopup(element: Popup) {
  if (element.name) {
    setPopupClosed(element.name)
  }
  element.style.display = "none"
}

function isPopupClosed(name: string): boolean {
  const key = `nosto:web-components:popup:${name}`
  return localStorage.getItem(key) === "true"
}

function setPopupClosed(name: string) {
  const key = `nosto:web-components:popup:${name}`
  localStorage.setItem(key, "true")
}

async function checkSegment(segment: string): Promise<boolean> {
  try {
    const api = await new Promise(nostojs)
    const segments = await api.internal.getSegments()
    return segments?.includes(segment) || false
  } catch {
    return false
  }
}

/**
 * A custom element that displays popup content with dialog and ribbon slots.
 * Supports conditional activation based on Nosto segments and persistent closure state.
 *
 * @example
 * Basic popup with dialog and ribbon content:
 * ```html
 * <nosto-popup name="promo-popup" segment="5b71f1500000000000000006">
 *   <div slot="default">
 *     <h2>Special Offer!</h2>
 *     <p>Get 20% off your order today</p>
 *     <button n-close>Close</button>
 *   </div>
 *   <div slot="ribbon">
 *     <span>Limited time!</span>

 *   </div>
 * </nosto-popup>
 * ```
 */
@customElement("nosto-popup")
export class Popup extends NostoElement {
  /** @private */
  static attributes = {
    name: String,
    segment: String
  }

  name?: string
  segment?: string

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  async connectedCallback() {
    // Check if popup was permanently closed
    if (this.name && isPopupClosed(this.name)) {
      this.style.display = "none"
      return
    }

    // Check segment precondition if specified
    if (this.segment && !(await checkSegment(this.segment))) {
      this.style.display = "none"
      return
    }

    renderShadowContent(this)
    this.addEventListener("click", this.handleClick)
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick)
  }

  private handleClick = (event: Event) => {
    const target = event.target as HTMLElement
    if (target?.hasAttribute("n-close")) {
      event.preventDefault()
      event.stopPropagation()
      closePopup(this)
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-popup": Popup
  }
}
