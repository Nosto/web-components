/* eslint-disable @typescript-eslint/no-explicit-any */
import { define } from "hybrids"
import type { Crop, ImageProps } from "./types"
import type { Layout } from "@unpic/core/base"
import { transform } from "./transform"
import { logFirstUsage } from "@/logger"

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
const Image = {
  tag: "nosto-image",
  src: "",
  width: 0,
  height: 0,
  aspectRatio: 0,
  layout: "",
  crop: "",
  alt: "",
  sizes: "",
  breakpoints: undefined,
  unstyled: false,
  fetchpriority: "",

  connect: (host: any) => {
    logFirstUsage()

    // Create shadow DOM
    if (!host.shadowRoot) {
      host.attachShadow({ mode: "open" })
    }

    // Function to update image
    const updateImage = () => {
      validateProps(host)
      const { src, width, height, layout, aspectRatio, crop, alt, sizes, breakpoints, unstyled, fetchpriority } = host

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
        Object.entries(rawProps).filter(([, value]) => value != null && value !== "" && value !== 0)
      ) as ImageProps

      let img = host.shadowRoot!.querySelector("img")
      if (img) {
        setProps(img, transformProps, unstyled)
      } else {
        img = document.createElement("img")
        setProps(img, transformProps, unstyled)
        host.shadowRoot!.replaceChildren(img)
      }
    }

    // Initial render
    updateImage()

    // Re-render when attributes change
    const observer = new MutationObserver(updateImage)

    observer.observe(host, {
      attributes: true,
      attributeFilter: [
        "src",
        "width",
        "height",
        "aspect-ratio",
        "layout",
        "crop",
        "alt",
        "sizes",
        "breakpoints",
        "unstyled",
        "fetch-priority"
      ]
    })

    return () => {
      observer.disconnect()
    }
  }
}

function setProps(img: HTMLImageElement, transformProps: ImageProps, unstyled?: boolean) {
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

function validateProps(element: any) {
  if (element.layout && !["fixed", "constrained", "fullWidth"].includes(element.layout)) {
    throw new Error(`Invalid layout: ${element.layout}. Allowed values are 'fixed', 'constrained', 'fullWidth'.`)
  }
  if (element.layout !== "fullWidth" && element.layout !== undefined) {
    if (!element.width && !element.height) {
      throw new Error("At least one of 'width' or 'height' must be provided.")
    }
  }
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

// Define the hybrid component
define(Image)

declare global {
  interface HTMLElementTagNameMap {
    "nosto-image": HTMLElement & {
      src: string
      width?: number
      height?: number
      aspectRatio?: number
      layout?: Layout
      crop?: Crop
      alt?: string
      sizes?: string
      breakpoints?: number[]
      unstyled?: boolean
      fetchpriority?: "high" | "low" | "auto"
    }
  }
}

export { Image }
