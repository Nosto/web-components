import type { Crop, ImageProps } from "./types"
import { customElement, property } from "../decorators"
import type { Layout } from "@unpic/core/base"
import { transform } from "./transform"
import { NostoElement } from "../Element"

/**
 * NostoImage is a custom element that renders an image with responsive capabilities using the unpic library.
 * refer https://unpic.dev for more details.
 *
 * {@include ./examples.md}
 *
 * @category Campaign level templating
 *
 * @remarks
 * - Supports only Shopify and BigCommerce image URLs.
 * - Support for format, pad_color and quality to be added in the future.
 *
 * @property {string} src - The source URL of the image.
 * @property {number} [width] - The width of the image in pixels.
 * @property {number} [height] - The height of the image in pixels.
 * @property {number} [aspectRatio] (`aspect-ratio`) - The aspect ratio of the image (width / height value).
 * @property {Layout} [layout] - The layout of the image. Can be "fixed", "constrained", or "fullWidth".
 * @property {Crop} [crop] - Shopify only. The crop of the image. Can be "center", "left", "right", "top", or "bottom".
 * @property {string} [alt] - Alternative text for the image for accessibility purposes.
 * @property {string} [sizes] - The sizes attribute for responsive images to help the browser choose the right image size.
 * @property {number[]} [breakpoints] - Custom widths for responsive image generation. Default breakpoints are generated based on common screen sizes.
 * @property {boolean} [unstyled] - When present, prevents inline styles from being applied to the image element.
 * @property {"high"|"low"|"auto"} [fetchpriority] (`fetch-priority`) - Provides a hint to the browser about the priority of this image relative to other images.
 */
@customElement("nosto-image", { observe: true })
export class Image extends NostoElement {
  @property(String) src!: string
  @property(Number) width?: number
  @property(Number) height?: number
  @property(Number) aspectRatio?: number
  @property(String) layout?: Layout
  @property(String) crop?: Crop
  @property(String) alt?: string
  @property(String) sizes?: string
  @property(Array) breakpoints?: number[]
  @property(Boolean) unstyled?: boolean
  @property(String) fetchpriority?: "high" | "low" | "auto"

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  attributeChangedCallback(_: string, oldValue: string | null, newValue: string | null) {
    if (this.isConnected && oldValue !== newValue) {
      this.connectedCallback()
    }
  }

  connectedCallback() {
    this.#validateProps()
    const { src, width, height, layout, aspectRatio, crop, alt, sizes, breakpoints, unstyled, fetchpriority } = this

    // Create props object and filter out null/undefined values
    const rawProps = {
      src,
      width,
      height,
      aspectRatio,
      layout,
      crop,
      alt,
      sizes,
      breakpoints,
      fetchpriority
    }

    // Filter out null and undefined values
    const transformProps = Object.fromEntries(
      Object.entries(rawProps).filter(([, value]) => value != null)
    ) as ImageProps

    let img = this.shadowRoot!.querySelector("img")
    if (img) {
      this.#setProps(img, transformProps, unstyled)
    } else {
      img = document.createElement("img")
      this.#setProps(img, transformProps, unstyled)
      this.shadowRoot!.replaceChildren(img)
    }
  }

  #setProps(img: HTMLImageElement, transformProps: ImageProps, unstyled?: boolean) {
    const { style, ...props } = transform(transformProps)
    Object.entries(props).forEach(([key, value]) => {
      if (value != null) {
        img.setAttribute(key, String(value))
      }
    })
    if (!unstyled) {
      Object.assign(img.style, style)
    }
  }

  #validateProps() {
    if (this.layout && !["fixed", "constrained", "fullWidth"].includes(this.layout)) {
      throw new Error(`Invalid layout: ${this.layout}. Allowed values are 'fixed', 'constrained', 'fullWidth'.`)
    }
    if (this.layout !== "fullWidth" && this.layout !== undefined) {
      if (!this.width && !this.height) {
        throw new Error("At least one of 'width' or 'height' must be provided.")
      }
    }
    if (this.breakpoints) {
      const invalidItems = this.breakpoints.filter(
        item => typeof item !== "number" || !Number.isFinite(item) || item <= 0
      )
      if (invalidItems.length > 0) {
        throw new Error(
          `All breakpoints must be positive finite numbers, found these illegal entries ${JSON.stringify(invalidItems)}`
        )
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-image": Image
  }
}
