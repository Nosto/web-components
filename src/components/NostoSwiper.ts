import { customElement } from "./decorators"
import type { SwiperOptions } from "swiper/types"
import _Swiper from "swiper"

const swiperURLBase = "https://cdn.jsdelivr.net/npm/swiper@latest"

// Swiper core excludes modules by default
const swiperJs = `${swiperURLBase}/swiper.mjs`

@customElement("nosto-swiper")
export class NostoSwiper extends HTMLElement {
  static attributes = {
    containerSelector: String
  }

  containerSelector!: string

  constructor() {
    super()
  }

  async connectedCallback() {
    const config = this.getConfigFromScript()
    return this.initSwiper(config)
  }

  private getConfigFromScript(): SwiperOptions {
    const config = this.querySelector("script[swiper-config]")
    return config ? JSON.parse(config.textContent!) : {}
  }

  async initSwiper(config: SwiperOptions) {
    // Load Swiper from store context or fallback to CDN
    const Swiper = _Swiper ?? (await import(swiperJs)).default

    if (typeof Swiper === "undefined") {
      throw new Error("Swiper library is not loaded.")
    }

    // Load Swiper modules present in the config
    if (config.modules) {
      config.modules = await Promise.all(
        config.modules.map(module => import(`${swiperURLBase}/modules/${module}.mjs`).then(mod => mod.default))
      )
    }

    const swiperContainer = this.querySelector<HTMLElement>(this.containerSelector || ".swiper")

    if (!swiperContainer) {
      throw new Error("Swiper container not found.")
    }

    return new Swiper(swiperContainer!, config)
  }
}
