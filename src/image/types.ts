import type { CoreImageAttributes, Layout, Operations, UnpicBaseImageProps } from "@unpic/core/base"

export type Crop = "center" | "top" | "left" | "right" | "bottom"

export type BaseTransformerProps = {
  imageUrl: string
  width?: string | number
  height?: string | number
}

export type Provider = "shopify" | "bigcommerce"

export type ShopifyUrlGroups = {
  name: string
  dimen?: string
  crop?: Crop
  format: string
  params?: string
}

export type ShopifyTransformerProps = BaseTransformerProps & {
  crop?: Crop
  aspectRatio?: number
}

export type Dimension = {
  width?: string
  height?: string
}

export type BigCommerceUrlGroups = {
  prefix: string
  suffix: string
  productId: string
  imageId: string
  format: string
  params?: string
  width: string
  height: string
}

export type NostoImageProps = {
  src: string
  width?: number
  height?: number
  aspectRatio?: number
  layout?: Layout
  crop?: Crop
}

export type BaseImagePropsType = UnpicBaseImageProps<Operations, unknown, CoreImageAttributes<unknown>>
