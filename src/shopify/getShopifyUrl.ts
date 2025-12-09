export function getShopifyUrl(url: string) {
  const root = resolveRootUrl()
  if (root.endsWith("/") && url.startsWith("/")) {
    return new URL(root + url.slice(1))
  }
  return new URL(root + url)
}

let shopifyShop: string | null = null

export function setShopifyShop(shop: string) {
  shopifyShop = shop
}

export function resetShopifyShop() {
  shopifyShop = null
}

// Resolves the root URL of the Shopify store and excludes any query parameters.
function resolveRootUrl() {
  const root = window.Shopify?.routes?.root ?? "/"
  if (shopifyShop) {
    return `https://${shopifyShop + root}`
  }
  return window.location.origin + root
}
