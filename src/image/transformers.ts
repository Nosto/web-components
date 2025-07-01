import { getSrcSet, type Layout, type Operations } from "@unpic/core/base"
import { transformUrl } from "unpic/transform"
import { generateCacheKey, withCache } from "./cache"

type BigCommerceUrlGroups = {
  prefix: string
  suffix: string
  productId: string
  imageId: string
  format: string
  params?: string
}

export type SrcSetType = Parameters<typeof getSrcSet>[0]

export type TransformerType = Pick<SrcSetType, "transformer">

export type Maybe<T> = T | undefined

export type Provider = "shopify" | "bigcommerce"

function getProvider(url: string): Maybe<Provider> {
  if (url.includes("shopify")) {
    return "shopify"
  }
  if (url.includes("bigcommerce")) {
    return "bigcommerce"
  }
  return undefined
}

/* 
from: https://cdn11.bigcommerce.com/s-bo4yyk7o1j/products/15493/images/80390/5SqIsKoR7VMPHGrsnseGPkhhpWHT9tLcY7Uwop7FCMzm5jcxKgU2d7P7zbgqcs8r__09669.1741105378.1280.1280.jpg?c=2
to: https://cdn11.bigcommerce.com/s-bo4yyk7o1j/images/stencil/600x600/products/15493/80390/5SqIsKoR7VMPHGrsnseGPkhhpWHT9tLcY7Uwop7FCMzm5jcxKgU2d7P7zbgqcs8r__09669.1741105378.jpg?c=2
srcset:
https://cdn11.bigcommerce.com/s-bo4yyk7o1j/images/stencil/80w/products/15493/80390/5SqIsKoR7VMPHGrsnseGPkhhpWHT9tLcY7Uwop7FCMzm5jcxKgU2d7P7zbgqcs8r__09669.1741105378.jpg?c=2 80w, 
https://cdn11.bigcommerce.com/s-bo4yyk7o1j/images/stencil/160w/products/15493/80390/5SqIsKoR7VMPHGrsnseGPkhhpWHT9tLcY7Uwop7FCMzm5jcxKgU2d7P7zbgqcs8r__09669.1741105378.jpg?c=2 160w, 
https://cdn11.bigcommerce.com/s-bo4yyk7o1j/images/stencil/320w/products/15493/80390/5SqIsKoR7VMPHGrsnseGPkhhpWHT9tLcY7Uwop7FCMzm5jcxKgU2d7P7zbgqcs8r__09669.1741105378.jpg?c=2 320w, 
https://cdn11.bigcommerce.com/s-bo4yyk7o1j/images/stencil/640w/products/15493/80390/5SqIsKoR7VMPHGrsnseGPkhhpWHT9tLcY7Uwop7FCMzm5jcxKgU2d7P7zbgqcs8r__09669.1741105378.jpg?c=2 640w, 
https://cdn11.bigcommerce.com/s-bo4yyk7o1j/images/stencil/960w/products/15493/80390/5SqIsKoR7VMPHGrsnseGPkhhpWHT9tLcY7Uwop7FCMzm5jcxKgU2d7P7zbgqcs8r__09669.1741105378.jpg?c=2 960w, 
https://cdn11.bigcommerce.com/s-bo4yyk7o1j/images/stencil/1280w/products/15493/80390/5SqIsKoR7VMPHGrsnseGPkhhpWHT9tLcY7Uwop7FCMzm5jcxKgU2d7P7zbgqcs8r__09669.1741105378.jpg?c=2 1280w, 
https://cdn11.bigcommerce.com/s-bo4yyk7o1j/images/stencil/1920w/products/15493/80390/5SqIsKoR7VMPHGrsnseGPkhhpWHT9tLcY7Uwop7FCMzm5jcxKgU2d7P7zbgqcs8r__09669.1741105378.jpg?c=2 1920w, 
https://cdn11.bigcommerce.com/s-bo4yyk7o1j/images/stencil/2560w/products/15493/80390/5SqIsKoR7VMPHGrsnseGPkhhpWHT9tLcY7Uwop7FCMzm5jcxKgU2d7P7zbgqcs8r__09669.1741105378.jpg?c=2 2560w
*/
function transformBigCommerceUrl(imageUrl: string, width?: number | string, height?: number | string) {
  const widthInt = width ? parseInt(width as string, 10) : undefined
  const heightInt = height ? parseInt(height as string, 10) : undefined

  const regex =
    /^(?<prefix>https:\/\/[a-z0-9.]+\/[a-z0-9-]+\/)products\/(?<productId>\d+)\/images\/(?<imageId>\d+)(?<suffix>\/[a-zA-Z0-9_-]+\.\d+)(\.\d+){1,2}\.(?<format>.*)(\?(?<params>.*))?$/g

  const match = [...imageUrl.matchAll(regex)]

  if (!match.length) {
    return imageUrl
  }

  const { prefix, suffix, productId, imageId, params, format } = match[0].groups as BigCommerceUrlGroups

  if (heightInt) {
    return `${prefix}images/stencil/${widthInt}x${heightInt}/products/${productId}/${imageId}${suffix}.${format}${params ? `?${params}` : ""}`
  }
  return `${prefix}images/stencil/${widthInt}w/products/${productId}/${imageId}${suffix}.${format}${params ? `?${params}` : ""}`
}

export function useTransformer(url: string, layout: Layout = "constrained"): Required<TransformerType> {
  const provider = getProvider(url)

  return {
    transformer: (src: string | URL, { width, height }: Operations, _options?: unknown) => {
      switch (provider) {
        case "shopify":
          return withCache(
            generateCacheKey(src.toString(), width, height, layout),
            () => transformUrl({ url: src.toString(), width, height, provider: "shopify" }) || src.toString()
          )
        case "bigcommerce":
          return withCache(
            generateCacheKey(src.toString(), width, height, layout),
            () => transformBigCommerceUrl(src.toString(), width!, height) || src.toString()
          )
        default:
          return src.toString()
      }
    }
  }
}
