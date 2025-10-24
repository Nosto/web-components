export function createShopifyUrl(url: string) {
  const root = new URL(window.Shopify?.routes?.root ?? "/", window.location.href).href
    if (root.endsWith("/") && url.startsWith("/")) {
    return new URL(root + url.slice(1))
  }
  return new URL(root + url)
}
