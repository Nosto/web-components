export type Options = {
  width?: number
  height?: number
}

export type ImageProps = {
  src: string
  width?: number
  height?: number
  aspectRatio?: number
  alt?: string
  sizes?: string
  breakpoints?: number[]
}

export type TransformedImageProps = {
  src: string
  srcset?: string
  width?: number
  height?: number
  alt?: string
  sizes?: string
  loading?: string
  decoding?: string
  style: Partial<CSSStyleDeclaration>
}

// Default responsive breakpoints for srcset generation
export const DEFAULT_BREAKPOINTS = [320, 640, 768, 1024, 1280, 1600] as const
