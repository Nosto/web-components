import { describe, it, expect, beforeEach, vi } from "vitest"
import { NostoSwiper } from "../../src/components/NostoSwiper"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement } from "../utils/jsx"
import Swiper from "swiper"
import { SwiperOptions } from "swiper/types"
import * as SwiperCdn from "https://cdn.jsdelivr.net/npm/swiper@latest/swiper.mjs"

vi.mock("https://cdn.jsdelivr.net/npm/swiper@latest/swiper.mjs", () => ({ default: undefined }))
vi.mock("https://cdn.jsdelivr.net/npm/swiper@latest/modules/navigation.mjs", () => ({
  // Named dummy function for Swiper module testing purposes
  default: function Navigation() {}
}))

describe("NostoSwiper", () => {
  const config = {
    createElements: true,
    loop: true
  } satisfies SwiperOptions

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.stubGlobal("Swiper", undefined)
  })

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-swiper")).toBe(NostoSwiper)
  })

  it("should throw error on missing container element", async () => {
    vi.stubGlobal("Swiper", Swiper)
    const element = new NostoSwiper()
    await expect(element.connectedCallback()).rejects.toThrow("Swiper container not found.")
  })

  it("should throw error on missing library", async () => {
    const element = swiperExample("swiper-test", config)
    await expect(element.connectedCallback()).rejects.toThrow("Swiper library is not loaded.")
  })

  it("should throw error on invalid JSON in config script", async () => {
    const element = swiperExample("swiper-test", config)
    element.querySelector("script")!.textContent = "invalid JSON"
    await expect(element.connectedCallback()).rejects.toThrow(/Unexpected token/)
  })

  it("should use the global Swiper object if available", async () => {
    vi.stubGlobal("Swiper", Swiper)
    const element = swiperExample("swiper-test", config)

    await element.connectedCallback()
    expect(element.querySelector(".swiper-test")?.classList).toContain("swiper-initialized")
  })

  it("should load Swiper from CDN if global Swiper is not available", async () => {
    // @ts-expect-error explicit module mutation for testing
    SwiperCdn.default = Swiper
    const element = swiperExample("swiper-test-cdn", config)

    await element.connectedCallback()
    expect(element.querySelector(".swiper-test-cdn")?.classList).toContain("swiper-initialized")
    expect(element.querySelectorAll("[data-swiper-slide-index]").length).toBe(3)
  })

  it("should load and initialize Swiper modules from CDN", async () => {
    const modulesConfig = { ...config, modules: ["navigation"] }
    //@ts-expect-error string is not assignable to SwiperModule
    const element = swiperExample("swiper-test-modules", modulesConfig)

    const swiper = await element.connectedCallback()
    const module = swiper?.modules?.find(module => module.name === "Navigation")
    expect(module).toBeDefined()
  })
})

function swiperExample(containerClass: string, config: SwiperOptions) {
  return (
    <nosto-swiper container-selector={`.${containerClass}`}>
      <div className={containerClass}>
        <div className="swiper-slide">Slide 1</div>
        <div className="swiper-slide">Slide 2</div>
        <div className="swiper-slide">Slide 3</div>
      </div>
      <script swiper-config>{JSON.stringify(config)}</script>
    </nosto-swiper>
  ) as NostoSwiper
}
