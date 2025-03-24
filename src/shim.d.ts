interface Window {
  Nosto?: {
    addSkuToCart?: import("./shopify").AddSkuToCart
    migrateToShopifyMarket?: import("./shopify").MigrateToShopifyMarket
  }
  Swiper?: typeof import("swiper")
}
