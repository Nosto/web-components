import { customElement } from "./decorators"
import type { SwiperOptions } from "swiper/types"
import _Swiper from "swiper"

const swiperURLBase = "https://cdn.jsdelivr.net/npm/swiper@latest"

// Swiper core excludes modules by default
const swiperJs = `${swiperURLBase}/swiper.mjs`

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
  async connectedCallback() {
    return initSwiper(this)
  }
}

async function initSwiper(element: NostoSwiper) {
  element.classList.add("swiper")
  const config = getConfigFromScript(element)
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
  return new Swiper(element, config)
}

function getConfigFromScript(element: HTMLElement): SwiperOptions {
  const config = element.querySelector("script[swiper-config]")
  return config?.textContent ? JSON.parse(config.textContent) : {}
}
