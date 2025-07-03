import type { Crop } from "@/types"
import { transformBaseImageProps, type Operations } from "@unpic/core/base"
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

function transformUrl(url: string) {
  const provider = getProvider(url)

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

export function transform(props: NostoImageProps) {
  const { transformer } = transformUrl(props.src) || {}

  const imageProps = {
    ...props,
    transformer,
    options: {
      crop: props.crop
    }
  } as BaseImagePropsType

  const transformedImagePros = transformBaseImageProps(imageProps)

  const sanitizedProps = Object.fromEntries(
    Object.entries(transformedImagePros).filter(([k, v]) => k !== "style" && !!v)
  )

  const sanitizedStyles = Object.fromEntries(
    Object.entries(transformedImagePros.style || {}).map(([k, v]) => [toCamelCase(k), v])
  )

  return {
    props: sanitizedProps,
    style: sanitizedStyles
  }
}
