import { customElement } from "./decorators"

const swiperJs = "https://cdn.jsdelivr.net/npm/swiper@latest/swiper-bundle.min.mjs"

@customElement("nosto-scroller")
export class NostoScroller extends HTMLElement {
  _config?: Record<string, unknown>
  _version?: string
  constructor() {
    super()
  }

  connectedCallback() {
    this._config = this.getConfigFromScript()
    this._version = this.version ?? "latest"
    this.initLibrary()
  }

  get library() {
    return this.getAttribute("library")
  }

  get version() {
    return this.getAttribute("version")
  }

  get containerSelector() {
    return this.getAttribute("container-selector")
  }

  private getConfigFromScript(): Record<string, unknown> {
    const script = this.querySelector("script[type='application/json']")
    if (!script) {
        return {}
    }

    try {
      return JSON.parse(script.textContent || "{}")
    } catch (error) {
      console.error("Invalid JSON in script tag.")
      return {}
    }
  }

  async initLibrary() {
    switch (this.library) {
      case "swiper":
        await this.loadSwiper()
        break
      // Add cases for other libraries as needed
      default:
        console.warn(`Library ${this.library} is not supported.`)
    }
  }

  async loadSwiper() {
    const Swiper =
      window.Swiper ?? (await import(swiperJs)).default
    if (typeof Swiper === "undefined") {
      console.error("Swiper library is not loaded.")
      return
    }

    const swiperContainer = this.querySelector(this.containerSelector || ".swiper")

    new Swiper(swiperContainer, this._config)
  }
}
