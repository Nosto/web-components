import { getShopifyUrl } from "@/shopify/getShopifyUrl"
import { apiVersion } from "./apiVersion"

export function getApiUrl() {
  return getShopifyUrl(`/api/${apiVersion}/graphql.json`)
}
