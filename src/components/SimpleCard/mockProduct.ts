import type { ShopifyProduct } from "@/shopify/graphql/types"
import { toProductId } from "@/shopify/graphql/utils"

export const mockProduct = {
  id: toProductId(7001),
  availableForSale: true,
  title: "Mock Product",
  vendor: "Mock Brand",
  onlineStoreUrl: "/products/mock-product",
  images: [
    {
      url: "https://cdn.nosto.com/nosto/7/mock",
      altText: "Mock Product Image",
      width: 800,
      height: 800,
      thumbhash: null
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
