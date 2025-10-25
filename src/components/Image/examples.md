## Examples

### Using with Shopify image URL

```html
<nosto-image src="https://cdn.shopify.com/static/sample-images/bath.jpeg" width="800" height="600" crop="center"></nosto-image>
```

### Using with BigCommerce image URL

```html
<nosto-image src="https://cdn11.bigcommerce.com/s-hm8pjhul3k/products/4055/images/23603/7-15297__04892.1719977920.1280.1280.jpg" width="800" height="600"></nosto-image>
```

### Using with responsive sizes attribute

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

```html
<nosto-image
  src="https://cdn.shopify.com/static/sample-images/bath.jpeg"
  width="800"
  height="600"
  unstyled
  alt="Product image without inline styles">
</nosto-image>
```