import { getExampleHandles } from "./shopify/graphql/getExampleHandles"

export function updateShopifyShop(shop: string) {
  window.Shopify = {
    shop
  }
}

export const exampleHandlesLoader = async (context: { args: { root?: string; products?: number } }) => {
  const { products, root: argRoot } = context.args
  try {
    if (!argRoot) {
      return { handles: [] }
    }
    const handles = await getExampleHandles(argRoot, products)
    return { handles }
  } catch (error) {
    console.warn("Error fetching example handles:", error)
    return { handles: [] }
  }
}
