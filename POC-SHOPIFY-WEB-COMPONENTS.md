# POC: Shopify Storefront Web Components

## Overview

This POC demonstrates the use of Shopify's native Storefront Web Components as an alternative to Nosto's custom web components for product card and variant selector functionality.

## Files Created

1. **SimpleCard POC Story**: `src/components/SimpleCard/SimpleCard-poc-shopify.stories.ts`
   - Demonstrates product cards using Shopify web components
   - Stories: Default (grid), Single Card, With Variant Selector, With All Features

2. **VariantSelector POC Story**: `src/components/VariantSelector/VariantSelector-poc-shopify.stories.ts`
   - Demonstrates variant selection using Shopify web components
   - Stories: Default (grid), Single Product, In Product Card, In Product Card with Add to Cart, Multiple Products, With Shop Pay Button

## Shopify Web Components Used

### Core Components

1. **`<shopify-store>`**
   - Configures the Shopify store connection
   - Attributes: `store-domain`, `public-access-token` (optional), `country`, `language`

2. **`<shopify-context>`**
   - Loads product data from Shopify Storefront API
   - Attributes: `type="product"`, `handle` (product handle)
   - Uses `<template>` child for rendering when data is loaded

3. **`<shopify-variant-selector>`**
   - Renders variant selection UI (dropdowns, swatches, radios)
   - Automatically updates connected components when variant is selected

4. **`<shopify-media>`**
   - Displays product or variant images
   - Attribute: `query` (e.g., `"product.featuredImage"` or `"product.selectedOrFirstAvailableVariant.image"`)

5. **`<shopify-money>`**
   - Displays formatted prices
   - Attribute: `query` (e.g., `"product.priceRange.minVariantPrice"` or `"product.selectedOrFirstAvailableVariant.price"`)

6. **`<shopify-data>`**
   - Displays any product data field
   - Attribute: `query` (e.g., `"product.title"`, `"product.vendor"`)

7. **`<shop-pay-button>`** (optional)
   - Shopify's accelerated checkout button
   - Requires separate script: `https://cdn.shopify.com/shopifycloud/shop-js/modules/v2/loader.pay-button.esm.js`

## Key Differences from Nosto Components

### Nosto Components
```html
<nosto-simple-card
  handle="product-handle"
  image-mode="carousel"
  brand
  discount
  rating="4.2">
</nosto-simple-card>
```

### Shopify Web Components
```html
<shopify-store store-domain="store.myshopify.com"></shopify-store>
<shopify-context type="product" handle="product-handle">
  <template>
    <shopify-media query="product.featuredImage"></shopify-media>
    <shopify-data query="product.title"></shopify-data>
    <shopify-money query="product.priceRange.minVariantPrice"></shopify-money>
  </template>
</shopify-context>
```

## Comparison

### Advantages of Shopify Web Components

1. **Official Support**: Native Shopify components with official documentation and support
2. **Direct API Integration**: Built-in connection to Shopify Storefront API
3. **Automatic Updates**: Stays up-to-date with Shopify platform changes
4. **Standard Compliance**: Uses web standards and modern browser APIs
5. **Flexibility**: Highly composable with granular control over data display
6. **Query-Based**: Direct access to Storefront API data via query attributes

### Advantages of Nosto Components

1. **Higher-Level Abstraction**: Pre-built layouts and features (image carousels, ratings, discounts)
2. **Less Boilerplate**: Single component with attributes vs. nested component structure
3. **Integrated Features**: Built-in support for brand display, discount badges, ratings
4. **Nosto Ecosystem**: Integration with Nosto's personalization and recommendation features
5. **Customization**: More opinionated design patterns for e-commerce
6. **Mock Support**: Built-in mock data for testing and development

### Trade-offs

| Feature | Nosto Components | Shopify Web Components |
|---------|-----------------|------------------------|
| Setup Complexity | Low (single component) | Medium (nested structure) |
| Customization | Medium (attributes) | High (composable) |
| E-commerce Features | Rich (built-in) | Basic (manual) |
| API Integration | Custom | Native Shopify |
| Styling Control | CSS variables | Full CSS control |
| Learning Curve | Low | Medium |
| Bundle Size | Larger (more features) | Smaller (focused) |

## Implementation Notes

### Loading External Scripts

The POC stories load the Shopify web components script via CDN:
```html
<script type="module" src="https://cdn.shopify.com/storefront/web-components.js"></script>
```

**Note**: In the test environment, external CDN resources are blocked for security. In production, these would load normally.

### Data Fetching

Shopify web components automatically fetch product data from the Shopify Storefront API based on:
- Store domain configured in `<shopify-store>`
- Product handle specified in `<shopify-context>`

### Variant Selection

When a variant is selected via `<shopify-variant-selector>`:
1. The component updates its internal state
2. All connected components (`<shopify-media>`, `<shopify-money>`) automatically update
3. Queries like `product.selectedOrFirstAvailableVariant.price` reflect the new selection

## Testing in Storybook

The POC stories are organized under "POC" in the Storybook sidebar:
- POC / SimpleCard with Shopify Web Components
- POC / VariantSelector with Shopify Web Components

Each story demonstrates different layouts and use cases.

### POC Limitations

This is a proof-of-concept implementation intended for evaluation purposes:

1. **Script Loading**: Each story loads the Shopify web components script independently. In production, this would be loaded once at the application level.
2. **Error Handling**: Minimal error handling is implemented. Production code would need proper loading states, error boundaries, and fallback UI.
3. **Fallback Values**: Stories use 'default' as a fallback product handle, which may not exist. Production code would need proper validation.
4. **Data Fetching**: Relies on Storybook's example handles loader. Production would integrate with actual Shopify API or store configuration.

## Recommendations

### When to Use Shopify Web Components

- Building custom Shopify storefronts (headless commerce)
- Need direct integration with Shopify Storefront API
- Want official Shopify support and updates
- Prefer lightweight, composable components
- Building for Shopify-exclusive environments

### When to Use Nosto Components

- Using Nosto's personalization and recommendation features
- Need rich e-commerce features out-of-the-box
- Prefer simpler API with less boilerplate
- Working across multiple e-commerce platforms
- Require built-in features like image carousels, ratings, discounts

## Further Exploration

To fully evaluate Shopify web components:

1. **Test in Production Environment**: Deploy to a real Shopify store to test CDN loading and API integration
2. **Performance Testing**: Measure load times, bundle sizes, and runtime performance
3. **Accessibility Testing**: Verify WCAG compliance and screen reader support
4. **Browser Compatibility**: Test across different browsers and devices
5. **Advanced Features**: Explore Shop Pay integration, metafields, and custom data
6. **Styling Customization**: Test CSS customization and theming capabilities

## Resources

- [Shopify Storefront Web Components Documentation](https://shopify.dev/docs/api/storefront-web-components)
- [Shopify Web Components Playground](https://webcomponents.shopify.dev/playground)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
