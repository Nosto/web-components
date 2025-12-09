import { getShopifyUrl } from "@/shopify/getShopifyUrl"

export function getApiUrl() {
  return getShopifyUrl(`/api/2025-10/graphql.json`)
}
