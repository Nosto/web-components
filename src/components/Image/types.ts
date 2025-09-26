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
}

export type BaseImageProps = UnpicBaseImageProps<Operations, unknown, CoreImageAttributes<CSSStyleDeclaration>>

export interface NumberArrayConstructor {
  (value: string): number[] | undefined
}
export const NumberArray: NumberArrayConstructor = (value: string) => {
  try {
    const arr = JSON.parse(value)
    if (Array.isArray(arr) && arr.every(v => typeof v === "number")) return arr
  } catch {}
  const arr = value.split(",").map(Number)
  if (arr.length === 0 || arr.some(v => isNaN(v))) return undefined
  return arr
}
