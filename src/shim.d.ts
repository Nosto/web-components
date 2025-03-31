interface Window {
  Nosto?: {
    shopifyScript?: boolean
    bigCommerceScript?: boolean
    addSkuToCart?: import("@nosto/nosto-js").addSkuToCart
    migrateToShopifyMarket?: import("./shopify").MigrateToShopifyMarket
  }
  Shopify?: unknown
  Swiper?: typeof import("swiper").default
  Liquid?: typeof import("liquidjs")
  Handlebars?: typeof import("handlebars")
}

declare module "https://cdn.jsdelivr.net/npm/swiper@latest/swiper.mjs" {
  export default typeof import("swiper").default
}

declare module "https://cdn.jsdelivr.net/npm/liquidjs@latest/dist/liquid.browser.esm.js" {
  export const Liquid = (typeof import("liquidjs")).Liquid
}
