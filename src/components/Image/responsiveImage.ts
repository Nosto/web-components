import type { ImageProps } from "./types"
import { transform } from "./transform"

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
 * ```typescript
 * import { responsiveImage } from '@nosto/web-components'
 *
 * const { props, style } = responsiveImage({
 *   src: 'https://cdn.shopify.com/static/sample-images/bath.jpeg',
 *   width: 800,
 *   aspectRatio: 1.5,
 *   layout: 'constrained',
 *   alt: 'Product showcase image',
 *   sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
 *   crop: 'center'
 * })
 *
 * // Create img element and apply properties
 * const img = document.createElement('img')
 * Object.entries(props).forEach(([key, value]) => {
 *   img.setAttribute(key, String(value))
 * })
 * Object.assign(img.style, style)
 * ```
 */
export function responsiveImage(rawProps: ImageProps) {
  const transformProps = Object.fromEntries(Object.entries(rawProps).filter(([, value]) => value != null)) as ImageProps
  const { style, ...transformedProps } = transform(transformProps)
  const props = Object.fromEntries(Object.entries(transformedProps).filter(([, value]) => value != null)) as ImageProps

  return {
    props,
    style
  }
}
