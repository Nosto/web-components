## Examples

### Basic usage with template

```html
<nosto-dynamic-card handle="awesome-product" template="product-card" variant-id="123456">
Placeholder content while loading...
</nosto-dynamic-card>
```

This example shows how to render a product using a Shopify template with a specific variant. The component fetches the product markup and rendered using the "product-card" Shopify Liquid template, with optional placeholder content shown during loading. This is useful for creating dynamic product cards that match your existing Shopify theme design.

### Using with section reference for Shopify section rendering

```html
<nosto-dynamic-card handle="awesome-product" section="product-recommendation-card" lazy>
  <div class="loading-skeleton">
    <div class="skeleton-image"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-price"></div>
  </div>
</nosto-dynamic-card>
```

This demonstrates using Shopify's Section Rendering API with lazy loading for better performance. The `section` attribute specifies which Shopify section to use for rendering, while `lazy` ensures the component only loads when it enters the viewport. The skeleton content provides visual feedback during the loading process.