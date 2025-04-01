import { customElement } from "./decorators"
import type { SwiperOptions } from "swiper/types"

const swiperURLBase = "https://cdn.jsdelivr.net/npm/swiper@latest"

// Swiper core excludes modules by default
const swiperJs = `${swiperURLBase}/swiper.mjs`
const swiperCss = `${swiperURLBase}/swiper.min.css`

type Swiper = typeof import("swiper").default
type SwiperConfig = SwiperOptions & { swiperModules?: string[] }

function isCssLoaded(cssUrl: string) {
  return Array.from(document.styleSheets).some(sheet => {
    // Can be Swiper CSS bundle, minified core-only CSS or a module CSS
    // TODO: What if dependency is hidden in a bundle?
    return (
      sheet.href?.includes("swiper-bundle") || sheet.href?.includes("swiper.min.css") || sheet.href?.includes(cssUrl)
    )
  })
}
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
    return this.initSwiper(config)
  }

  private getConfigFromScript(): SwiperOptions {
    const config = this.querySelector("script[swiper-config]")
    return config ? JSON.parse(config.textContent!) : {}
  }

  injectCss(cssUrl: string) {
    // Construct <link> element to load CSS
    function constructStylesheet(cssUrl: string) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = cssUrl
      document.head.appendChild(link)
    }

    constructStylesheet(cssUrl)
  }

  async initSwiper(config: SwiperConfig) {
    // Load Swiper from store context or fallback to CDN
    const Swiper: Swiper = window.Swiper ?? (await import(swiperJs)).default

    if (typeof Swiper === "undefined") {
      throw new Error("Swiper library is not loaded.")
    }

    // Check if Swiper core CSS is already loaded
    if (!isCssLoaded(swiperCss)) {
      // Inject Swiper core CSS
      // TODO: Make this optional?
      this.injectCss(swiperCss)
    }

    // Load Swiper modules present in the config
    if (config.swiperModules) {
      config.modules = await Promise.all(
        config.swiperModules.map(moduleName =>
          import(`${swiperURLBase}/modules/${moduleName.toLowerCase()}.mjs`).then(module =>{
            if (module.default && moduleName === module.default.name) {
              const moduleCss = `${swiperURLBase}/modules/${moduleName.toLowerCase()}.css`
              if (!isCssLoaded(moduleCss)) {
                // Inject module CSS
                this.injectCss(moduleCss)
              }
            }
            return module.default
          })
        )
      )
      
    }

    const swiperContainer = this.querySelector<HTMLElement>(this.containerSelector || ".swiper")

    if (!swiperContainer) {
      throw new Error("Swiper container not found.")
    }

    new Swiper(swiperContainer!, config)
  }
}
