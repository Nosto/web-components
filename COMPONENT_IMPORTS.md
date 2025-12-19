# Individual Component Imports

This package supports importing individual components to reduce bundle sizes and improve tree-shaking.

## Usage

### Importing Individual Components

You can import individual components instead of the entire bundle:

```javascript
// Import specific component
import '@nosto/web-components/components/nosto-image'
```

### Available Components

Each component is available in two formats:

- **ESM**: `@nosto/web-components/components/[component-name].js`
- **Minified ESM**: `@nosto/web-components/components/[component-name].min.js`

#### Component List

- `nosto-bundle` - Bundle component for multiple product selection
- `nosto-campaign` - Campaign component for Nosto recommendations
- `nosto-control` - Control component for campaign controls
- `nosto-dynamic-card` - Dynamic product card component
- `nosto-image` - Responsive image component with Shopify/BigCommerce support
- `nosto-product` - Product component with SKU selection
- `nosto-section-campaign` - Section campaign component
- `nosto-simple-card` - Simple product card component
- `nosto-sku-options` - SKU options selector component
- `nosto-variant-selector` - Product variant selector component

### Examples

#### Using nosto-image only

```javascript
import '@nosto/web-components/components/nosto-image'
```

```html
<nosto-image
  src="https://example.com/image.jpg"
  width="400"
  height="300"
  layout="constrained"
  alt="Product image"
></nosto-image>
```

#### Using nosto-simple-card only

```javascript
import '@nosto/web-components/components/nosto-simple-card'
```

```html
<nosto-simple-card
  handle="product-handle"
  brand
  discount
  rating
></nosto-simple-card>
```

#### Using multiple specific components

```javascript
import '@nosto/web-components/components/nosto-image'
import '@nosto/web-components/components/nosto-product'
import '@nosto/web-components/components/nosto-variant-selector'
```

### Benefits

- **Reduced bundle size**: Only load the components you need
- **Better tree-shaking**: Smaller production bundles
- **Improved modularity**: Independent component usage
- **CDN-friendly**: Serve individual components from CDN
- **Faster page loads**: Less JavaScript to download and parse

### Full Bundle Import

If you need all components, you can still import the full bundle:

```javascript
// Import all components (ESM)
import '@nosto/web-components'

// Import all components (CommonJS)
const nostoComponents = require('@nosto/web-components')
```
