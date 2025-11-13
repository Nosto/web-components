# Nosto Web Components

This repository contains a collection of custom elements designed to integrate Nosto's personalization and e-commerce solutions into various web platforms.

## Usage

Usage options for this library are documented [here](https://docs.nosto.com/techdocs/apis/frontend/oss/web-components/loading-web-components)

## Components

This package provides the following custom elements:

### Store level templating

| Component       | Tag Name                 | Description                                            | Notes        |
| --------------- | ------------------------ | ------------------------------------------------------ | ------------ |
| Campaign        | `nosto-campaign`         | Campaign rendering and product recommendation display  |              |           
| Control         | `nosto-control`          | Conditional content rendering based on user segments   |              |
| Popup           | `nosto-popup`            | Popup content with dialog and ribbon slots             |              |
| SectionCampaign | `nosto-section-campaign` | Campaign rendering using the Section Rendering API     | Shopify only |

### Campaign level templating

| Component       | Tag Name                 | Description                                     | Notes        |
| --------------- | ------------------------ | ----------------------------------------------- | ------------ |
| DynamicCard     | `nosto-dynamic-card`     | Dynamic product card templating                 | Shopify only |
| Image           | `nosto-image`            | Progressive image enhancement with optimization |              |
| Product         | `nosto-product`          | Product interaction and cart management         |              |
| SimpleCard      | `nosto-simple-card`      | Simple product card templating                  | Shopify only |
| SkuOptions      | `nosto-sku-options`      | Product variant and SKU selection interface     |              |
| VariantSelector | `nosto-variant-selector` | Product variant options as clickable pills      | Shopify only |

## Documentation

Read our [Techdocs](https://docs.nosto.com/techdocs/apis/frontend/oss/web-components) for more information on how to use these components.

[Library TypeDoc page](https://nosto.github.io/web-components) includes detailed library documentation.

[Interactive Storybook](https://nosto.github.io/web-components/storybook/) provides live examples and documentation for each component.

## Development

### GraphQL Type Generation

This project uses [@shopify/api-codegen-preset](https://github.com/Shopify/shopify-app-js/tree/main/packages/api-clients/api-codegen-preset) to automatically generate TypeScript types from Shopify's Storefront API schema.

#### Generating Types

To regenerate GraphQL types after modifying queries or updating the API version:

```bash
npm run codegen
```

This command:
- Fetches the latest Shopify Storefront API schema (version 2025-10)
- Scans all GraphQL queries in `src/**/*.graphql` files
- Generates TypeScript types in `src/types/`:
  - `storefront.types.d.ts` - Base Shopify API types
  - `storefront.generated.d.ts` - Query-specific types
  - `storefront-2025-10.schema.json` - Schema introspection cache

#### Updating API Version

To use a different Shopify API version:

1. Update the `apiVersion` in `codegen.ts`
2. Update the API version in `src/shopify/graphql/constants.ts`
3. Run `npm run codegen` to regenerate types

#### CI/CD Integration

The CI pipeline automatically runs `npm run codegen` before builds to ensure types are up-to-date with the schema.
