import type { Crop, StyleAttributes } from "./types"
import { transformBaseImageProps, type CoreImageAttributes, type Operations } from "@unpic/core/base"
import type { BaseImagePropsType, NostoImageProps, Provider } from "./types"
import type { Maybe } from "@nosto/nosto-js/client"
import { transform as bcTransform } from "./bigcommerce"
import { transform as shopifyTransform } from "./shopify"
import { toCamelCase } from "@/utils"

function getProvider(url: string): Maybe<Provider> {
  if (url.includes("shopify")) {
    return "shopify"
  }
  if (url.includes("bigcommerce")) {
    return "bigcommerce"
  }
  return undefined
}

function transformUrl(provider: string | undefined) {
  switch (provider) {
    case "shopify":
      return {
        transformer: (src: string | URL, { width, height }: Operations, options?: { crop?: Crop }) => {
          return shopifyTransform({ imageUrl: src.toString(), width, height, ...(options || {}) }) || src.toString()
        }
      }
    case "bigcommerce":
      return {
        transformer: (src: string | URL, { width, height }: Operations, options?: unknown) => {
          return bcTransform({ imageUrl: src.toString(), width, height, ...(options || {}) }) || src.toString()
        }
      }
  }
}

export default function transform(props: NostoImageProps) {
  const provider = getProvider(props.src)
  const { transformer } = transformUrl(provider) || {}

  const imageProps = {
    ...props,
    transformer,
    ...(provider === "shopify" && {
      options: {
        crop: props.crop
      }
    })
  } as BaseImagePropsType

  const transformedImagePros = transformBaseImageProps<Operations, unknown, CoreImageAttributes<StyleAttributes>>(
    imageProps
  )

  const sanitizedProps = Object.fromEntries(
    Object.entries(transformedImagePros).filter(([k, v]) => k !== "style" && !!v)
  )

  const sanitizedStyles = Object.fromEntries(
    Object.entries(transformedImagePros.style || {}).map(([k, v]) => [toCamelCase(k), v])
  ) as unknown as CSSStyleDeclaration

  return {
    props: sanitizedProps,
    style: sanitizedStyles
  }
}
