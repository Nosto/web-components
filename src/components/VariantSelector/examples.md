## Examples

### Basic variant selector

This example shows a basic variant selector that fetches product data from the Shopify Storefront GraphQL API and displays product option rows with clickable value pills. Users can select different variant options (like size, color, material) and the component emits variant change events for integration with other components. Internally VariantSelector renders the content in the shadow root and exposes parts for external styling.

```html
<nosto-variant-selector handle="awesome-product"></nosto-variant-selector>
```