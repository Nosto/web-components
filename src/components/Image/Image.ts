import type { Crop } from "./types"
import { customElement } from "../decorators"
import type { Layout } from "@unpic/core/base"
import { transform } from "./transform"
import { NostoElement } from "../Element"

/**
 * NostoImage is a custom element that renders an image with responsive capabilities using the unpic library.
 * refer https://unpic.dev for more details.
 *
 * @category Progressive Enhancement
 *
 * @remarks
 * - Supports only Shopify and BigCommerce image URLs.
 * - Support for format, pad_color and quality to be added in the future.
 *
 * @property {string} src - The source URL of the image.
 * @property {number} [width] - The width of the image in pixels.
 * @property {number} [height] - The height of the image in pixels.
 * @property {number} [aspectRatio] - The aspect ratio of the image (width / height value).
 * @property {Layout} [layout] - The layout of the image. Can be "fixed", "constrained", or "fullWidth".
 * @property {Crop} [crop] - Shopify only. The crop of the image. Can be "center", "left", "right", "top", or "bottom".
 *
 * @example
 * Using with Shopify image URL:
 * ```html
 * <nosto-image src="https://cdn.shopify.com/static/sample-images/bath.jpeg" width="800" height="600" layout="constrained" crop="center"></nosto-image>
 * ```
 *
 * @example
 * Using with BigCommerce image URL:
 * ```html
 * <nosto-image src="https://cdn11.bigcommerce.com/s-hm8pjhul3k/products/4055/images/23603/7-15297__04892.1719977920.1280.1280.jpg" width="800" height="600" layout="constrained"></nosto-image>
 * ```
 */
@customElement("nosto-image", { observe: true })
export class Image extends NostoElement {
  /** @private */
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

  attributeChangedCallback() {
    if (this.isConnected) {
      this.connectedCallback()
    }
  }

  connectedCallback() {
    validateProps(this)
    const { src, width, height, layout, aspectRatio, crop } = this

    const { style, ...props } = transform({
      src,
      width,
      height,
      aspectRatio,
      layout: layout || "constrained",
      crop
    })

    const img = document.createElement("img")
    Object.entries(props).forEach(([key, value]) => {
      if (value != null && value !== undefined) {
        img.setAttribute(key, String(value))
      }
    })
    Object.assign(img.style, style)
    this.replaceChildren(img)
  }
}

function validateProps(element: Image) {
  if (element.layout && !["fixed", "constrained", "fullWidth"].includes(element.layout)) {
    throw new Error(`Invalid layout: ${element.layout}. Allowed values are 'fixed', 'constrained', 'fullWidth'.`)
  }
  if (element.layout !== "fullWidth") {
    if ((["width", "height", "aspectRatio"] as const).filter(prop => element[prop]).length < 2) {
      throw new Error("Either 'width' and 'aspectRatio' or 'height' and 'aspectRatio' must be provided.")
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-image": Image
  }
}
