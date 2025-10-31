import { transformBaseImageProps } from "@unpic/core/base"
import type { BaseImageProps, ImageProps } from "./types"
import { transform as bcTransform } from "./bigcommerce"
import { transform as shopifyTransform } from "./shopify"

function getTransformer(url: string) {
  if (url.includes("shopify")) {
    return shopifyTransform
  }
  if (url.includes("bigcommerce")) {
    return bcTransform
  }
}

export function transform({ crop, ...props }: ImageProps) {
  const transformer = getTransformer(props.src)!
  const imageProps = {
    ...props,
    transformer,
    operations: {
      crop
    }
  } as BaseImageProps
  return transformBaseImageProps(imageProps)
}
