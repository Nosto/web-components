export function createShopifyUrl(url: string) {
  const root = window.Shopify?.routes?.root ?? "/"
  return new URL(`${root}${url}`, window.location.href)
}
