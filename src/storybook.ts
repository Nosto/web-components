import { getExampleHandles } from "./shopify/graphql/getExampleHandles"

/**
 * Updates the global Shopify configuration for Storybook stories
 * @param rootUrl - The Shopify store root URL
 */
export function updateShopifyRoot(rootUrl: string) {
  window.Shopify = {
    routes: {
      root: rootUrl
    }
  }
}

export const exampleHandlesLoader = async (context: { args: { root?: string; products?: number } }) => {
  const { products, root: argRoot } = context.args
  if (!argRoot || !argRoot.match(/^https?:\/\//)) {
    return { handles: [] }
  }
  try {
    new URL(argRoot)
    const handles = await getExampleHandles(argRoot, products)
    return { handles }
  } catch (error) {
    console.warn("Error fetching example handles:", error)
    return { handles: [] }
  }
}
