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

function snakeToCamelCase(str: string) {
  return str.replace(/_([a-z])/g, (_, l) => l.toUpperCase())
}

function toCamelCase<T>(context: T): T {
  if (Array.isArray(context)) {
    return context.map(toCamelCase) as T
  } else if (context && typeof context === "object") {
    return Object.fromEntries(
      Object.entries(context).map(([key, value]) => {
        return [snakeToCamelCase(key), toCamelCase(value)]
      })
    ) as T
  }
  return context
}

export function getContext(context: object) {
  return {
    ...toCamelCase(context),
    thumb,
    unpic
  }
}
