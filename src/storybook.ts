import { getExampleHandles } from "./shopify/graphql/storybook/getExampleHandles"
export { setRootOverride as updateShopifyRoot } from "./utils/createShopifyUrl"

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const exampleHandlesLoader = async (context: { args: { shopBaseUrl?: string; products?: number } }) => {
  const { shopBaseUrl, products = 12 } = context.args
  try {
    if (!shopBaseUrl || !isValidUrl(shopBaseUrl)) {
      return { handles: [] }
    }
    // make sure argRoot is a valid URL
    new URL(shopBaseUrl)
    // fetch handles
    const normalizedUrl = shopBaseUrl.endsWith("/") ? shopBaseUrl : shopBaseUrl + "/"
    const handles = await getExampleHandles(normalizedUrl)
    return { handles: handles.slice(0, products) }
  } catch (error) {
    console.warn("Error fetching example handles:", error)
    return { handles: [] }
  }
}
