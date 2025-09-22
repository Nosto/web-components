interface Window {
  Nosto?: {
    addSkuToCart?: import("@nosto/nosto-js").addSkuToCart
    migrateToShopifyMarket?: import("./shopify").MigrateToShopifyMarket
  }
  Shopify?: {
    routes?: {
      root?: string
    }
  }
}

declare module "*.css" {
  const content: string
  export default content
}
