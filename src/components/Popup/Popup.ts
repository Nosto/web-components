import { nostojs } from "@nosto/nosto-js"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"

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
 *     <button n-close>×</button>
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
    if (this.name && this.isPopupClosed()) {
      this.style.display = "none"
      return
    }

    // Check segment precondition if specified
    if (this.segment && !(await this.checkSegment())) {
      this.style.display = "none"
      return
    }

    this.renderShadowContent()
    this.setupEventListeners()
  }

  disconnectedCallback() {
    this.removeEventListeners()
  }

  private renderShadowContent() {
    if (!this.shadowRoot) return
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1000;
          pointer-events: none;
        }

        dialog {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: none;
          border-radius: 8px;
          padding: 0;
          background: transparent;
          pointer-events: auto;
          z-index: 1001;
        }

        dialog::backdrop {
          background: rgba(0, 0, 0, 0.5);
        }

        .ribbon {
          position: fixed;
          bottom: 20px;
          right: 20px;
          pointer-events: auto;
          z-index: 1002;
        }

        .hidden {
          display: none;
        }
      </style>
      <dialog open>
        <slot name="default"></slot>
      </dialog>
      <div class="ribbon">
        <slot name="ribbon"></slot>
      </div>
    `
  }

  private setupEventListeners() {
    this.addEventListener("click", this.handleClick)
  }

  private removeEventListeners() {
    this.removeEventListener("click", this.handleClick)
  }

  private handleClick = (event: Event) => {
    const target = event.target as HTMLElement
    if (target?.hasAttribute("n-close")) {
      event.preventDefault()
      event.stopPropagation()
      this.closePopup()
    }
  }

  private closePopup() {
    if (this.name) {
      this.setPopupClosed()
    }
    this.style.display = "none"
  }

  private isPopupClosed(): boolean {
    if (!this.name) return false
    const key = `nosto:web-components:popup:${this.name}`
    return localStorage.getItem(key) === "true"
  }

  private setPopupClosed() {
    if (!this.name) return
    const key = `nosto:web-components:popup:${this.name}`
    localStorage.setItem(key, "true")
  }

  private async checkSegment(): Promise<boolean> {
    if (!this.segment) return true

    try {
      const api = await new Promise(nostojs)
      const segments = await api.internal.getSegments()
      return segments?.includes(this.segment) || false
    } catch {
      return false
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-popup": Popup
  }
}
