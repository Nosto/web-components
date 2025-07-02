import type { Crop } from "@/types"
import { customElement } from "./decorators"
import { checkRequired } from "@/utils"
import type { Layout } from "@unpic/core/base"
import { transform } from "@/image/transformers"

@customElement("nosto-image")
export class NostoImage extends HTMLElement {
  static attributes = {
    src: String,
    width: Number,
    height: Number,
    aspectRatio: Number,
    layout: String,
    crop: String
  }

  src!: string
  width?: number
  height?: number
  aspectRatio?: number
  layout?: Layout
  crop?: Crop

  connectedCallback() {
    this.validateProps()
    const { src, width, height, layout, aspectRatio, crop } = this

    const { props, style } = transform({
      src,
      width,
      height,
      aspectRatio,
      layout: layout || "constrained",
      crop
    })

    const imageElement = document.createElement("img")
    Object.assign(imageElement, props)
    Object.assign(imageElement.style, style)

    this.appendChild(imageElement)
  }

  validateProps() {
    if (this.layout && !["fixed", "constrained", "fullWidth"].includes(this.layout)) {
      throw new Error(`Invalid layout: ${this.layout}. Allowed values are 'fixed', 'constrained', 'fullWidth'.`)
    }

    if (this.layout !== "fullWidth") {
      if (checkRequired(this, "width", "aspectRatio") || checkRequired(this, "height", "aspectRatio")) {
        throw new Error("Either 'width' and 'aspectRatio' or 'height' and 'aspectRatio' must be provided.")
      }
    }
  }
}
