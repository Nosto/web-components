import { snakeToCamelCase } from "./snakeToCamelCase"

export function toCamelCase<T>(context: T): T {
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
