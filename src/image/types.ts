import type { CoreImageAttributes, Layout, Operations, UnpicBaseImageProps } from "@unpic/core/base"
import type { ShopifyOperations } from "unpic/providers/shopify"

export type Crop = Exclude<ShopifyOperations["crop"], undefined>

export type NostoImageProps = {
  src: string
  width?: number
  height?: number
  aspectRatio?: number
  layout?: Layout
  crop?: Crop
}

export type BaseImageProps = UnpicBaseImageProps<Operations, unknown, CoreImageAttributes<CSSStyleDeclaration>>
