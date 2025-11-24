export function createShopifyUrl(url: string) {
  const root = resolveRootUrl()
  if (root.endsWith("/") && url.startsWith("/")) {
    return new URL(root + url.slice(1))
  }
  return new URL(root + url)
}

// Resolves the root URL of the Shopify store and excludes any query parameters.
function resolveRootUrl() {
  if (window.Storybook?.shop) {
    return window.Storybook.shop
  }
  return `${window.location.origin}${window.Shopify?.routes?.root ?? "/"}`
}
