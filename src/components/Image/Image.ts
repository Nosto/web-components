import type { Crop, ImageProps } from "./types"
import { customElement, Array } from "../decorators"
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
 * @property {string} [alt] - Alternative text for the image for accessibility purposes.
 * @property {string} [sizes] - The sizes attribute for responsive images to help the browser choose the right image size.
 * @property {number[]} [breakpoints] - Custom widths for responsive image generation. Default breakpoints are generated based on common screen sizes.
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
 *
 * @example
 * Using with responsive sizes attribute:
 * ```html
 * <nosto-image
 *   src="https://cdn.shopify.com/static/sample-images/bath.jpeg"
 *   width="800"
 *   aspectRatio="1.5"
 *   layout="constrained"
 *   alt="Product showcase image"
 *   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw">
 * </nosto-image>
 * ```
 *
 * @example
 * Using with custom breakpoints:
 * ```html
 * <nosto-image
 *   src="https://cdn.shopify.com/static/sample-images/bath.jpeg"
 *   width="800"
 *   aspectRatio="1.5"
 *   layout="constrained"
 *   alt="Product showcase image"
 *   breakpoints="[320, 640, 768, 1024, 1280]">
 * </nosto-image>
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
    crop: String,
    alt: String,
    sizes: String,
    breakpoints: Array
  }

  src!: string
  width?: number
  height?: number
  aspectRatio?: number
  layout?: Layout
  crop?: Crop
  alt?: string
  sizes?: string
  breakpoints?: number[]

  attributeChangedCallback() {
    if (this.isConnected) {
      this.connectedCallback()
    }
  }

  connectedCallback() {
    validateProps(this)
    const { src, width, height, layout, aspectRatio, crop, alt, sizes, breakpoints } = this

    // Create props object and filter out null/undefined values
    const rawProps = {
      src,
      width,
      height,
      aspectRatio,
      layout: layout || "constrained",
      crop,
      alt,
      sizes,
      breakpoints
    }

    // Filter out null and undefined values
    const transformProps = Object.fromEntries(
      Object.entries(rawProps).filter(([, value]) => value != null)
    ) as ImageProps

    const { style, ...props } = transform(transformProps)

    const img = document.createElement("img")
    Object.entries(props).forEach(([key, value]) => {
      if (value != null) {
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
    if (!element.width && !element.height) {
      throw new Error("At least one of 'width' or 'height' must be provided.")
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-image": Image
  }
}
