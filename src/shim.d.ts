interface Window {
  Nosto?: {
    addSkuToCart?: import("@nosto/nosto-js").addSkuToCart
    migrateToShopifyMarket?: import("./shopify").MigrateToShopifyMarket
  }
  Swiper?: typeof import("swiper").default
}

declare module "https://cdn.jsdelivr.net/npm/swiper@latest/modules/navigation.mjs" {
  export default typeof import("swiper/modules").default
}

declare module "https://cdn.jsdelivr.net/npm/swiper@latest/swiper.mjs" {
  export default typeof import("swiper").default
}