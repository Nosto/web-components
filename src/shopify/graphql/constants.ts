import { createShopifyUrl } from "@/utils/createShopifyUrl"

export function getApiUrl() {
  return createShopifyUrl(`/api/2025-10/graphql.json`)
}
