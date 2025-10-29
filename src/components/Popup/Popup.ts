/* eslint-disable @typescript-eslint/no-explicit-any */
import { html, define } from "hybrids"
import { nostojs } from "@nosto/nosto-js"
import styles from "./styles.css?raw"
import { assertRequired } from "@/utils/assertRequired"
import { shadowContentFactory } from "@/utils/shadowContentFactory"
import { logFirstUsage } from "@/logger"

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
const Popup = {
  tag: "nosto-popup",
  name: "",
  segment: "",

  render: () => html`<slot></slot>`,

  connect: (host: any) => {
    logFirstUsage()

    // Create shadow DOM
    if (!host.shadowRoot) {
      host.attachShadow({ mode: "open" })
    }

    const handleEvent = (event: Event) => {
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
        closePopup(host)
      } else if (toOpen) {
        updateShadowContent(host, "open")
      } else if (toRibbon) {
        setPopupState(host.name, "ribbon")
        updateShadowContent(host, "ribbon")
      }
    }

    const init = async () => {
      assertRequired(host, "name")
      const state = await getPopupState(host.name, host.segment)
      if (state === "closed") {
        host.style.display = "none"
        return
      }
      if (!host.shadowRoot?.innerHTML) {
        initializeShadowContent(host, state)
      }
      host.addEventListener("click", handleEvent)
      setPopupState(host.name, "ribbon")
    }

    init().catch(console.error)

    return () => {
      host.removeEventListener("click", handleEvent)
    }
  }
}

const key = "nosto:web-components:popup"

type PopupState = "open" | "ribbon" | "closed"

type PopupData = {
  name: string
  state: PopupState
}

function initializeShadowContent(element: any, mode: "open" | "ribbon" = "open") {
  setShadowContent(
    element,
    `
    <dialog part="dialog">
      <slot name="default"></slot>
    </dialog>
    <div class="ribbon ${mode === "open" ? "hidden" : ""}" part="ribbon">
      <slot name="ribbon">Open</slot>
    </div>`
  )
  if (mode === "open") {
    element.shadowRoot?.querySelector("dialog")?.showModal()
  }
}

function updateShadowContent(element: any, mode: "open" | "ribbon" = "open") {
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

function closePopup(element: any) {
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

// Define the hybrid component
define(Popup)

declare global {
  interface HTMLElementTagNameMap {
    "nosto-popup": HTMLElement & {
      name: string
      segment?: string
    }
  }
}

export { Popup }
