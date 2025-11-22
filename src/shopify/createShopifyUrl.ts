export function createShopifyUrl(url: string) {
  const root = rootOverride ?? resolveRootUrl()
  if (root.endsWith("/") && url.startsWith("/")) {
    return new URL(root + url.slice(1))
  }
  return new URL(root + url)
}

let rootOverride: string | null = null

export function setRootOverride(newRoot: string) {
  rootOverride = newRoot
}

// Resolves the root URL of the Shopify store and excludes any query parameters.
function resolveRootUrl() {
  return `${window.location.origin}${window.Shopify?.routes?.root ?? "/"}`
}
