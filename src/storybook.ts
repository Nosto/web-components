import { getExampleHandles } from "./shopify/graphql/storybook/getExampleHandles"

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

export const exampleHandlesLoader = async (context: { args: { shopBaseUrl?: string; count?: number } }) => {
  const { shopBaseUrl, count = 12 } = context.args
  try {
    if (!shopBaseUrl || !isValidUrl(shopBaseUrl)) {
      return { handles: [] }
    }
    // make sure argRoot is a valid URL
    new URL(shopBaseUrl)
    // fetch handles
    const normalizedUrl = shopBaseUrl.endsWith("/") ? shopBaseUrl : shopBaseUrl + "/"
    const handles = await getExampleHandles(normalizedUrl)
    return { handles: handles.slice(0, count) }
  } catch (error) {
    console.warn("Error fetching example handles:", error)
    return { handles: [] }
  }
}
