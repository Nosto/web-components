import { customElement } from "./decorators"
import type { SwiperOptions } from "swiper/types"

// Swiper core excludes modules by default
const swiperJs = "https://cdn.jsdelivr.net/npm/swiper@latest/swiper.mjs"

type Swiper = typeof import("swiper").default

@customElement("nosto-swiper")
export class NostoSwiper extends HTMLElement {
  static attributes = {
    containerSelector: String
  }

  containerSelector!: string

  constructor() {
    super()
  }

  connectedCallback() {
    const config = this.getConfigFromScript()
    return this.loadSwiper(config)
  }

  private getConfigFromScript(): SwiperOptions {
    const config = this.querySelector("[swiper-config]")
    return config ? JSON.parse(config.textContent!) : {}
  }

  async loadSwiper(config: SwiperOptions) {
    // Load Swiper from store context or fallback to CDN
    const Swiper: Swiper = window.Swiper ?? (await import(swiperJs)).default
    if (typeof Swiper === "undefined") {
      throw "Swiper library is not loaded."
    }

    const swiperContainer = this.querySelector<HTMLElement>(this.containerSelector || ".swiper")

    if (!swiperContainer) {
      throw "Swiper container not found."
    }

    new Swiper(swiperContainer!, config)
  }
}
