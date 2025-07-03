import type { Crop } from "@/types"
import { customElement } from "./decorators"
import { checkRequired } from "@/utils"
import type { Layout } from "@unpic/core/base"
import { transform } from "@/image/transformers"

/**
 * @alpha
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
      if (
        !checkRequired(this, "width", "height") &&
        !checkRequired(this, "width", "aspectRatio") &&
        !checkRequired(this, "height", "aspectRatio")
      ) {
        throw new Error("Either 'width' and 'aspectRatio' or 'height' and 'aspectRatio' must be provided.")
      }
    }
  }
}
