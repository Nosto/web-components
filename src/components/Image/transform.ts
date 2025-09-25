import type { ImageProps, TransformResult, Operations } from "./types"
import { transform as bcTransform } from "./bigcommerce"
import { transform as shopifyTransform } from "./shopify"

// Standard responsive breakpoints used by unpic
const BREAKPOINTS = [640, 750, 828, 960, 1080, 1280, 1668, 1920, 2048, 2560, 3200, 3840, 4480, 5120, 6016]

function getTransformer(url: string) {
  if (url.includes("shopify")) {
    return shopifyTransform
  }
  if (url.includes("bigcommerce")) {
    return bcTransform
  }
  // TODO nailgun image support
}

function generateSrcset(
  src: string,
  transformer: (url: string, ops: Operations) => string,
  layout: string,
  width?: number,
  height?: number,
  aspectRatio?: number,
  crop?: string
): string {
  const operations = { crop } as Operations

  if (layout === "fixed") {
    // Fixed layout: only generate 1x and 2x versions
    const srcset = [
      `${transformer(src, { ...operations, width, height })} ${width}w`,
      `${transformer(src, { ...operations, width: width! * 2, height: height! * 2 })} ${width! * 2}w`
    ]
    return srcset.join(",\n")
  }

  if (layout === "fullWidth") {
    // Full width: generate for all breakpoints without height constraint
    const srcset = BREAKPOINTS.map(bp => {
      return `${transformer(src, { ...operations, width: bp })} ${bp}w`
    })
    return srcset.join(",\n")
  }

  // Constrained layout: generate responsive variants up to max width
  const maxWidth = width || 800
  const applicableBreakpoints = BREAKPOINTS.filter(bp => bp <= maxWidth * 2) // Include up to 2x for high DPI

  // Always include the original size even if not in breakpoints
  if (!applicableBreakpoints.includes(maxWidth)) {
    applicableBreakpoints.push(maxWidth)
    applicableBreakpoints.sort((a, b) => a - b)
  }

  const srcset = applicableBreakpoints.map(bp => {
    let bpHeight: number | undefined
    if (height) {
      bpHeight = Math.round((bp / maxWidth) * height)
    } else if (aspectRatio) {
      bpHeight = Math.round(bp / aspectRatio)
    }

    return `${transformer(src, { ...operations, width: bp, height: bpHeight })} ${bp}w`
  })

  return srcset.join(",\n")
}

function generateSizes(layout: string, width?: number): string {
  if (layout === "fixed") {
    return `${width}px`
  }

  if (layout === "fullWidth") {
    return "100vw"
  }

  // Constrained layout
  if (width) {
    return `(min-width: ${width}px) ${width}px, 100vw`
  }

  return "100vw"
}

function generateStyles(layout: string, width?: number, height?: number, aspectRatio?: number): CSSStyleDeclaration {
  const style = {} as CSSStyleDeclaration

  // Common styles
  style.objectFit = "cover"

  if (layout === "fixed") {
    style.width = `${width}px`
    style.height = `${height}px`
  } else if (layout === "constrained") {
    style.width = "100%"
    if (width) {
      style.maxWidth = `${width}px`
    }
    if (height) {
      style.maxHeight = `${height}px`
    } else if (width && aspectRatio) {
      style.maxHeight = `${Math.round(width / aspectRatio)}px`
    }

    if (aspectRatio) {
      style.aspectRatio = aspectRatio.toString()
    } else if (width && height) {
      style.aspectRatio = (width / height).toString()
    }
  } else if (layout === "fullWidth") {
    style.width = "100%"
  }

  return style
}

export function transform({ crop, ...props }: ImageProps): TransformResult {
  const { src, width, height, aspectRatio, layout = "constrained", sizes: customSizes, alt } = props
  const transformer = getTransformer(src)

  // If no transformer is found, return minimal result
  if (!transformer) {
    return {
      src,
      width,
      height,
      loading: "lazy",
      decoding: "async",
      style: {} as CSSStyleDeclaration,
      ...(alt && { alt })
    }
  }

  // Calculate dimensions
  let finalWidth = width
  let finalHeight = height

  if (aspectRatio) {
    if (width && !height) {
      finalHeight = Math.round(width / aspectRatio)
    } else if (height && !width) {
      finalWidth = Math.round(height * aspectRatio)
    }
  }

  // Generate the main src
  const mainSrc = transformer(src, { width: finalWidth, height: finalHeight, crop })

  // Generate srcset
  const srcset = generateSrcset(src, transformer, layout, finalWidth, finalHeight, aspectRatio, crop)

  // Generate sizes attribute
  const sizes = customSizes || generateSizes(layout, finalWidth)

  // Generate styles
  const style = generateStyles(layout, finalWidth, finalHeight, aspectRatio)

  const result: TransformResult = {
    src: mainSrc,
    srcset,
    sizes,
    loading: "lazy",
    decoding: "async",
    style,
    ...(alt && { alt })
  }

  // Add width/height attributes for fixed layout
  if (layout === "fixed") {
    result.width = finalWidth
    result.height = finalHeight
  }

  return result
}
