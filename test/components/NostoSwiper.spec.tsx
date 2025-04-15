import { describe, it, expect, beforeEach, vi } from "vitest"
import { NostoSwiper } from "../../src/components/NostoSwiper"
import { createElement } from "../utils/jsx"
import { SwiperOptions } from "swiper/types"

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
    document.head.innerHTML = ""
    document.body.innerHTML = ""
    vi.restoreAllMocks()
  })

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-swiper")).toBe(NostoSwiper)
  })

  it("should throw error on invalid JSON in config script", async () => {
    const element = swiperExample(config)
    element.querySelector("script")!.textContent = "invalid JSON"
    await expect(element.connectedCallback()).rejects.toThrow(/Unexpected token/)
  })

  it("should initialize with valid setup", async () => {
    const element = swiperExample(config)

    await element.connectedCallback()
    expect(element.classList).toContain("swiper-initialized")
  })

  it("should detect slide structure and utilize them", async () => {
    const element = swiperExample(config)

    await element.connectedCallback()
    expect(element.classList).toContain("swiper-initialized")
    expect(element.querySelectorAll("[data-swiper-slide-index]").length).toBe(3)
  })

  it("should load and initialize Swiper modules from CDN", async () => {
    const modulesConfig = { ...config, modules: ["navigation"] }
    const element = swiperExample(modulesConfig)

    const swiper = await element.connectedCallback()
    const module = swiper?.modules?.find(module => module.name === "Navigation")
    expect(module).toBeDefined()
  })

  it("should load CSS when injectCss property is set", async () => {
    const element = swiperExample(config)
    element.injectCss = true
    expect(document.querySelector("link")).toBeNull()
    await element.connectedCallback()

    expect(document.querySelector("link")).toBeDefined()
  })

  it("should load CSS with modules when injectCss and modules is set", async () => {
    const element = swiperExample({ ...config, modules: ["navigation"] })
    element.injectCss = true
    expect(document.querySelector("link")).toBeNull()
    await element.connectedCallback()

    expect(Array.from(document.querySelectorAll("link")).length).toBe(2)
  })

  it("should consider only direct script children", async () => {
    const element = swiperExample(config)
    element.querySelector("script")!.remove()
    element.append(
      <div>
        <script swiper-config>not valid JSON</script>
      </div>
    )
    await expect(element.connectedCallback())
  })

  it("should support nesting", async () => {
    const element = swiperExample(config)
    const nestedElement = swiperExample(config)

    element.append(nestedElement)
    document.body.append(element)

    expect(element.classList).toContain("swiper-initialized")
    expect(nestedElement.classList).toContain("swiper-initialized")
  })
})

type CustomConfig = Omit<SwiperOptions, "modules"> & { modules?: string[] }

function swiperExample(config: CustomConfig) {
  return (
    <nosto-swiper>
      <div class="swiper-wrapper">
        <div className="swiper-slide">Slide 1</div>
        <div className="swiper-slide">Slide 2</div>
        <div className="swiper-slide">Slide 3</div>
      </div>
      <script type="application/json" swiper-config>
        {JSON.stringify(config)}
      </script>
    </nosto-swiper>
  ) as NostoSwiper
}
