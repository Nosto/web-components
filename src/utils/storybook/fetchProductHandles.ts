import { getJSON } from "@/utils/fetch"
import { createShopifyUrl } from "@/utils/createShopifyUrl"

interface ProductHandlesResponse {
  handles: string[]
}

/**
 * Fetches product handles from the store root collections endpoint
 * @param rootUrl The Shopify store root URL
 * @returns Promise resolving to array of product handles (up to 12)
 */
export async function fetchProductHandles(rootUrl?: string): Promise<string[]> {
  try {
    // Update Shopify root if provided
    if (rootUrl) {
      window.Shopify = {
        routes: {
          root: rootUrl
        }
      }
    }

    // Fetch handles from collections/all endpoint with handles view
    const url = createShopifyUrl("collections/all?view=handles.json")
    const response = await getJSON<ProductHandlesResponse>(url.href, { cached: true })

    // Return first 12 handles
    if (response?.handles && Array.isArray(response.handles)) {
      return response.handles.slice(0, 12)
    }

    return []
  } catch (error) {
    console.warn("Failed to fetch product handles:", error)
    return []
  }
}
