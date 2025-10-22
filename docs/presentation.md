# Nosto Web Components

A comprehensive overview of all custom elements in the Nosto Web Components library.

---

## Overview

The Nosto Web Components library provides a collection of custom elements designed to enhance e-commerce experiences with personalization and recommendation capabilities.

This presentation covers all 10 components:
- Campaign
- Product  
- Image
- Popup
- Control
- DynamicCard
- SectionCampaign
- SimpleCard
- SkuOptions
- VariantSelector

---

## Campaign Component

### `<nosto-campaign>`

A custom element that renders a Nosto campaign based on the provided placement and fetched campaign data.

**Key Features:**
- Fetches campaign data from Nosto
- Supports HTML and JSON response modes
- Lazy loading capability
- Cart synchronization

---

### Campaign Attributes

- `placement` (or `id`) - The placement identifier
- `product-id` - Associate with specific product
- `variant-id` - Product variant ID
- `template` - Template ID for rendering
- `init` - Auto-load control (default: true)
- `lazy` - Lazy loading when in view
- `cart-synced` - Reload on cart updates

---

### Campaign Example

```html
<nosto-campaign placement="front-page"></nosto-campaign>
```

Template-based rendering:
```html
<nosto-campaign placement="front-page" template="my-template">
  <template id="my-template">
    <div class="campaign">
      <h2>{{ title }}</h2>
      <div class="products">
        <div v-for="product in products" class="product">
          <img :src="product.imageUrl" :alt="product.name" />
          <h3>{{ product.name }}</h3>
          <span class="price">{{ product.price }}</span>
        </div>
      </div>
    </div>
  </template>
</nosto-campaign>
```

---

## Product Component

### `<nosto-product>`

Manages product selection, SKU selection, and add-to-cart functionality within campaign contexts.

**Key Features:**
- Product and SKU management
- Add-to-cart functionality
- Store-based state management
- Integration with other components

---

### Product Attributes

- `product-id` - **Required** Product identifier
- `reco-id` - **Required** Recommendation slot ID
- `sku-selected` - Indicates if SKU is selected

---

### Product Example

Basic usage:
```html
<nosto-product product-id="123" reco-id="front-page">
  <select n-sku-selector>
    <option value="sku1">Option 1</option>
    <option value="sku2">Option 2</option>
  </select>
  <button n-atc>Add to Cart</button>
</nosto-product>
```

SKU selection with multiple options:
```html
<nosto-product product-id="123" reco-id="front-page">
  <div n-sku-id="456">
    <span n-atc>Blue</span>
  </div>
  <div n-sku-id="101">
    <span n-atc>Black</span>
  </div>
</nosto-product>
```

---

## Image Component

### `<nosto-image>`

Responsive image component with optimization capabilities for e-commerce platforms.

**Key Features:**
- Responsive image handling
- Shopify and BigCommerce support
- Crop and aspect ratio control
- Performance optimization

---

### Image Attributes

- `src` - **Required** Image source URL
- `width` - Image width in pixels
- `height` - Image height in pixels
- `aspect-ratio` - Width/height ratio
- `layout` - "fixed", "constrained", or "fullWidth"
- `crop` - Shopify crop: "center", "left", "right", "top", "bottom"
- `alt` - Alternative text for accessibility
- `sizes` - Responsive sizes attribute
- `breakpoints` - Custom responsive breakpoints
- `unstyled` - Prevents inline styles

---

### Image Examples

Shopify image:
```html
<nosto-image 
  src="https://cdn.shopify.com/static/sample-images/bath.jpeg" 
  width="800" 
  height="600" 
  crop="center">
</nosto-image>
```

BigCommerce with responsive sizing:
```html
<nosto-image
  src="https://cdn11.bigcommerce.com/s-example/products/123/image.jpg"
  width="800"
  aspect-ratio="1.5"
  alt="Product showcase"
  sizes="(max-width: 768px) 100vw, 50vw">
</nosto-image>
```

---

## Popup Component

### `<nosto-popup>`

Creates modal-style overlays for displaying campaigns, promotions, or other content.

**Key Features:**
- Modal overlay functionality
- Customizable positioning
- Event-driven display control
- Accessibility considerations

---

## Control Component

### `<nosto-control>`

Provides control mechanisms for managing component behavior and interactions.

**Key Features:**
- Component state management
- Event handling coordination
- Cross-component communication

---

## DynamicCard Component

### `<nosto-dynamic-card>`

Renders dynamic product cards with flexible layout and content options.

**Key Features:**
- Dynamic content rendering
- Flexible card layouts
- Product data integration
- Customizable styling

---

## SectionCampaign Component

### `<nosto-section-campaign>`

Specialized campaign component for section-level content organization.

**Key Features:**
- Section-based campaign management
- Content organization
- Layout coordination

---

## SimpleCard Component

### `<nosto-simple-card>`

Lightweight card component for basic product display needs.

**Key Features:**
- Simplified product cards
- Minimal dependencies
- Fast rendering
- Basic product information display

---

## SkuOptions Component

### `<nosto-sku-options>`

Manages product variant selection and SKU-related functionality.

**Key Features:**
- SKU option management
- Variant selection
- Product configuration
- Integration with product components

---

## VariantSelector Component

### `<nosto-variant-selector>`

Provides interface for selecting product variants and managing selections.

**Key Features:**
- Variant selection UI
- Multiple selection types
- State synchronization
- Product integration

---

## Integration & Usage

### Getting Started

1. Install the package:
   ```bash
   npm install @nosto/web-components
   ```

2. Import components:
   ```javascript
   import '@nosto/web-components'
   ```

3. Use in your HTML:
   ```html
   <nosto-campaign placement="homepage"></nosto-campaign>
   ```

---

### Component Categories

**Store Level Templating:**
- Campaign

**Campaign Level Templating:**
- Product
- Image
- DynamicCard
- SimpleCard
- SkuOptions
- VariantSelector

**Utility Components:**
- Control
- Popup
- SectionCampaign

---

### Best Practices

- Always provide required attributes
- Use semantic HTML structure
- Consider accessibility requirements
- Test responsive behavior
- Optimize for performance
- Follow component composition patterns

---

## Architecture

### Custom Element Pattern

All components follow the Nosto custom element pattern:

```typescript
@customElement("nosto-component")
export class Component extends NostoElement {
  static attributes = {
    // Attribute definitions
  }
  
  connectedCallback() {
    // Initialization logic
  }
  
  disconnectedCallback() {
    // Cleanup logic
  }
}
```

---

### TypeScript Support

Full TypeScript support with:
- Type definitions for all attributes
- JSX support via HTMLElementTagNameMap
- IntelliSense in compatible editors
- Type-safe component usage

---

## Testing & Quality

- **296 tests** with high coverage
- Vitest testing framework
- JSX/TSX test patterns
- Component behavior validation
- Integration testing

**Coverage:**
- Statements: 95.85%
- Branches: 91.93%
- Functions: 93.98%
- Lines: 95.85%

---

## Browser Support

Modern browsers with:
- Custom Elements v1
- Shadow DOM v1
- ES2020+ features
- Module support

---

## Resources

- [GitHub Repository](https://github.com/Nosto/web-components)
- [NPM Package](https://www.npmjs.com/package/@nosto/web-components)
- [Nosto Developer Documentation](https://help.nosto.com/developers)
- [Storybook Documentation](https://nosto.github.io/web-components)

---

## Thank You

Questions & Support:
- GitHub Issues
- Developer Documentation
- Community Forums

**Happy Building with Nosto Web Components!** 🚀