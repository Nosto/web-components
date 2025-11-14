import { initGraphQLTada } from "gql.tada"
import type { introspection } from "./shopify-storefront.introspection"

export const graphql = initGraphQLTada<{
  introspection: introspection
}>()

// Re-export for convenience
export type { FragmentOf, ResultOf, VariablesOf } from "gql.tada"
