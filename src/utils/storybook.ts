import { getExampleHandles, clearExampleHandlesCache } from "@/shopify/graphql/getExampleHandles"

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

/**
 * Centralized loader for fetching example product handles in Storybook stories
 * @param context - Storybook context containing args
 * @param context.args.root - Optional Shopify store root URL
 * @param context.args.products - Optional number of products to fetch
 * @param defaultRoot - Default root URL to use if not provided in args
 * @returns Object containing the fetched handles
 */
export async function exampleHandlesLoader(
  context: { args: { root?: string; products?: number } },
  defaultRoot: string
) {
  const { products, root: argRoot } = context.args
  const root = argRoot || defaultRoot

  try {
    const handles = await getExampleHandles(root, products)

    // Clear cache if result is empty or invalid
    if (!handles || handles.length === 0) {
      clearExampleHandlesCache()
    }

    return { handles }
  } catch (error) {
    // Clear cache on error to prevent poisoned cache
    clearExampleHandlesCache()
    throw error
  }
}
