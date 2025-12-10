## Examples

### Using with section reference for Shopify section rendering

This demonstrates using Shopify's Section Rendering API. The `section` attribute specifies which Shopify section to use for rendering. The skeleton content provides visual feedback during the loading process.

```html
<nosto-dynamic-card handle="awesome-product" section="product-recommendation-card">
  <div class="loading-skeleton">
    <div class="skeleton-image"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-price"></div>
  </div>
</nosto-dynamic-card>
```

### Basic usage with template (deprecated)

This example shows how to render a product using a Shopify template with a specific variant. The component fetches the product markup and rendered using the "product-card" Shopify Liquid template, with optional placeholder content shown during loading. This is useful for creating dynamic product cards that match your existing Shopify theme design.

We recommend to use dynamic cards with Section Rendering, since this is the recommended approach from Shopify.

```html
<nosto-dynamic-card handle="awesome-product" template="product-card" variant-id="123456">
Placeholder content while loading...
</nosto-dynamic-card>
```

