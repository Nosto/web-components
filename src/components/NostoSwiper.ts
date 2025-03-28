import { customElement } from "./decorators"
import type { SwiperOptions } from "swiper/types"

const swiperURLBase = "https://cdn.jsdelivr.net/npm/swiper@latest"

// Swiper core excludes modules by default
const swiperJs = `${swiperURLBase}/swiper.mjs`
const swiperCss = `${swiperURLBase}/swiper.min.css`

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
    return this.initSwiper(config)
  }

  private getConfigFromScript(): SwiperOptions {
    const config = this.querySelector("script[swiper-config]")
    return config ? JSON.parse(config.textContent!) : {}
  }

  private async injectCss(module: string) {
    function isCssLoaded(cssUrl: string) {
      return Array.from(document.styleSheets).some(sheet => {
        if (module === "core") {
          // Can be Swiper CSS bundle or minified core-only CSS
          // TODO: What if dependency is hidden in a bundle?
          return (
            (sheet.href?.includes("swiper-bundle") || sheet.href?.includes("swiper-min")) && sheet.href.endsWith(".css")
          )
        }
        // Return true if module CSS is already loaded
        return sheet.href?.includes(cssUrl)
      })
    }

    // Construct <link> element to load CSS
    function constructStylesheet(cssUrl: string) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = cssUrl
      document.head.appendChild(link)
    }
    const cssUrl = module === "core" ? swiperCss : `${swiperURLBase}/modules/${module}.css`

    // If CSS is already loaded for the module, return
    if (isCssLoaded(cssUrl)) return

    constructStylesheet(cssUrl)
  }

  async initSwiper(config: SwiperOptions) {
    // Load Swiper from store context or fallback to CDN
    const Swiper: Swiper = window.Swiper ?? (await import(swiperJs)).default

    if (typeof Swiper === "undefined") {
      throw new Error("Swiper library is not loaded.")
    }

    // Inject Swiper core CSS
    // TODO: Make this optional?
    this.injectCss("core")

    // Load Swiper modules present in the config
    if (config.modules) {
      config.modules = await Promise.all(
        config.modules.map(module =>
          import(`${swiperURLBase}/modules/${module}.mjs`).then(module => {
            const moduleName = module.default?.name.toLowerCase() || "unknown"
            if (module.default && moduleName !== "unknown") {
              // Inject module CSS
              this.injectCss(moduleName)
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
