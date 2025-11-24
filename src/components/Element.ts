import { logFirstUsage } from "@/logger"

export abstract class NostoElement extends HTMLElement {
  constructor() {
    super()
    logFirstUsage()
  }
}

/**
 * Base class for reactive web components that re-render on attribute changes.
 */
export abstract class ReactiveElement extends NostoElement {
  #scheduled: number | null = null

  attributeChangedCallback(_: string, oldValue: string | null, newValue: string | null) {
    if (this.isConnected && !this.#scheduled && oldValue !== newValue) {
      this.#scheduled = requestAnimationFrame(() => {
        this.#scheduled = null
        this.render(false)
      })
    }
  }

  abstract render(initial: boolean): unknown
}
