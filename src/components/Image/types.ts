import type { CoreImageAttributes, Layout, Operations, UnpicBaseImageProps } from "@unpic/core/base"
import type { ShopifyOperations } from "unpic/providers/shopify"

export type Crop = Exclude<ShopifyOperations["crop"], undefined>

export type ImageProps = {
  src: string
  width?: number
  height?: number
  aspectRatio?: number
  layout?: Layout
  crop?: Crop
  alt?: string
  sizes?: string
  breakpoints?: number[]
  fetchpriority?: "high" | "low" | "auto"
  loading?: "lazy" | "eager"
}

export type BaseImageProps = UnpicBaseImageProps<Operations, unknown, CoreImageAttributes<CSSStyleDeclaration>>
