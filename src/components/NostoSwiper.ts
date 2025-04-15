import { customElement } from "./decorators"
import type { SwiperOptions } from "swiper/types"
import _Swiper from "swiper"

const swiperURLBase = "https://cdn.jsdelivr.net/npm/swiper@latest"
// Swiper core excludes modules by default
const swiperJs = `${swiperURLBase}/swiper.mjs`
const swiperCss = `${swiperURLBase}/swiper.min.css`

/**
 * Custom element that wraps the Swiper library to create slideshows and carousels.
 *
 * @property {string} containerSelector - Selector for the swiper container element
 *
 * @example
 * ```html
 * <nosto-swiper>
 *   <div class="swiper-wrapper">
 *     <div class="swiper-slide">Slide 1</div>
 *     <div class="swiper-slide">Slide 2</div>
 *     <div class="swiper-slide">Slide 3</div>
 *   </div>
 *   <script type="application/json" swiper-config>
 *     {
 *       "slidesPerView": 3,
 *       "spaceBetween": 10,
 *       "modules": ["navigation", "pagination"]
 *     }
 *   </script>
 * </nosto-swiper>
 * ```
 */
@customElement("nosto-swiper")
export class NostoSwiper extends HTMLElement {
  static attributes = {
    injectCss: Boolean
  }

  injectCss!: boolean

  async connectedCallback() {
    this.classList.add("swiper")
    const config = getConfigFromScript(this)
    // Load Swiper from store context or fallback to CDN
    const Swiper = _Swiper ?? (await import(swiperJs)).default

    if (typeof Swiper === "undefined") {
      throw new Error("Swiper library is not loaded.")
    }

    if (this.injectCss) {
      loadStyleSheets(config)
    }

    // Load Swiper modules present in the config
    if (config.modules) {
      config.modules = await Promise.all(
        config.modules.map(module => import(`${swiperURLBase}/modules/${module}.mjs`).then(mod => mod.default))
      )
    }
    return new Swiper(this, config)
  }
}

function getConfigFromScript(element: HTMLElement): SwiperOptions {
  const config = Array.from(element.children).find(child => child.matches("script[swiper-config]"))
  return config?.textContent ? JSON.parse(config.textContent) : {}
}

function loadStyleSheets(config: SwiperOptions) {
  if (document.querySelector("link[nwc-nosto-swiper]")) {
    return
  }
  const urls = [swiperCss, ...(config.modules || []).map(module => `${swiperURLBase}/modules/${module}.css`)]
  urls.forEach(url => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = url
    link.toggleAttribute("nwc-nosto-swiper", true)
    document.head.appendChild(link)
  })
}
