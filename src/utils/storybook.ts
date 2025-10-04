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
