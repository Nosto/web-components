# Generated Shopify GraphQL Types

This directory contains TypeScript types for the Shopify Storefront GraphQL API (version 2025-10).

## About These Types

These types are structured to match the output of `@shopify/api-codegen-preset`, which is a code generation tool that automatically creates TypeScript types from GraphQL schemas and operations.

## Files

- **`storefront.types.d.ts`** - Base type definitions from the Shopify Storefront API schema
- **`storefront.generated.d.ts`** - Operation-specific types generated from GraphQL queries in `src/shopify/graphql/`
- **`index.ts`** - Unified exports providing backward-compatible type aliases

## Regeneration

In environments with network access to `shopify.dev`, you can regenerate these types by running:

```bash
npm run codegen
```

This will use the configuration in `codegen.ts` to fetch the latest schema and regenerate types based on your GraphQL queries.

## Maintenance

When updating GraphQL queries in `src/shopify/graphql/`:
1. Update the corresponding types in `storefront.generated.d.ts` to match
2. Ensure the types align with the Shopify Storefront API schema
3. Maintain backward compatibility with existing code using these types

## Type Safety Benefits

- **Auto-completion**: IDEs provide accurate autocomplete for GraphQL response data
- **Type checking**: TypeScript catches type mismatches at compile time
- **Schema sync**: Types reflect the actual Shopify API structure
- **Refactoring safety**: Changes to queries trigger type errors in consuming code
