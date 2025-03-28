import { describe, it, expect, beforeEach, vi } from "vitest"

vi.mock("https://cdn.jsdelivr.net/npm/swiper@latest/swiper.mjs", () => ({ default: undefined }))

import { NostoSwiper } from "../../src/components/NostoSwiper"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement } from "../utils/jsx"
import Swiper from "swiper"
import { SwiperOptions } from "swiper/types"
import * as SwiperCdn from "https://cdn.jsdelivr.net/npm/swiper@latest/swiper.mjs"

describe("NostoSwiper", () => {
  let element: NostoSwiper

  const config = {
    createElements: true
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
      element.append(<div class="swiper-test"></div>, <script swiper-config>{JSON.stringify(config)}</script>)

      await expect(element.connectedCallback()).rejects.toThrow("Swiper library is not loaded.")
    })

    it("should use the global Swiper object if available", async () => {
      vi.stubGlobal("Swiper", Swiper)
      element.setAttribute("container-selector", ".swiper-test")
      element.append(<div class="swiper-test"></div>, <script swiper-config>{JSON.stringify(config)}</script>)

      await element.connectedCallback()
      expect(element.querySelector(".swiper-test")?.classList).toContain("swiper-initialized")
    })

    it("should load Swiper from CDN if global Swiper is not available", async () => {
      // @ts-expect-error explicit module mutation for testing
      SwiperCdn.default = Swiper
      element.setAttribute("container-selector", ".swiper-test-cdn")
      element.append(<div class="swiper-test-cdn"></div>, <script swiper-config>{JSON.stringify(config)}</script>)

      await element.connectedCallback()
      expect(element.querySelector(".swiper-test-cdn")?.classList).toContain("swiper-initialized")
    })

    it("should handle invalid config JSON gracefully", async () => {
      vi.stubGlobal("Swiper", Swiper)
      element.setAttribute("container-selector", ".swiper-test")
      element.append(<div class="swiper-test"></div>, <script swiper-config>{"{invalid-json}"}</script>)

      await expect(element.connectedCallback()).rejects.toThrow()
    })

    it("should validate the slide content", async () => {
      vi.stubGlobal("Swiper", Swiper)
      element.setAttribute("container-selector", ".swiper-test-slides")
      element.append(
        <div class="swiper-test-slides">
          <div class="swiper-wrapper">
            <div class="nosto-swiper-slide">Slide 1</div>
            <div class="nosto-swiper-slide">Slide 2</div>
            <div class="nosto-swiper-slide">Slide 3</div>
          </div>
        </div>,
        <script swiper-config>{JSON.stringify({...config, "slideClass": "nosto-swiper-slide"})}</script>
      )

      await element.connectedCallback()
      expect(element.querySelector(".swiper-test-slides")?.classList).toContain("swiper-initialized")
      expect(element.querySelectorAll(".nosto-swiper-slide").length).toBe(3)
    })
  })
})
