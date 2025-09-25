import type { ImageProps } from "./types"
import { transform } from "./transform"

/**
 * Input properties for the responsiveImage function, extending ImageProps with optional layout default.
 */
export interface ResponsiveImageOptions extends Omit<ImageProps, "layout"> {
  /**
   * The layout of the image. Can be "fixed", "constrained", or "fullWidth".
   * @default "constrained"
   */
  layout?: ImageProps["layout"]
}

/**
 * Result of the responsiveImage function containing the transformed properties and styles.
 */
export interface ResponsiveImageResult {
  /** Properties to be applied as attributes to the img element */
  props: Record<string, string | number>
  /** Style object to be applied to the img element */
  style: CSSStyleDeclaration
}

/**
 * Converts image properties for responsive rendering using the unpic library.
 *
 * This function takes image properties, filters out null/undefined values, applies
 * layout defaults, and transforms them into the format required for responsive
 * image rendering with proper srcset, sizes, and styling.
 *
 * @param options - The image properties and options for responsive conversion
 * @returns An object containing transformed props and styles for the img element
 *
 * @example
 * Basic usage with width and height:
 * ```typescript
 * import { responsiveImage } from '@nosto/web-components'
 *
 * const { props, style } = responsiveImage({
 *   src: 'https://cdn.shopify.com/static/sample-images/bath.jpeg',
 *   width: 800,
 *   height: 600,
 *   layout: 'constrained'
 * })
 *
 * // Create img element and apply properties
 * const img = document.createElement('img')
 * Object.entries(props).forEach(([key, value]) => {
 *   img.setAttribute(key, String(value))
 * })
 * Object.assign(img.style, style)
 * ```
 *
 * @example
 * Using with aspect ratio:
 * ```typescript
 * const { props, style } = responsiveImage({
 *   src: 'https://cdn.shopify.com/static/sample-images/bath.jpeg',
 *   width: 800,
 *   aspectRatio: 1.5,
 *   layout: 'constrained',
 *   alt: 'Product showcase image',
 *   sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
 * })
 * ```
 *
 * @example
 * Full-width responsive image:
 * ```typescript
 * const { props, style } = responsiveImage({
 *   src: 'https://cdn.shopify.com/static/sample-images/bath.jpeg',
 *   height: 400,
 *   layout: 'fullWidth'
 * })
 * ```
 *
 * @example
 * Fixed size image:
 * ```typescript
 * const { props, style } = responsiveImage({
 *   src: 'https://cdn.shopify.com/static/sample-images/bath.jpeg',
 *   width: 500,
 *   height: 300,
 *   layout: 'fixed'
 * })
 * ```
 *
 * @example
 * With Shopify crop parameter:
 * ```typescript
 * const { props, style } = responsiveImage({
 *   src: 'https://cdn.shopify.com/static/sample-images/bath.jpeg',
 *   width: 400,
 *   height: 300,
 *   layout: 'constrained',
 *   crop: 'center'
 * })
 * ```
 */
export function responsiveImage({
  src,
  width,
  height,
  aspectRatio,
  layout = "constrained",
  crop,
  alt,
  sizes
}: ResponsiveImageOptions): ResponsiveImageResult {
  // Create props object and filter out null/undefined values
  const rawProps = {
    src,
    width,
    height,
    aspectRatio,
    layout,
    crop,
    alt,
    sizes
  }

  // Filter out null and undefined values
  const transformProps = Object.fromEntries(Object.entries(rawProps).filter(([, value]) => value != null)) as ImageProps

  const { style, ...transformedProps } = transform(transformProps)

  // Filter out null and undefined values from props
  const props = Object.fromEntries(
    Object.entries(transformedProps).filter(([, value]) => value != null)
  ) as Record<string, string | number>

  return {
    props,
    style
  }
}
