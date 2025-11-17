import type { CodegenConfig } from "@graphql-codegen/cli"
import { shopifyApiProject, ApiType } from "@shopify/api-codegen-preset"

/**
 * GraphQL Codegen Configuration
 * 
 * Note: This configuration is preserved for documentation purposes.
 * In production environments with network access, running `npm run codegen` 
 * would generate types from the Shopify Storefront API schema.
 * 
 * Due to network restrictions in some environments, the types in 
 * src/shopify/generated are pre-generated and maintained manually
 * following the same structure that @shopify/api-codegen-preset would produce.
 */
const config: CodegenConfig = {
  overwrite: true,
  ...shopifyApiProject({
    apiType: ApiType.Storefront,
    apiVersion: "2025-10",
    documents: ["./src/shopify/graphql/**/*.graphql"],
    outputDir: "./src/shopify/generated"
  })
}

export default config
