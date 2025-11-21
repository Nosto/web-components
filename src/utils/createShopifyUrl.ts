export function createShopifyUrl(url: string) {
  const root = resolveRootUrl()
  if (root.endsWith("/") && url.startsWith("/")) {
    return new URL(root + url.slice(1))
  }
  return new URL(root + url)
}

// Resolves the root URL of the Shopify store and excludes any query parameters.
function resolveRootUrl() {
  // Specific clause to handle design mode (Theme Editor mode) in Shopify admin
  // Shopify adds oseid parameter on href/toString invocation on URL interface
  if (window.Shopify?.designMode) {
    return `${window.location.origin}${window.Shopify?.routes?.root}`
  }
  return new URL(window.Shopify?.routes?.root ?? "/", window.location.origin).href
}
