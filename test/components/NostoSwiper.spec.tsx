import { describe, it, expect, beforeEach, vi } from "vitest"
import { NostoSwiper } from "../../src/components/NostoSwiper"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement } from "../utils/jsx"

const mockSwiper = vi.fn()

describe("NostoSwiper", () => {
  let element: NostoSwiper

  beforeEach(() => {
    element = new NostoSwiper()
    vi.restoreAllMocks()
    vi.stubGlobal("Swiper", undefined)
  })

  describe("verify setup & validation", () => {
    it("should be defined as a custom element", () => {
      expect(customElements.get("nosto-swiper")).toBe(NostoSwiper)
    })

    it("should use the global Swiper object if available", async () => {
      vi.stubGlobal("Swiper", mockSwiper)

      element.append(<div class="swiper-test"></div>)

      await element.connectedCallback()
      expect(mockSwiper).toHaveBeenCalled()
    })

    it("should load Swiper from CDN if global Swiper is not available", async () => {
      vi.mock("https://cdn.jsdelivr.net/npm/swiper@latest/swiper.mjs", () => ({
        default: mockSwiper
      }))

      element.setAttribute("container-selector", ".swiper-test")
      element.append(<div class="swiper-test"></div>)

      await element.connectedCallback()
      expect(mockSwiper).toHaveBeenCalled()
    })
  })
})
