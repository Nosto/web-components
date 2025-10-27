import { logFirstUsage } from "@/logger"

export abstract class NostoElement extends HTMLElement {
  constructor() {
    super()
    logFirstUsage()
  }
}

export abstract class ReactiveElement extends NostoElement {
  async attributeChangedCallback(_: string, oldValue: string | null, newValue: string | null) {
    if (this.isConnected && oldValue !== newValue) {
      await this.render()
    }
  }

  async connectedCallback() {
    await this.render()
  }

  abstract render(): Promise<void> | void
}
