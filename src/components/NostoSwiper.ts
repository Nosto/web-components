import { customElement } from "./decorators"
import type { SwiperOptions } from "swiper/types"

const swiperBase = "https://cdn.jsdelivr.net/npm/swiper@latest"
const swiperJs = `${swiperBase}/swiper.mjs`

@customElement("nosto-swiper")
export class NostoSwiper extends HTMLElement {
  static attributes = {
    containerSelector: String,
  }

  containerSelector!: string

  constructor() {
    super()
  }

  connectedCallback() {
    const config = this.getConfigFromScript() 
    this.loadSwiper(config)
  }

  private getConfigFromScript(): SwiperOptions {
    const config = this.querySelector("[swiper-config]")
    return config ? JSON.parse(config.textContent!) : {}
  }

  async loadSwiper(config: SwiperOptions) {
    const Swiper = window.Swiper ?? (await import(swiperJs)).default
    if (typeof Swiper === "undefined") {
      console.error("Swiper library is not loaded.")
      return
    }

    if (config.modules) {
      config.modules = await Promise.all(
        config.modules.map(
          module => import(`${swiperBase}/modules/${module}.mjs`).then(mod => mod.default)
        )
      )
    }

    const swiperContainer = this.querySelector(this.containerSelector || ".swiper")

    if (!swiperContainer) {
      console.error("Swiper container not found.")
    }

    new Swiper(swiperContainer, config)
  }
}
