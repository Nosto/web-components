import { getExampleHandles } from "./shopify/graphql/getExampleHandles"

export function updateShopifyShop(shop: string) {
  window.Shopify = {
    shop
  }
}

export const exampleHandlesLoader = async (context: { args: { root?: string; count?: number } }) => {
  const { root, count = 12 } = context.args
  try {
    if (!root) {
      return { handles: [] }
    }
    const handles = await getExampleHandles(root)
    return { handles: handles.slice(0, count) }
  } catch (error) {
    console.warn("Error fetching example handles:", error)
    return { handles: [] }
  }
}
