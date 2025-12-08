import { getExampleProducts } from "./shopify/graphql/getExampleProducts"

export function updateShopifyShop(shop: string) {
  window.Shopify = {
    shop
  }
}

export const exampleProductsLoader = async (context: { args: { shopifyShop?: string; count?: number } }) => {
  const { shopifyShop, count = 12 } = context.args
  try {
    if (!shopifyShop) {
      return { handles: [] }
    }
    // fetch products with handle and title
    const products = await getExampleProducts(shopifyShop)
    return { handles: products.slice(0, count) }
  } catch (error) {
    console.warn("Error fetching example handles:", error)
    return { handles: [] }
  }
}

/**
 * @deprecated Use exampleProductsLoader instead to get both handle and title
 */
export const exampleHandlesLoader = async (context: { args: { shopifyShop?: string; count?: number } }) => {
  const { shopifyShop, count = 12 } = context.args
  try {
    if (!shopifyShop) {
      return { handles: [] }
    }
    // fetch products and extract handles only
    const products = await getExampleProducts(shopifyShop)
    return { handles: products.slice(0, count).map(p => p.handle) }
  } catch (error) {
    console.warn("Error fetching example handles:", error)
    return { handles: [] }
  }
}
