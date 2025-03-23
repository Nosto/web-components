interface Window {
  Nosto?: {
    addSkuToCart?: import("./shopify").AddSkuToCart
    migrateToShopifyMarket?: import("./shopify").MigrateToShopifyMarket
  }

  Handlebars?: typeof import("handlebars")
  Liquid?: typeof import("liquidjs")
}
