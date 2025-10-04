import { getText } from "@/utils/fetch"
import { createShopifyUrl } from "@/utils/createShopifyUrl"

const fallbackHandles = [
  "awesome-sneakers",
  "good-ol-shoes",
  "old-school-kicks",
  "insane-shoes",
  "vintage-jacket",
  "casual-tshirt",
  "leather-boots",
  "summer-dress",
  "winter-coat",
  "sport-shoes",
  "designer-bag",
  "classic-watch"
]

export async function fetchProductHandles() {
  try {
    const url = createShopifyUrl("collections/all")
    const response = await getText(url.href)

    const parser = new DOMParser()
    const doc = parser.parseFromString(response, "text/html")
    const productLinks = doc.querySelectorAll('a[href*="/products/"]')

    const handles = Array.from(productLinks)
      .map(link => {
        const href = link.getAttribute("href")
        if (href && href.includes("/products/")) {
          const match = href.match(/\/products\/([^/?]+)/)
          return match ? match[1] : null
        }
        return null
      })
      .filter(Boolean)
      .slice(0, 12)

    return handles.length > 0 ? handles : fallbackHandles
  } catch (error) {
    console.warn("Failed to fetch product handles (likely due to CORS), using fallback data:", error)
    return fallbackHandles
  }
}
