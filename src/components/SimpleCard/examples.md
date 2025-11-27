## Examples

### Basic product card with all features

This example shows a fully-featured product card that displays all available information: alternate product images on hover, brand/vendor information, discount badges, and product ratings. The card fetches data from the Shopify Storefront GraphQL API and renders a complete product presentation. Internally this component renders that product card in the shadow root and can be styled using part selectors.

```html
<nosto-simple-card handle="awesome-product" image-mode="alternate" brand discount rating></nosto-simple-card>
```

### Product card with carousel mode

This example shows a product card with image carousel navigation, allowing customers to browse through all product images with indicators.

```html
<nosto-simple-card handle="awesome-product" image-mode="carousel" brand discount rating></nosto-simple-card>
```

### Product card with nested variant selector for interactive options

This demonstrates how to embed a variant selector within a product card for products with multiple options (like size, color). The nested `nosto-variant-selector` allows customers to select variants directly from the card, with the `preselect` attribute automatically choosing the first available option.

```html
<nosto-simple-card handle="configurable-product" brand discount>
  <nosto-variant-selector handle="configurable-product" preselect></nosto-variant-selector>
</nosto-simple-card>
```

### Product card with custom image sizes for responsive images

This example shows how to use the `image-sizes` attribute to specify responsive image sizes. The sizes attribute helps the browser choose the right image size based on the viewport.

```html
<nosto-simple-card
  handle="awesome-product"
  image-sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  brand
  discount
></nosto-simple-card>
```