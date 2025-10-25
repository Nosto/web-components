## Examples

### Basic usage with template

```html
<nosto-dynamic-card handle="awesome-product" template="product-card" variant-id="123456">
Placeholder content while loading...
</nosto-dynamic-card>
```

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