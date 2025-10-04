import { getText } from "@/utils/fetch"
import { createShopifyUrl } from "@/utils/createShopifyUrl"

export async function fetchProductHandles() {
  const url = createShopifyUrl("collections/all")
  const response = await getText(url.href)

  const parser = new DOMParser()
  const doc = parser.parseFromString(response, "text/html")
  const productLinks = doc.querySelectorAll('a[href*="/products/"]')

  return Array.from(productLinks)
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
}
