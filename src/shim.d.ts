interface Window {
  Nosto?: {
    addSkuToCart?: import("@nosto/nosto-js").addSkuToCart
    migrateToShopifyMarket?: import("./shopify").MigrateToShopifyMarket
  }
  Shopify?: {
    designMode?: boolean
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
