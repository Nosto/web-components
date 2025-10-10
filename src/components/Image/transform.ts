import type { ImageProps, TransformedImageProps } from "./types"
import { DEFAULT_BREAKPOINTS } from "./types"
import { transform as bcTransform } from "./bigcommerce"
import { transform as shopifyTransform, type Crop } from "./shopify"

function getTransformer(url: string) {
  if (url.includes("shopify")) {
    return { transform: shopifyTransform, supportsCrop: true }
  }
  if (url.includes("bigcommerce")) {
    return { transform: bcTransform, supportsCrop: false }
  }
  return null
}

function generateSrcset(
  src: string,
  transformer: (src: string, options: { width?: number; height?: number; crop?: Crop }) => string,
  breakpoints: number[],
  supportsCrop: boolean,
  crop?: Crop
): string {
  return breakpoints
    .map(width => {
      const transformOptions = supportsCrop ? { width, crop } : { width }
      const transformedSrc = transformer(src, transformOptions)
      return `${transformedSrc} ${width}w`
    })
    .join(", ")
}

export function transform(props: ImageProps): TransformedImageProps {
  const { src, width, height, aspectRatio, alt, sizes, breakpoints: customBreakpoints } = props

  const transformer = getTransformer(src)

  // For unknown providers, return basic properties without transformation
  if (!transformer) {
    const style: Partial<CSSStyleDeclaration> = {}

    if (width) {
      style.width = `${width}px`
    }
    if (height) {
      style.height = `${height}px`
    }
    if (aspectRatio && !height && width) {
      style.height = `${width / aspectRatio}px`
    }
    if (aspectRatio && !width && height) {
      style.width = `${height * aspectRatio}px`
    }

    return {
      src,
      width,
      height,
      alt,
      sizes: sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      loading: "lazy",
      decoding: "async",
      style
    }
  }

  // Use custom breakpoints if provided, otherwise use default breakpoints
  const breakpoints = customBreakpoints || [...DEFAULT_BREAKPOINTS]

  // Extract crop from Shopify URLs if supported
  let crop: Crop | undefined
  if (transformer.supportsCrop && src.includes("shopify")) {
    // Try to extract crop from existing URL
    const cropMatch = src.match(/_crop_([a-zA-Z0-9]+)/)
    if (cropMatch) {
      crop = cropMatch[1] as Crop
    }
  }

  // Generate main src
  // For Shopify, try to extract existing dimensions from URL if no width/height provided
  let mainWidth = width
  let mainHeight = height

  if (!mainWidth && !mainHeight && src.includes("shopify")) {
    // Try to extract dimensions from existing URL
    const dimMatch = src.match(/_(\d+)x(\d+)/)
    if (dimMatch) {
      mainWidth = parseInt(dimMatch[1], 10)
      mainHeight = parseInt(dimMatch[2], 10)
    }
  }

  // For BigCommerce, if only height is provided, use a default large width (1280)
  if (!mainWidth && mainHeight && src.includes("bigcommerce")) {
    mainWidth = 1280
  }

  // If still no dimensions, use first breakpoint as width
  if (!mainWidth && !mainHeight) {
    mainWidth = breakpoints[0]
  }

  const mainTransformOptions = transformer.supportsCrop
    ? { width: mainWidth, height: mainHeight, crop }
    : { width: mainWidth, height: mainHeight }

  const transformedSrc = transformer.transform(src, mainTransformOptions)

  // Generate srcset for responsive images
  // If a specific width is provided, include it in the srcset
  const srcsetBreakpoints =
    mainWidth && !customBreakpoints && !breakpoints.includes(mainWidth)
      ? [...breakpoints, mainWidth].sort((a, b) => a - b)
      : breakpoints
  const srcset = generateSrcset(src, transformer.transform, srcsetBreakpoints, transformer.supportsCrop, crop)

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
