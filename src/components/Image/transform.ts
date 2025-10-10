import type { ImageProps, TransformedImageProps, Options } from "./types"
import { DEFAULT_BREAKPOINTS } from "./types"
import { transform as bcTransform } from "./bigcommerce"
import { transform as shopifyTransform } from "./shopify"

function getTransformer(url: string) {
  if (url.includes("shopify")) {
    return shopifyTransform
  }
  if (url.includes("bigcommerce")) {
    return bcTransform
  }
  return null
}

function generateSrcset(
  src: string,
  transformer: (src: string, options: Options) => string,
  breakpoints: number[]
): string {
  return breakpoints
    .map(width => {
      const transformOptions = { width }
      const transformedSrc = transformer(src, transformOptions)
      return `${transformedSrc} ${width}w`
    })
    .join(", ")
}

export function transform(props: ImageProps): TransformedImageProps {
  const { src, width, height, aspectRatio, alt, sizes, breakpoints: customBreakpoints } = props

  const transformer = getTransformer(src)

  // For unknown providers, throw an error
  if (!transformer) {
    throw new Error(`Unsupported image provider for URL: ${src}`)
  }

  // Use custom breakpoints if provided, otherwise use default breakpoints
  const breakpoints = customBreakpoints || [...DEFAULT_BREAKPOINTS]

  // Generate main src
  let mainWidth = width
  const mainHeight = height

  // If still no dimensions, use first breakpoint as width
  if (!mainWidth && !mainHeight) {
    mainWidth = breakpoints[0]
  }

  const mainTransformOptions = { width: mainWidth, height: mainHeight }

  const transformedSrc = transformer(src, mainTransformOptions)

  // Generate srcset for responsive images
  // If a specific width is provided, include it in the srcset
  const srcsetBreakpoints =
    mainWidth && !customBreakpoints && !breakpoints.includes(mainWidth)
      ? [...breakpoints, mainWidth].sort((a, b) => a - b)
      : breakpoints
  const srcset = generateSrcset(src, transformer, srcsetBreakpoints)

  // Calculate CSS styles for responsive behavior
  const style: Partial<CSSStyleDeclaration> = {}

  if (width && height) {
    style.aspectRatio = `${width} / ${height}`
  } else if (aspectRatio) {
    style.aspectRatio = String(aspectRatio)
  }

  // Make images responsive by default
  style.maxWidth = "100%"
  style.height = "auto"

  return {
    src: transformedSrc,
    srcset,
    alt,
    sizes: sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    loading: "lazy",
    decoding: "async",
    style
  }
}
