export type Layout = "fixed" | "constrained" | "fullWidth"

export type Crop = "center" | "left" | "right" | "top" | "bottom"

export type ImageProps = {
  src: string
  width?: number
  height?: number
  aspectRatio?: number
  layout?: Layout
  crop?: Crop
  alt?: string
  sizes?: string
}

export type Operations = {
  width?: number
  height?: number
  crop?: Crop
}

export type TransformResult = {
  src: string
  srcset?: string
  sizes?: string
  loading?: string
  decoding?: string
  width?: number
  height?: number
  alt?: string
  style: CSSStyleDeclaration
}
