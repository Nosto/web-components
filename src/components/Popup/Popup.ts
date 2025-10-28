import { nostojs } from "@nosto/nosto-js"
import { customElement, property, state } from "lit/decorators.js"
import { LitElement, css, unsafeCSS, html } from "lit"
import { logFirstUsage } from "@/logger"
import styles from "./styles.css?raw"
import { assertRequired } from "@/utils/assertRequired"

/**
 * A custom element that displays popup content with dialog and ribbon slots.
 * Supports conditional activation based on Nosto segments and persistent closure state.
 *
 * {@include ./examples.md}
 *
 * @category Store level templating
 *
 * @property {string} name - Required name used for analytics and localStorage persistence. The popup's closed state will be remembered.
 * @property {string} [segment] - Optional Nosto segment that acts as a precondition for activation. Only users in this segment will see the popup.
 */
@customElement("nosto-popup")
export class Popup extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `

  @property() name!: string
  @property() segment?: string
  @state() popupState: "open" | "ribbon" | "closed" | "loading" = "loading"

  constructor() {
    super()
    logFirstUsage()
  }

  async connectedCallback() {
    super.connectedCallback()
    assertRequired(this, "name")
    const state = await getPopupState(this.name, this.segment)
    if (state === "closed") {
      this.style.display = "none"
      return
    }
    this.popupState = state
    this.addEventListener("click", this)
    setPopupState(this.name, "ribbon")
  }

  render() {
    if (this.popupState === "loading") {
      return html``
    }

    return html`
      <dialog part="dialog" ?open=${this.popupState === "open"}>
        <slot name="default"></slot>
      </dialog>
      <div class="ribbon ${this.popupState === "open" ? "hidden" : ""}" part="ribbon">
        <slot name="ribbon">Open</slot>
      </div>
    `
  }

  protected firstUpdated() {
    if (this.popupState === "open") {
      this.shadowRoot?.querySelector("dialog")?.showModal()
    }
  }

  handleEvent(event: Event) {
    const target = event.target as HTMLElement
    const toClose = target?.matches("[n-close]") || target?.closest("[n-close]")
    const toRibbon = target?.matches("[n-ribbon]") || target?.closest("[n-ribbon]")
    const toOpen = target?.matches("[slot='ribbon']") || target?.closest("[slot='ribbon']")
    console.log("Popup clicked:", target, { toOpen, toClose, toRibbon })

    if (toOpen || toClose || toRibbon) {
      event.preventDefault()
      event.stopPropagation()
    }
    if (toClose) {
      closePopup(this)
    } else if (toOpen) {
      updateShadowContent(this, "open")
    } else if (toRibbon) {
      setPopupState(this.name, "ribbon")
      updateShadowContent(this, "ribbon")
    }
  }
}

const key = "nosto:web-components:popup"

type PopupState = "open" | "ribbon" | "closed"

type PopupData = {
  name: string
  state: PopupState
}

function updateShadowContent(element: Popup, mode: "open" | "ribbon" = "open") {
  element.popupState = mode
  const dialog = element.shadowRoot?.querySelector<HTMLDialogElement>("dialog")
  const ribbon = element.shadowRoot?.querySelector(".ribbon")
  if (dialog && ribbon) {
    if (mode === "ribbon") {
      dialog.close()
      ribbon.classList.remove("hidden")
    } else {
      dialog.showModal()
      ribbon.classList.add("hidden")
    }
  }
}

function closePopup(element: Popup) {
  setPopupState(element.name, "closed")
  element.style.display = "none"
}

async function getPopupState(name: string, segment?: string): Promise<PopupState> {
  if (segment && !(await checkSegment(segment))) {
    return "closed"
  }
  const dataStr = localStorage.getItem(key)
  if (dataStr) {
    const data = JSON.parse(dataStr) as PopupData
    if (data.name !== name) {
      return "closed"
    }
    return data.state
  }
  return "open"
}

function setPopupState(name: string, state: PopupState) {
  localStorage.setItem(key, JSON.stringify({ name, state }))
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
