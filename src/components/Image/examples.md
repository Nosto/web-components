## Examples

### Using with Shopify image URL

This example demonstrates basic image rendering using a Shopify CDN URL with fixed dimensions and center cropping. The componen utilizes the resizing and transformation capabilties of Shopify's Image CDN internally and renders a responsive img element internally.

```html
<nosto-image src="https://cdn.shopify.com/static/sample-images/bath.jpeg" width="800" height="600" crop="center"></nosto-image>
```

### Using with BigCommerce image URL

This shows how to use the component with BigCommerce image URLs. The component recognizes BigCommerce CDN patterns and applies appropriate image transformations for optimal loading performance.

```html
<nosto-image src="https://cdn11.bigcommerce.com/s-hm8pjhul3k/products/4055/images/23603/7-15297__04892.1719977920.1280.1280.jpg" width="800" height="600"></nosto-image>
```

### Using with responsive sizes attribute

This example demonstrates responsive image loading with the `sizes` attribute, which helps the browser choose the optimal image size based on viewport width. The aspect ratio is controlled rather than a fixed height, making it more flexible for responsive layouts.

```html
<nosto-image
  src="https://cdn.shopify.com/static/sample-images/bath.jpeg"
  width="800"
  aspect-ratio="1.5"
  alt="Product showcase image"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw">
</nosto-image>
```

### Using with custom breakpoints

This shows how to specify custom breakpoints for responsive image generation. Instead of using default breakpoints, you can define specific widths that match your design system or layout requirements.

```html
<nosto-image
  src="https://cdn.shopify.com/static/sample-images/bath.jpeg"
  width="800"
  aspect-ratio="1.5"
  alt="Product showcase image"
  breakpoints="[320, 640, 768, 1024, 1280]">
</nosto-image>
```

### Using with unstyled attribute to prevent inline styles

This example shows how to use the `unstyled` attribute to prevent the component from applying inline styles to the image element. This is useful when you want to handle all styling through CSS classes instead of relying on the component's default styling.

```html
<nosto-image
  src="https://cdn.shopify.com/static/sample-images/bath.jpeg"
  width="800"
  height="600"
  unstyled
  alt="Product image without inline styles">
</nosto-image>
```

### Styling the inner img element using ::part()

The inner `<img>` element is exposed via `part="img"`, allowing you to style it from outside the shadow DOM using CSS `::part()` selectors. This is useful for applying custom styles like border-radius, filters, or other visual effects.

```html
<style>
  nosto-image::part(img) {
    border-radius: 8px;
    filter: grayscale(50%);
    transition: filter 0.3s ease;
  }
  
  nosto-image:hover::part(img) {
    filter: grayscale(0%);
  }
</style>

<nosto-image
  src="https://cdn.shopify.com/static/sample-images/bath.jpeg"
  width="800"
  height="600"
  alt="Product image with custom styling">
</nosto-image>
```