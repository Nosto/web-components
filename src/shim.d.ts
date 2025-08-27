interface Window {
  Nosto?: {
    addSkuToCart?: import("@nosto/nosto-js").addSkuToCart
    migrateToShopifyMarket?: import("./shopify").MigrateToShopifyMarket
  }
}

declare module "https://cdn.jsdelivr.net/npm/swiper@latest/modules/navigation.mjs" {
  export default typeof import("swiper/modules").default
}

declare module "https://cdn.jsdelivr.net/npm/swiper@latest/swiper.mjs" {
  export default typeof import("swiper").default
}

declare module "*.css" {
  const content: string
  export default content
}
