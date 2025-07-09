import type { Operations } from "unpic"
import { transform as bcTransform } from "../components/NostoImage/bigcommerce"
import { transform as shopifyTransform } from "../components/NostoImage/shopify"
import { transform as unpic } from "../components/NostoImage/transform"

function thumb(url: string, operations: Operations) {
  if (url.includes("shopify")) {
    return shopifyTransform(url, operations)
  }
  if (url.includes("bigcommerce")) {
    return bcTransform(url, operations)
  }
  return url
}

export function getContext(context: object) {
  return {
    ...context,
    thumb,
    unpic
  }
}
