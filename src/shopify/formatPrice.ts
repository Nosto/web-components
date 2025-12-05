import { ShopifyMoney } from "./graphql/types"

export function formatPrice({ amount, currencyCode }: ShopifyMoney) {
  return new Intl.NumberFormat(window.Shopify?.locale ?? "en-US", {
    style: "currency",
    currency: currencyCode
  }).format(+amount)
}
