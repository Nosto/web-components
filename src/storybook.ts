import { getExampleHandles } from "./shopify/graphql/getExampleHandles"
export { setRootOverride as updateShopifyRoot } from "./utils/createShopifyUrl"

export const exampleHandlesLoader = async (context: { args: { root?: string; products?: number } }) => {
  const { products, root: argRoot } = context.args
  try {
    if (!argRoot) {
      return { handles: [] }
    }
    // make sure argRoot is a valid URL
    new URL(argRoot)
    // fetch handles
    const handles = await getExampleHandles(argRoot, products)
    return { handles }
  } catch (error) {
    console.warn("Error fetching example handles:", error)
    return { handles: [] }
  }
}
