interface Window {
  Nosto?: {
    addSkuToCart?: import("@nosto/nosto-js").addSkuToCart
    migrateToShopifyMarket?: import("./shopify").MigrateToShopifyMarket
  }
  Shopify?: {
    routes?: {
      root?: string
    }
    currency?: {
      active?: string
    }
    locale?: string
  }
}

declare module "*.css" {
  const content: string
  export default content
}

declare module "*.css?raw" {
  const content: string
  export default content
}
