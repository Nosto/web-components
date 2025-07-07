import { transformBaseImageProps } from "@unpic/core/base"
import type { BaseImageProps, NostoImageProps } from "./types"
import { transform as bcTransform } from "./bigcommerce"
import { transform as shopifyTransform } from "./shopify"
import { toCamelCase } from "@/utils"

function getTransformer(url: string) {
  if (url.includes("shopify")) {
    return shopifyTransform
  }
  if (url.includes("bigcommerce")) {
    return bcTransform
  }
  // TODO nailgun image support
}

export function transform({ crop, ...props }: NostoImageProps) {
  const transformer = getTransformer(props.src)!

  const imageProps = {
    ...props,
    transformer,
    operations: {
      crop
    }
  } as BaseImageProps

  const transformedProps = transformBaseImageProps(imageProps)

  const normalizedStyles = Object.fromEntries(
    Object.entries(transformedProps.style || {}).map(([k, v]) => [toCamelCase(k), v])
  ) as unknown as CSSStyleDeclaration

  return {
    ...transformedProps,
    style: normalizedStyles
  }
}
