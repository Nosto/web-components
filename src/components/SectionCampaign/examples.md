## Examples

### Basic usage with Shopify section rendering

```html
<nosto-section-campaign placement="front-page" section="product-recommendations"></nosto-section-campaign>
```

This example demonstrates basic integration with Shopify's Section Rendering API to display Nosto campaign results. The component fetches recommendations from the "front-page" placement and renders them using the "product-recommendations" section, maintaining consistency with your Shopify theme's styling and layout.

### Advanced usage for specific product page recommendations

```html
<nosto-section-campaign placement="product-page-cross-sell" section="related-products-section"></nosto-section-campaign>
```

This shows a more targeted implementation for product page cross-selling. By using a specific placement like "product-page-cross-sell", you can display contextually relevant recommendations that complement the current product, rendered through a dedicated section optimized for cross-sell scenarios.