## Examples

### Recommended: Using with section reference for Shopify section rendering

This demonstrates using Shopify's Section Rendering API with lazy loading for better performance. The `section` attribute specifies which Shopify section to use for rendering, while `lazy` ensures the component only loads when it enters the viewport. The skeleton content provides visual feedback during the loading process.

```html
<nosto-dynamic-card handle="awesome-product" section="product-recommendation-card" lazy>
  <div class="loading-skeleton">
    <div class="skeleton-image"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-price"></div>
  </div>
</nosto-dynamic-card>
```

### With specific variant using section

```html
<nosto-dynamic-card 
  handle="awesome-product" 
  section="product-recommendation-card" 
  variant-id="123456"
  placeholder>
  Loading product...
</nosto-dynamic-card>
```

### Deprecated: Basic usage with template

> ⚠️ **DEPRECATED:** The `template` property is deprecated and will be removed in a future version. Please use the `section` property instead.

This example shows how to render a product using a Shopify template with a specific variant. The component fetches the product markup and renders it using the "product-card" Shopify Liquid template, with optional placeholder content shown during loading.

```html
<!-- ⚠️ Deprecated - use section instead -->
<nosto-dynamic-card handle="awesome-product" template="product-card" variant-id="123456">
Placeholder content while loading...
</nosto-dynamic-card>
```

## Migration from template to section

The `template` property uses Shopify's legacy view system, while `section` provides better performance and maintainability through Shopify's Section Rendering API.

**Before (deprecated):**
```html
<nosto-dynamic-card 
  handle="awesome-product" 
  template="product-card" 
  variant-id="123456"
  placeholder
  lazy>
  Loading...
</nosto-dynamic-card>
```

**After (recommended):**
```html
<nosto-dynamic-card 
  handle="awesome-product" 
  section="product-recommendation-card" 
  variant-id="123456"
  placeholder
  lazy>
  Loading...
</nosto-dynamic-card>
```

**Migration steps:**
1. Create a Shopify section file (e.g., `sections/product-recommendation-card.liquid`) to replace your template view
2. Move your product rendering logic from the template file to the section file
3. Replace the `template` attribute with `section` and use your section's filename (without `.liquid`)
4. Test the rendering to ensure it works as expected
5. Remove any `view` parameter handling from your Liquid code as sections don't use views