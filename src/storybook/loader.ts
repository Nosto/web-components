import { getExampleHandles } from "./shopify/graphql/getExampleHandles"

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function updateShopifyShop(shop: string) {
  window.Shopify = {
    shop
  }
}

export const exampleHandlesLoader = async (context: { args: { shopifyShop?: string; count?: number } }) => {
  const { shopifyShop, count = 12 } = context.args
  try {
    const shopifyShopUrl = `https://${shopifyShop}/`
    if (!shopifyShop || !isValidUrl(shopifyShopUrl)) {
      return { handles: [] }
    }
    // fetch handles
    const handles = await getExampleHandles(shopifyShopUrl)
    return { handles: handles.slice(0, count) }
  } catch (error) {
    console.warn("Error fetching example handles:", error)
    return { handles: [] }
  }
}
