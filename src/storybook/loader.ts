import { getExampleProducts } from "./shopify/graphql/getExampleProducts"

type Context = {
  args: {
    shopifyShop?: string
    count?: number
  }
}

export async function exampleProductsLoader(context: Context) {
  const { shopifyShop, count = 12 } = context.args
  try {
    if (!shopifyShop) {
      return { products: [] }
    }
    // fetch products with handle and title
    const products = await getExampleProducts(shopifyShop)
    return { products: products.slice(0, count) }
  } catch (error) {
    console.warn("Error fetching example products:", error)
    return { products: [] }
  }
}

export async function exampleHandlesLoader(context: Context) {
  const { products } = await exampleProductsLoader(context)
  return {
    handles: products.map(p => p.handle)
  }
}
