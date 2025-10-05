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
    const state = await getPopupState(this.name, this.segment)
    if (state === "closed") {
      this.style.display = "none"
      return
    }
    if (!this.shadowRoot?.innerHTML) {
      initializeShadowContent(this, state)
    }
    this.addEventListener("click", this.handleClick.bind(this))
    setPopupState(this.name, "ribbon")
  }

  private handleClick(event: Event) {
    const target = event.target as HTMLElement
    const toOpen = target?.matches(".ribbon") || target?.closest(".ribbon")
    const toClose = target?.matches("[n-close]") || target?.closest("[n-close]")
    const toRibbon = target?.matches("[n-ribbon]") || target?.closest("[n-ribbon]")

    if (toOpen || toClose || toRibbon) {
      event.preventDefault()
      event.stopPropagation()
    }
    if (toOpen) {
      updateShadowContent(this, "open")
    } else if (toClose) {
      closePopup(this)
    } else if (toRibbon) {
      setPopupState(this.name, "ribbon")
      updateShadowContent(this, "ribbon")
    }
  }
}

function initializeShadowContent(element: Popup, mode: "open" | "ribbon" = "open") {
  element.shadowRoot!.innerHTML = `
    <style>${popupStyles}</style>
    <dialog ${mode === "open" ? "open" : ""} part="dialog" ${mode === "ribbon" ? 'class="hidden"' : ""}>
      <slot name="default"></slot>
    </dialog>
    <div class="ribbon ${mode === "open" ? "hidden" : ""}" part="ribbon">
      <slot name="ribbon"></slot>
    </div>
  `
}

function updateShadowContent(element: Popup, mode: "open" | "ribbon" = "open") {
  const dialog = element.shadowRoot?.querySelector("dialog")
  const ribbon = element.shadowRoot?.querySelector(".ribbon")
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
  setPopupState(element.name, "closed")
  element.style.display = "none"
}

async function getPopupState(name: string, segment?: string): Promise<"open" | "ribbon" | "closed"> {
  if (segment && !(await checkSegment(segment))) {
    return "closed"
  }
  const key = getKey(name)
  const state = localStorage.getItem(key)
  if (state === "closed" || state === "ribbon") {
    return state
  }
  return "open"
}

function setPopupState(name: string, state: "open" | "ribbon" | "closed") {
  const key = getKey(name)
  if (state === "open") {
    localStorage.removeItem(key)
  } else {
    localStorage.setItem(key, state)
  }
}

function getKey(name: string) {
  return `nosto:web-components:popup:${name}`
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
