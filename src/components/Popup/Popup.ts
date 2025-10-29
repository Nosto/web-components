import { nostojs } from "@nosto/nosto-js"
import { customElement, property } from "../decorators"
import { NostoElement } from "../Element"
import styles from "./styles.css?raw"
import { assertRequired } from "@/utils/assertRequired"
import { shadowContentFactory } from "@/utils/shadowContentFactory"

const setShadowContent = shadowContentFactory(styles)

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
export class Popup extends NostoElement {
  @property(String) name!: string
  @property(String) segment?: string

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
      this.initializeShadowContent(state)
    }
    this.addEventListener("click", this)
    setPopupState(this.name, "ribbon")
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
      this.closePopup()
    } else if (toOpen) {
      this.updateShadowContent("open")
    } else if (toRibbon) {
      setPopupState(this.name, "ribbon")
      this.updateShadowContent("ribbon")
    }
  }

  private initializeShadowContent(mode: "open" | "ribbon" = "open") {
    setShadowContent(
      this,
      `
      <dialog part="dialog">
        <slot name="default"></slot>
      </dialog>
      <div class="ribbon ${mode === "open" ? "hidden" : ""}" part="ribbon">
        <slot name="ribbon">Open</slot>
      </div>`
    )
    if (mode === "open") {
      this.shadowRoot?.querySelector("dialog")?.showModal()
    }
  }

  private updateShadowContent(mode: "open" | "ribbon" = "open") {
    const dialog = this.shadowRoot?.querySelector<HTMLDialogElement>("dialog")
    const ribbon = this.shadowRoot?.querySelector(".ribbon")
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

  private closePopup() {
    setPopupState(this.name, "closed")
    this.style.display = "none"
  }
}

const key = "nosto:web-components:popup"

type PopupState = "open" | "ribbon" | "closed"

type PopupData = {
  name: string
  state: PopupState
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
