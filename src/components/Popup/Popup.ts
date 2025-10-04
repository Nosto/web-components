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
 *   <h2>Special Offer!</h2>
 *   <p>Get 20% off your order today</p>
 *   <button n-close>Close</button>
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

    // Initialize shadow DOM content once
    if (!this.shadowRoot?.innerHTML) {
      this.shadowRoot!.innerHTML = `
        <style>${popupStyles}</style>
        <dialog open part="dialog">
          <slot name="default"></slot>
        </dialog>
        <div class="ribbon hidden" part="ribbon">
          <slot name="ribbon"></slot>
        </div>
      `
    }

    const state = await getPopupState(this.name, this.segment)
    if (state === "closed") {
      this.style.display = "none"
      return
    }

    const mode = state === "ribbon" ? "ribbon" : "open"
    updateShadowContent(this, mode)
    this.addEventListener("click", this.handleClick)
  }

  private handleClick = (event: Event) => {
    const target = event.target as HTMLElement
    const closeElement = target?.closest("[n-close]")
    const ribbonElement = target?.closest("[n-ribbon]")

    if (closeElement) {
      event.preventDefault()
      event.stopPropagation()
      closePopup(this)
    } else if (ribbonElement) {
      event.preventDefault()
      event.stopPropagation()
      setPopupState(this.name, "ribbon")
      updateShadowContent(this, "ribbon")
    }
  }
}

function updateShadowContent(element: Popup, mode: "open" | "ribbon" = "open") {
  if (!element.shadowRoot) return

  const dialog = element.shadowRoot.querySelector("dialog")
  const ribbon = element.shadowRoot.querySelector('[part="ribbon"]')

  if (dialog && ribbon) {
    if (mode === "ribbon") {
      dialog.classList.add("hidden")
      ribbon.classList.remove("hidden")
    } else {
      dialog.classList.remove("hidden")
      ribbon.classList.add("hidden")
    }
  }
}

function closePopup(element: Popup) {
  if (element.name) {
    setPopupState(element.name, "closed")
  }
  element.style.display = "none"
}

async function getPopupState(name: string, segment?: string): Promise<"open" | "ribbon" | "closed"> {
  // Check segment precondition first - if it fails, return closed
  if (segment && !(await checkSegment(segment))) {
    return "closed"
  }

  // Check localStorage state
  const key = `nosto:web-components:popup:${name}`
  const state = localStorage.getItem(key)
  if (state === "closed" || state === "ribbon") {
    return state
  }
  return "open"
}

function setPopupState(name: string, state: "open" | "ribbon" | "closed") {
  const key = `nosto:web-components:popup:${name}`
  if (state === "open") {
    localStorage.removeItem(key)
  } else {
    localStorage.setItem(key, state)
  }
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
