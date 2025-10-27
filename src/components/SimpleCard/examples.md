## Examples

### Basic product card with all features

This example shows a fully-featured product card that displays all available information: alternate product images on hover, brand/vendor information, discount badges, and product ratings. The card fetches data from Shopify's `/products/{handle}.js` endpoint and renders a complete product presentation. Internally this component renders that product card in the shadow root and can be styled using part selectors.

```html
<nosto-simple-card handle="awesome-product" alternate brand discount rating></nosto-simple-card>
```

### Product card with nested variant selector for interactive options

This demonstrates how to embed a variant selector within a product card for products with multiple options (like size, color). The nested `nosto-variant-selector` allows customers to select variants directly from the card, with the `preselect` attribute automatically choosing the first available option.

```html
<nosto-simple-card handle="configurable-product" brand discount>
  <nosto-variant-selector handle="configurable-product" preselect></nosto-variant-selector>
</nosto-simple-card>
```