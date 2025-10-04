import { nostojs } from "@nosto/nosto-js"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import { popupStyles } from "./styles"
import { assertRequired } from "@/utils/assertRequired"

/**
 * A custom element that displays popup content with dialog and ribbon slots.
 * Supports conditional activation based on Nosto segments and persistent closure state.
 *
 * @property {string} name - Required name used for analytics and localStorage persistence. The popup's closed state will be remembered.
 * @property {string} [segment] - Optional Nosto segment that acts as a precondition for activation. Only users in this segment will see the popup.
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

  name!: string
  segment?: string

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  async connectedCallback() {
    assertRequired(this, "name")

    if (!(await isPopupShown(this))) {
      this.style.display = "none"
      return
    }

    renderShadowContent(this)
    this.addEventListener("click", this.handleClick)
  }

  private handleClick = (event: Event) => {
    const target = event.target as HTMLElement
    const closeElement = target?.closest("[n-close]")
    if (closeElement) {
      event.preventDefault()
      event.stopPropagation()
      closePopup(this)
    }
  }
}

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

async function isPopupShown(element: Popup): Promise<boolean> {
  // Check if popup was permanently closed
  const state = getPopupState(element.name)
  if (state === "closed") {
    return false
  }

  // Check segment precondition if specified
  if (element.segment && !(await checkSegment(element.segment))) {
    return false
  }

  return true
}

function getPopupState(name: string): "open" | "ribbon" | "closed" {
  const key = `nosto:web-components:popup:${name}`
  const state = localStorage.getItem(key)
  if (state === "closed" || state === "ribbon") {
    return state
  }
  return "open"
}

function setPopupClosed(name: string) {
  const key = `nosto:web-components:popup:${name}`
  localStorage.setItem(key, "closed")
}

async function checkSegment(segment: string) {
  const api = await new Promise(nostojs)
  const segments = await api.internal.getSegments()
  return segments?.includes(segment) || false
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-popup": Popup
  }
}
