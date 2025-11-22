import { createShopifyUrl } from "@/shopify/createShopifyUrl"

export function getApiUrl() {
  return createShopifyUrl(`/api/2025-10/graphql.json`)
}
