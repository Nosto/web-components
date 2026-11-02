import { ApiType, shopifyApiProject } from "@shopify/api-codegen-preset"

process.loadEnvFile()

export default {
  schema: "https://shopify.dev/storefront-graphql-direct-proxy",
  projects: {
    default: shopifyApiProject({
      apiType: ApiType.Storefront,
      apiVersion: process.env.VITE_SHOPIFY_API_VERSION,
      outputDir: "./src/shopify/graphql/generated",
      documents: ["./src/**/*.graphql"],
      enumsAsConst: true
    })
  }
}
