import { describe, it, expect, beforeEach, vi } from "vitest"

vi.mock("https://cdn.jsdelivr.net/npm/swiper@latest/swiper.mjs", () => ({ default: undefined }))
vi.mock("https://cdn.jsdelivr.net/npm/swiper@latest/modules/navigation.mjs", () => ({
  default: function Navigation() {}
}))

import { NostoSwiper } from "../../src/components/NostoSwiper"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement } from "../utils/jsx"
import Swiper from "swiper"
import { SwiperOptions } from "swiper/types"
import * as SwiperCdn from "https://cdn.jsdelivr.net/npm/swiper@latest/swiper.mjs"

describe("NostoSwiper", () => {
  let element: NostoSwiper

  const config = {
    createElements: true,
    loop: true
  } satisfies SwiperOptions

  beforeEach(() => {
    element = new NostoSwiper()
    vi.restoreAllMocks()
    vi.stubGlobal("Swiper", undefined)
  })

  describe("verify setup & validation", () => {
    it("should be defined as a custom element", () => {
      expect(customElements.get("nosto-swiper")).toBe(NostoSwiper)
    })

    it("should throw error on missing container element", async () => {
      vi.stubGlobal("Swiper", Swiper)
      await expect(element.connectedCallback()).rejects.toThrow("Swiper container not found.")
    })

    it("should throw error on missing library", async () => {
      element.setAttribute("container-selector", ".swiper-test")
      element.append(<SwiperExample className="swiper-test" />, <SwiperConfig config={config} />)

      await expect(element.connectedCallback()).rejects.toThrow("Swiper library is not loaded.")
    })

    it("should use the global Swiper object if available", async () => {
      vi.stubGlobal("Swiper", Swiper)
      element.setAttribute("container-selector", ".swiper-test")
      element.append(<SwiperExample className="swiper-test" />, <SwiperConfig config={config} />)

      await element.connectedCallback()
      expect(element.querySelector(".swiper-test")?.classList).toContain("swiper-initialized")
    })

    it("should load Swiper from CDN if global Swiper is not available", async () => {
      // @ts-expect-error explicit module mutation for testing
      SwiperCdn.default = Swiper
      element.setAttribute("container-selector", ".swiper-test-cdn")
      element.append(<SwiperExample className="swiper-test-cdn" />, <SwiperConfig config={config} />)

      await element.connectedCallback()
      expect(element.querySelector(".swiper-test-cdn")?.classList).toContain("swiper-initialized")
      expect(element.querySelectorAll("[data-swiper-slide-index]").length).toBe(3)
    })

    it("should load and initialize Swiper modules from CDN", async () => {
      element.setAttribute("container-selector", ".swiper-test-modules")
      element.append(
        <div class="swiper-test-modules"></div>,
        <script swiper-config>{JSON.stringify({ ...config, modules: ["navigation"] })}</script>
      )

      const swiper = await element.connectedCallback()
      const module = swiper?.modules?.find(module => module.name === "Navigation")
      expect(module).toBeDefined()
    })
  })
})

function SwiperExample({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="swiper-slide">Slide 1</div>
      <div className="swiper-slide">Slide 2</div>
      <div className="swiper-slide">Slide 3</div>
    </div>
  )
}

function SwiperConfig({ config }: { config: SwiperOptions }) {
  return <script swiper-config>{JSON.stringify(config)}</script>
}
