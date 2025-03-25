import { customElement } from "./decorators"

const swiperJs = "https://cdn.jsdelivr.net/npm/swiper@latest/swiper-bundle.min.mjs"

@customElement("nosto-swiper")
export class NostoSwiper extends HTMLElement {
  static attributes = {
    containerSelector: String
  }

  containerSelector!: string
  config!: Record<string, unknown>

  constructor() {
    super()
  }

  connectedCallback() {
    this.config = this.getConfigFromScript()
    this.loadSwiper()
  }

  private getConfigFromScript(): Record<string, unknown> {
    const script = this.querySelector("[swiper-config]")
    if (!script) {
        return {}
    }

    try {
      return JSON.parse(script.textContent || "{}")
    } catch (error) {
      console.error("Invalid JSON in script tag.")
      return {}
    }
  }

  async loadSwiper() {
    const Swiper =
      window.Swiper ?? (await import(swiperJs)).default
    if (typeof Swiper === "undefined") {
      console.error("Swiper library is not loaded.")
      return
    }

    const swiperContainer = this.querySelector(this.containerSelector || ".swiper")

    if (!swiperContainer) {
      console.error("Swiper container not found.")
    }

    new Swiper(swiperContainer, this.config)
  }
}
