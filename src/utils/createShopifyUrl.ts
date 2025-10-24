export function createShopifyUrl(url: string) {
  const root = new URL(window.Shopify?.routes?.root ?? "/", window.location.href).href
  return join(root, url)
}

function join(base: string, url: string) {
  if (url.startsWith("/")) {
    url = url.slice(1)
  }
  return new URL(url, base)
}
