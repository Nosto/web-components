import { describe, it, expect, beforeEach, vi } from "vitest"

vi.mock("https://cdn.jsdelivr.net/npm/swiper@latest/swiper.mjs", () => ({ default: undefined }))
vi.mock("https://cdn.jsdelivr.net/npm/swiper@latest/modules/navigation.mjs", () => ({
  default: function Navigation() {}
}))
vi.mock("https://cdn.jsdelivr.net/npm/swiper@latest/modules/navigation.css", () => ({
  default: {}
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
    createElements: true
  } satisfies SwiperOptions

  beforeEach(() => {
    element = new NostoSwiper()
    document.body.innerHTML = ""
    document.head.innerHTML = ""
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

    it("should load Swiper CSS modules if not included", async () => {
      element.setAttribute("container-selector", ".swiper-test-css")
      element.append(<div class="swiper-test-css"></div>, <script swiper-config>{JSON.stringify(config)}</script>)

      await element.connectedCallback()
      const styleSheets = Array.from(document.querySelectorAll("[rel=stylesheet]"))
      expect(styleSheets.some(sheet => (sheet as HTMLLinkElement).href?.includes("swiper.min.css"))).toBe(true)
    })

    it("should not load Swiper CSS if already included", async () => {
      const injectCssMock = vi.fn()
      vi.spyOn(NostoSwiper.prototype, "injectCss").mockImplementation(injectCssMock)

      element.setAttribute("container-selector", ".swiper-test-css")
      element.append(<div class="swiper-test-css"></div>, <script swiper-config>{JSON.stringify(config)}</script>)

      // Add the link element to the head
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "swiper.min.css"
      document.head.appendChild(link)

      await element.connectedCallback()

      const styleSheets = Array.from(document.head.querySelectorAll("[rel=stylesheet]"))
      expect(styleSheets.length).toBe(1)
    })

    it("should load Swiper module CSS from CDN", async () => {
      element.setAttribute("container-selector", ".swiper-test-css-modules")
      element.append(
        <div class="swiper-test-css-modules"></div>,
        <script swiper-config>{JSON.stringify({ ...config, swiperModules: ["Navigation"] })}</script>
      )

      await element.connectedCallback()
      const styleSheets = Array.from(document.querySelectorAll("[rel=stylesheet]"))
      expect(styleSheets.some(sheet => (sheet as HTMLLinkElement).href?.includes("navigation.css"))).toBe(true)
    })
  })
})
