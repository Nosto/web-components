import type { ShopifyProduct } from "@/shopify/types"
import { toProductId } from "@/shopify/graphql/utils"

export const mockProduct = {
  id: toProductId(7001),
  availableForSale: true,
  title: "Mock Product",
  handle: "mock-product",
  vendor: "Mock Brand",
  onlineStoreUrl: "/products/mock-product",
  images: [
    {
      url: "https://cdn.nosto.com/nosto/7/mock",
      width: 800,
      height: 800
    }
  ],
  price: {
    amount: "10",
    currencyCode: "USD"
  },
  compareAtPrice: {
    amount: "12",
    currencyCode: "USD"
  }
} as ShopifyProduct
