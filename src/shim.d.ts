interface Window {
  Nosto?: {
    addSkuToCart?: import("./shopify").AddSkuToCart
    migrateToShopifyMarket?: import("./shopify").MigrateToShopifyMarket
  }

  Liquid?: typeof import("liquidjs")
}
