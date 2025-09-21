import { toCamelCase } from "@/utils/toCamelCase"

export function getContext(context: object) {
  return toCamelCase(context)
}
