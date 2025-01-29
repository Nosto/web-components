import colorFn from "./colors"
import template from "./NostoSkuColorSwatchTemplate"

export class NostoSkuColorSwatch extends HTMLElement {
  static observedAttributes = ["mode", "sku-colors"]

  private _normalizedColors: Array<string>
  private _colorLoader: ReturnType<typeof colorFn>

  constructor() {
    super()
    this._normalizedColors = []
    this._colorLoader = colorFn()
  }

  connectedCallback() {
    this.normalizeColors()
    const templateElement = template(this)
    if (templateElement) {
      this.append(templateElement.cloneNode(true))
    }
  }

  get mode() {
    return this.getAttribute("mode") || "dots"
  }

  get colors() {
    return this._normalizedColors
  }

  normalizeColors() {
    const inputColors = this.getAttribute("sku-colors")
    if (inputColors) {
      this._normalizedColors = JSON.parse(inputColors, (_key: string, value: unknown) => {
        if (typeof value === "string") {
          const key = value.toLowerCase().replace(/\s/g, "_")
          return this._colorLoader.getHEX(key)
        }
        return value
      }) as unknown as string[]
    }
  }
}

try {
  customElements.define("nosto-color-swatch", NostoSkuColorSwatch)
} catch (e) {
  console.error(e)
}
