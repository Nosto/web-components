import type { ImageProps } from "./types"
import { customElement } from "../decorators"
import { transform } from "./transform"
import { NostoElement } from "../Element"

/**
 * NostoImage is a responsive custom element that renders images with automatic srcset generation
 * for Shopify and BigCommerce URLs. Uses transformer-specific URL handling for optimal performance.
 *
 * @category Campaign level templating
 *
 * @remarks
 * - Supports Shopify and BigCommerce image URLs with automatic responsive srcset generation.
 * - Uses default breakpoints [320, 640, 768, 1024, 1280, 1600] unless custom breakpoints are provided.
 * - For unknown image providers, falls back to basic img element without transformation.
 *
 * @property {string} src - The source URL of the image.
 * @property {number} [width] - The width of the image in pixels.
 * @property {number} [height] - The height of the image in pixels.
 * @property {number} [aspectRatio] - The aspect ratio of the image (width / height value).
 * @property {string} [alt] - Alternative text for the image for accessibility purposes.
 * @property {string} [sizes] - The sizes attribute for responsive images to help the browser choose the right image size.
 * @property {number[]} [breakpoints] - Custom widths for responsive image generation. Defaults to [320, 640, 768, 1024, 1280, 1600].
 *
 * @example
 * Using with Shopify image URL:
 * ```html
 * <nosto-image src="https://cdn.shopify.com/static/sample-images/bath.jpeg" width="800" height="600"></nosto-image>
 * ```
 *
 * @example
 * Using with BigCommerce image URL:
 * ```html
 * <nosto-image src="https://cdn11.bigcommerce.com/s-hm8pjhul3k/products/4055/images/23603/7-15297__04892.1719977920.1280.1280.jpg" width="800" height="600"></nosto-image>
 * ```
 *
 * @example
 * Using with responsive sizes attribute:
 * ```html
 * <nosto-image
 *   src="https://cdn.shopify.com/static/sample-images/bath.jpeg"
 *   width="800"
 *   aspectRatio="1.5"
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
    alt: String,
    sizes: String,
    breakpoints: Array
  }

  src!: string
  width?: number
  height?: number
  aspectRatio?: number
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
    const { src, width, height, aspectRatio, alt, sizes, breakpoints } = this

    // Create props object and filter out null/undefined values
    const rawProps = {
      src,
      width,
      height,
      aspectRatio,
      alt,
      sizes,
      breakpoints
    }

    // Filter out null and undefined values
    const transformProps = Object.fromEntries(
      Object.entries(rawProps).filter(([, value]) => value != null)
    ) as ImageProps

    let img = this.querySelector("img")
    if (img) {
      setProps(img, transformProps)
    } else {
      img = document.createElement("img")
      setProps(img, transformProps)
      this.replaceChildren(img)
    }
  }
}

function setProps(img: HTMLImageElement, transformProps: ImageProps) {
  const { style, ...props } = transform(transformProps)
  Object.entries(props).forEach(([key, value]) => {
    if (value != null) {
      img.setAttribute(key, String(value))
    }
  })
  Object.assign(img.style, style)
}

function validateProps(element: Image) {
  if (element.breakpoints) {
    const invalidItems = element.breakpoints.filter(
      item => typeof item !== "number" || !Number.isFinite(item) || item <= 0
    )
    if (invalidItems.length > 0) {
      throw new Error(
        `All breakpoints must be positive finite numbers, found these illegal entries ${JSON.stringify(invalidItems)}`
      )
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-image": Image
  }
}
