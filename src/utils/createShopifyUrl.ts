export function createShopifyUrl(url: string) {
  const root = resolveRootUrl()
  if (root.endsWith("/") && url.startsWith("/")) {
    return new URL(root + url.slice(1))
  }
  return new URL(root + url)
}

// Resolves the root URL of the Shopify store and excludes any query parameters.
function resolveRootUrl() {
  const root = window.Shopify?.routes?.root ?? "/"
  return root.match(/^https?:\/\//) ? root : `${window.location.origin}${root}`
}
