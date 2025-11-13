import type { CodegenConfig } from "@graphql-codegen/cli"
import { shopifyApiProject, ApiType } from "@shopify/api-codegen-preset"

const config: CodegenConfig = {
  overwrite: true,
  ...shopifyApiProject({
    apiType: ApiType.Storefront,
    apiVersion: "2025-10",
    documents: ["./src/**/*.{js,ts,jsx,tsx,graphql}"],
    outputDir: "./src/types"
  })
}

export default config
