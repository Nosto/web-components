# Nosto Web Components

Comprehensive Documentation & Usage Examples

---

## Overview

This presentation covers all Nosto Web Components with:

- **JSDoc-based usage examples**
- **Complete attribute tables**  
- **Key behaviors & notes**
- **Component categories**

---

## Component Categories

### Store Level Templating
- `nosto-campaign` - Campaign rendering and product recommendation display
- `nosto-control` - Conditional content rendering based on user segments  
- `nosto-popup` - Popup content with dialog and ribbon slots
- `nosto-section-campaign` - Campaign rendering using Section Rendering API (Shopify only)

### Campaign Level Templating
- `nosto-dynamic-card` - Dynamic product card templating (Shopify only)
- `nosto-image` - Progressive image enhancement with optimization
- `nosto-product` - Product interaction and cart management
- `nosto-simple-card` - Simple product card templating (Shopify only)
- `nosto-sku-options` - Product variant and SKU selection interface
- `nosto-variant-selector` - Product variant options as clickable pills (Shopify only)

---

## nosto-campaign

**Category:** Store level templating

A custom element that renders a Nosto campaign based on the provided placement and fetched campaign data.

### Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `placement` (or `id`) | `string` | - | **Required.** The placement identifier for the campaign |
| `product-id` | `string` | - | The ID of the product to associate with the campaign |
| `variant-id` | `string` | - | The variant ID of the product |
| `template` | `string` | - | The ID of the template to use for rendering the campaign |
| `init` | `string` | `"true"` | If set to "false", component won't auto-load on connection |
| `lazy` | `boolean` | `false` | Load campaign only when it comes into view |
| `cart-synced` | `boolean` | `false` | Reload campaign on cart update events |

---

### nosto-campaign Examples

**Basic campaign rendering:**
```html
<nosto-campaign placement="front-page"></nosto-campaign>
```

**Campaign with template-based rendering:**
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

### nosto-campaign Examples (cont.)

**Campaign with lazy loading:**
```html
<nosto-campaign 
  placement="product-recommendations" 
  product-id="123" 
  variant-id="456" 
  lazy>
</nosto-campaign>
```

**Cart-synced campaign:**
```html
<nosto-campaign 
  placement="cart-recommendations" 
  cart-synced>
</nosto-campaign>
```

---

## nosto-control

**Category:** Store level templating  

A custom element that provides conditional content rendering based on user segments.

### Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| *No attributes* | - | - | Templates use `segment` attribute for targeting |

---

### nosto-control Examples

**Conditional content based on user segments:**
```html
<nosto-control>
  <template segment="5b71f1500000000000000006">
    <div class="premium-offer">
      <h2>Exclusive Premium Offer!</h2>
      <p>Get 20% off your next purchase</p>
    </div>
  </template>
  <template segment="5a497a000000000000000001">
    <div class="welcome-offer">
      <h2>Welcome! Get Started</h2>
      <p>Use code WELCOME10 for 10% off your first order</p>
    </div>
  </template>
</nosto-control>
```

---

### nosto-control Examples (cont.)

**With fallback content:**
```html
<nosto-control>
  <template segment="5b71f1500000000000000006">
    <div class="premium-offer">
      <h2>VIP Members Only</h2>
      <p>Exclusive early access to new arrivals</p>
    </div>
  </template>

  <div class="default-content">
    <h2>Welcome to our store!</h2>
    <p>Discover our latest products and special offers</p>
    <a href="/collections/all" class="browse-all">Browse All Products</a>
  </div>
</nosto-control>
```

---

## nosto-popup

**Category:** Store level templating

A custom element that displays popup content with dialog and ribbon slots. Supports conditional activation based on Nosto segments and persistent closure state.

### Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | **Required.** Name used for analytics and localStorage persistence |
| `segment` | `string` | - | Optional Nosto segment precondition for activation |

---

### nosto-popup Example

**Basic popup with dialog and ribbon content:**
```html
<nosto-popup name="promo-popup" segment="5b71f1500000000000000006">
  <h2>Special Offer!</h2>
  <p>Get 20% off your order today</p>
  <button n-close>Close</button>
  <div slot="ribbon">
    <span>Limited time!</span>
  </div>
</nosto-popup>
```

---

## nosto-section-campaign

**Category:** Store level templating  
**Platform:** Shopify only

A custom element that fetches Nosto placement results and renders them using Shopify section templates.

### Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `placement` | `string` | - | **Required.** The placement identifier for the campaign |
| `section` | `string` | - | **Required.** Section for Section Rendering API |

---

### nosto-section-campaign Examples

**Basic usage with Shopify section rendering:**
```html
<nosto-section-campaign 
  placement="front-page" 
  section="product-recommendations">
</nosto-section-campaign>
```

**Advanced usage for product page:**
```html
<nosto-section-campaign 
  placement="product-page-cross-sell" 
  section="related-products-section">
</nosto-section-campaign>
```

---

## nosto-dynamic-card

**Category:** Campaign level templating  
**Platform:** Shopify only

A custom element that renders a product by fetching markup from Shopify based on handle and template.

### Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `handle` | `string` | - | **Required.** Product handle to fetch data for |
| `section` | `string` | - | Section for rendering (section OR template required) |
| `template` | `string` | - | Template for rendering (section OR template required) |
| `variant-id` | `string` | - | Variant ID to fetch specific variant data |
| `placeholder` | `boolean` | `false` | Display placeholder content while loading |
| `lazy` | `boolean` | `false` | Fetch data only when component comes into view |

---

### nosto-dynamic-card Examples

**Basic usage with template:**
```html
<nosto-dynamic-card 
  handle="awesome-product" 
  template="product-card" 
  variant-id="123456">
  Placeholder content while loading...
</nosto-dynamic-card>
```

**Using with section reference:**
```html
<nosto-dynamic-card 
  handle="awesome-product" 
  section="product-recommendation-card" 
  lazy>
  <div class="loading-skeleton">
    <div class="skeleton-image"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-price"></div>
  </div>
</nosto-dynamic-card>
```

---

## nosto-image

**Category:** Campaign level templating

NostoImage renders responsive images using the unpic library. Supports Shopify and BigCommerce image URLs.

### Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | **Required.** Source URL of the image |
| `width` | `number` | - | Width of the image in pixels |
| `height` | `number` | - | Height of the image in pixels |
| `aspect-ratio` | `number` | - | Aspect ratio (width / height) |
| `layout` | `"fixed"` \| `"constrained"` \| `"fullWidth"` | - | Layout: "fixed", "constrained", or "fullWidth" |
| `crop` | `"center"` \| `"left"` \| `"right"` \| `"top"` \| `"bottom"` | - | **Shopify only.** Crop: "center", "left", "right", "top", "bottom" |
| `alt` | `string` | - | Alternative text for accessibility |
| `sizes` | `string` | - | Sizes attribute for responsive images |
| `breakpoints` | Array of numbers | - | Custom widths for responsive image generation (e.g., `[320, 640, 768, 1024, 1280]`) |
| `unstyled` | `boolean` | `false` | Prevents inline styles from being applied |

---

### nosto-image Examples

**Using with Shopify image URL:**
```html
<nosto-image 
  src="https://cdn.shopify.com/static/sample-images/bath.jpeg" 
  width="800" 
  height="600" 
  crop="center">
</nosto-image>
```

**Using with BigCommerce image URL:**
```html
<nosto-image 
  src="https://cdn11.bigcommerce.com/s-hm8pjhul3k/products/4055/images/23603/7-15297__04892.1719977920.1280.1280.jpg" 
  width="800" 
  height="600">
</nosto-image>
```

---

### nosto-image Examples (cont.)

**Using with responsive sizes:**
```html
<nosto-image
  src="https://cdn.shopify.com/static/sample-images/bath.jpeg"
  width="800"
  aspect-ratio="1.5"
  alt="Product showcase image"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw">
</nosto-image>
```

**Using with custom breakpoints:**
```html
<nosto-image
  src="https://cdn.shopify.com/static/sample-images/bath.jpeg"
  width="800"
  aspect-ratio="1.5"
  alt="Product showcase image"
  breakpoints="[320, 640, 768, 1024, 1280]">
</nosto-image>
```

---

### nosto-image Examples (cont.)

**Using unstyled attribute:**
```html
<nosto-image
  src="https://cdn.shopify.com/static/sample-images/bath.jpeg"
  width="800"
  height="600"
  unstyled
  alt="Product image without inline styles">
</nosto-image>
```

---

## nosto-product

**Category:** Campaign level templating

Custom element that represents a Nosto product component. Manages product selection, SKU selection, and add-to-cart functionality.

### Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `product-id` | `string` | - | **Required.** The ID of the product |
| `reco-id` | `string` | - | **Required.** The recommendation slot ID |
| `sku-selected` | `boolean` | - | **Read-only.** Indicates whether a SKU is currently selected |

---

### nosto-product Examples

**Basic product with SKU selector:**
```html
<nosto-product product-id="123" reco-id="front-page">
  <select n-sku-selector>
    <option value="sku1">Option 1</option>
    <option value="sku2">Option 2</option>
  </select>
  <button n-atc>Add to Cart</button>
</nosto-product>
```

**Product with SKU ID elements:**
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

## nosto-simple-card

**Category:** Campaign level templating  
**Platform:** Shopify only

A custom element that displays a product card using Shopify product data. Fetches data from `/products/<handle>.js`.

### Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `handle` | `string` | - | **Required.** Shopify product handle to fetch data for |
| `alternate` | `boolean` | `false` | Show alternate product image on hover |
| `brand` | `boolean` | `false` | Show brand/vendor data |
| `discount` | `boolean` | `false` | Show discount data |
| `rating` | `number` | - | Show product rating |
| `sizes` | `string` | - | Sizes attribute for responsive images |

---

### nosto-simple-card Examples

**Basic product card with all features:**
```html
<nosto-simple-card 
  handle="awesome-product" 
  alternate 
  brand 
  discount 
  rating>
</nosto-simple-card>
```

**Product card with nested variant selector:**
```html
<nosto-simple-card handle="configurable-product" brand discount>
  <nosto-variant-selector handle="configurable-product" preselect>
  </nosto-variant-selector>
</nosto-simple-card>
```

---

## nosto-sku-options

**Category:** Campaign level templating

A custom element that manages SKU (Stock Keeping Unit) options in a product selection interface. Handles option selection state and availability.

### Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | **Required.** The identifier for this option group |

---

### nosto-sku-options Example

**SKU options with clickable elements:**
```html
<nosto-sku-options name="color">
  <span n-option n-skus="123,145">Black</span>
  <span n-option n-skus="223,234,245">White</span>
  <span n-option n-skus="334,345">Blue</span>
</nosto-sku-options>
```

---

## nosto-variant-selector

**Category:** Campaign level templating  
**Platform:** Shopify only

A custom element that displays product variant options as clickable pills. Fetches product data and renders option rows with clickable value pills.

### Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `handle` | `string` | - | **Required.** Shopify product handle to fetch data for |
| `preselect` | `boolean` | `false` | Auto-preselect first value for each option |

### Events

| Event | Description |
|-------|-------------|
| `variantchange` | Emitted when variant selection changes, contains `{ variant, product }` |

---

### nosto-variant-selector Example

**Basic variant selector:**
```html
<nosto-variant-selector handle="awesome-product"></nosto-variant-selector>
```

---

## Key Implementation Notes

### Store Level vs Campaign Level

**Store Level Templating:**
- Used for high-level layout and campaign orchestration
- Components: `nosto-campaign`, `nosto-control`, `nosto-popup`, `nosto-section-campaign`

**Campaign Level Templating:**
- Used within campaigns for product-specific interactions
- Components: `nosto-image`, `nosto-product`, `nosto-sku-options`, etc.

### Platform-Specific Components

**Shopify Only:**
- `nosto-section-campaign`
- `nosto-dynamic-card`
- `nosto-simple-card`
- `nosto-variant-selector`

---

## Integration Patterns

### Template-Based Rendering
```html
<nosto-campaign placement="front-page" template="my-template">
  <template id="my-template">
    <!-- Vue.js-style templating -->
  </template>
</nosto-campaign>
```

### Shadow DOM Components
- `nosto-image`
- `nosto-simple-card`
- `nosto-variant-selector`
- `nosto-popup`

### Store Integration
```html
<nosto-product product-id="123" reco-id="front-page">
  <nosto-sku-options name="size">
    <!-- Options -->
  </nosto-sku-options>
</nosto-product>
```

---

## Performance Features

### Lazy Loading
```html
<nosto-campaign placement="below-fold" lazy></nosto-campaign>
<nosto-dynamic-card handle="product" lazy></nosto-dynamic-card>
```

### Cart Synchronization
```html
<nosto-campaign placement="cart-upsell" cart-synced></nosto-campaign>
```

### Progressive Enhancement
```html
<nosto-image 
  src="image.jpg" 
  width="800" 
  layout="constrained"
  sizes="(max-width: 768px) 100vw, 50vw">
</nosto-image>
```

---

## Questions?

### Resources

- **Library Documentation:** [Nosto GitHub Pages](https://nosto.github.io/web-components)
- **Interactive Examples:** [Storybook](https://nosto.github.io/web-components/storybook/)
- **Technical Docs:** [Nosto Techdocs](https://docs.nosto.com/techdocs/apis/frontend/oss/web-components)

### Repository
[github.com/Nosto/web-components](https://github.com/Nosto/web-components)

---

## Thank You!

*Nosto Web Components Documentation*