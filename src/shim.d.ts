interface Window {
  Nosto?: {
    addSkuToCart?: import("@nosto/nosto-js").addSkuToCart
    addMultipleProductsToCart(
      products: { productId: string; skuId: string; quantity: number }[],
      resultId?: string
    ): void
  }
  Shopify?: {
    shop?: string
    routes?: {
      root?: string
    }
    currency?: {
      active?: string
    }
    country?: string
    locale?: string
  }
}

// Navigation API types for browser feature detection
declare const navigation: {
  addEventListener(type: "navigatesuccess", listener: () => void): void
  removeEventListener(type: "navigatesuccess", listener: () => void): void
}

declare module "*.css" {
  const content: string
  export default content
}

declare module "*.css?raw" {
  const content: string
  export default content
}

declare module "*.graphql?raw" {
  const content: string
  export default content
}
