import { ApiType, shopifyApiProject } from "@shopify/api-codegen-preset"

export default {
  schema: "https://shopify.dev/storefront-graphql-direct-proxy",
  projects: {
    default: shopifyApiProject({
      apiType: ApiType.Storefront,
      apiVersion: "2025-10",
      outputDir: "./src/shopify/graphql/generated",
      documents: ["./src/**/*.graphql"],
      enumsAsConst: true
    })
  }
}
