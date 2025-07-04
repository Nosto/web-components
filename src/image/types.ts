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

type CamelToKebab<S extends string> = S extends `${infer T}${infer U}`
  ? T extends Lowercase<T>
    ? `${T}${CamelToKebab<U>}`
    : `-${Lowercase<T>}${CamelToKebab<U>}`
  : S

type ExcludeFunctions<T> = T extends (...args: string[] | undefined[] | null[] | unknown[]) => unknown ? never : T

export type StyleAttributes = {
  [K in keyof CSSStyleDeclaration as CSSStyleDeclaration[ExcludeFunctions<K>] extends string
    ? CamelToKebab<K & string>
    : never]: CSSStyleDeclaration[K]
}

export type BaseImagePropsType = UnpicBaseImageProps<Operations, unknown, CoreImageAttributes<StyleAttributes>>
