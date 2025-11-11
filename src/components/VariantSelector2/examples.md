## Examples

### Basic variant selector with Shopify Storefront API

This example shows a variant selector that fetches product data from Shopify's Storefront GraphQL API and displays product option rows with clickable value pills. Users can select different variant options (like size, color, material) and the component emits variant change events for integration with other components. Internally VariantSelector2 renders the content in the shadow root and exposes parts for external styling.

```html
<nosto-variant-selector2
  handle="awesome-product"
  storefront-access-token="your-storefront-access-token"
  shop-domain="yourshop.myshopify.com"
></nosto-variant-selector2>
```
