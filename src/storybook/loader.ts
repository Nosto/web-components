import { getExampleHandles } from "./shopify/graphql/getExampleHandles"

export function updateShopifyShop(shop: string) {
  window.Shopify = {
    shop
  }
}

export const exampleHandlesLoader = async (context: { args: { shopifyShop?: string; count?: number } }) => {
  const { shopifyShop, count = 12 } = context.args
  try {
    if (!shopifyShop) {
      return { handles: [] }
    }
    // fetch handles with titles
    const products = await getExampleHandles(shopifyShop)
    return { handles: products.slice(0, count) }
  } catch (error) {
    console.warn("Error fetching example handles:", error)
    return { handles: [] }
  }
}
