# Nosto Web Components
## A Complete Guide to All Available Components

*Version 9.8.1 | October 2024*

---

## Component Categories

### 🏪 Store Level Templating (4 components)
Components that work at the store level for campaigns, controls, and popups

- **nosto-campaign** - Render Nosto campaigns
- **nosto-control** - Conditional content based on segments
- **nosto-popup** - Display popup dialogs with segments
- **nosto-section-campaign** - Shopify section-based campaigns

### 🎯 Campaign Level Templating (6 components)
Components that work within campaigns for product display and interaction

- **nosto-image** - Responsive images with Shopify/BigCommerce support
- **nosto-product** - Product management with SKU selection
- **nosto-simple-card** - Product cards with Shopify data
- **nosto-dynamic-card** - Dynamic Shopify product rendering
- **nosto-sku-options** - SKU option selection interface
- **nosto-variant-selector** - Product variant selection

---

## Store Level Components - Examples

### nosto-campaign

#### Basic Campaign Rendering
```html
<nosto-campaign placement="front-page"></nosto-campaign>
```

#### With Template and Product Context
```html
<nosto-campaign 
    placement="product-recommendations" 
    product-id="123" 
    variant-id="456" 
    template="my-template"
    lazy 
    cart-synced>
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

### nosto-control

#### Segment-based Conditional Content
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

### nosto-popup

#### Popup with Dialog and Ribbon
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

### nosto-section-campaign

#### Shopify Section Rendering
```html
<nosto-section-campaign 
    placement="front-page" 
    section="product-recommendations">
</nosto-section-campaign>
```

---

## Campaign Level Components - Examples

### nosto-image

#### Shopify Responsive Image
```html
<nosto-image 
    src="https://cdn.shopify.com/static/sample-images/bath.jpeg"
    width="800" 
    height="600" 
    crop="center"
    alt="Product showcase image"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw">
</nosto-image>
```

#### BigCommerce Image with Custom Breakpoints
```html
<nosto-image 
    src="https://cdn11.bigcommerce.com/s-hm8pjhul3k/products/4055/images/23603/7-15297__04892.1719977920.1280.1280.jpg"
    width="800" 
    aspectRatio="1.5"
    breakpoints="[320, 640, 768, 1024, 1280]"
    unstyled>
</nosto-image>
```

### nosto-product

#### Product with SKU Selector
```html
<nosto-product product-id="123" reco-id="front-page">
  <select n-sku-selector>
    <option value="sku1">Option 1</option>
    <option value="sku2">Option 2</option>
  </select>
  <button n-atc>Add to Cart</button>
</nosto-product>
```

#### Product with SKU IDs
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

### nosto-simple-card

#### Product Card with All Features
```html
<nosto-simple-card 
    handle="awesome-product" 
    alternate 
    brand 
    discount 
    rating
    sizes="(max-width: 768px) 100vw, 300px">
</nosto-simple-card>
```

### nosto-dynamic-card

#### Dynamic Shopify Product Card
```html
<nosto-dynamic-card 
    handle="awesome-product" 
    template="product-card" 
    variant-id="123456"
    placeholder
    lazy>
  Placeholder content while loading...
</nosto-dynamic-card>
```

### nosto-sku-options

#### SKU Options Selection
```html
<nosto-sku-options name="color">
  <span n-option n-skus="123,145">Black</span>
  <span n-option n-skus="223,234,245">White</span>
  <span n-option n-skus="334,345">Blue</span>
</nosto-sku-options>
```

### nosto-variant-selector

#### Product Variant Selection
```html
<nosto-variant-selector 
    handle="awesome-product"
    preselect>
</nosto-variant-selector>
```

**Emits:** `variantchange` event with `{ variant, product }` details

---

## Complete Attributes Reference

### Store Level Components Attributes

| Component | Attribute | Type | Required | Description |
|-----------|-----------|------|----------|-------------|
| **nosto-campaign** | placement (or id) | string | ✅ | Placement identifier for the campaign |
| | product-id | string | ❌ | Product ID to associate with campaign |
| | variant-id | string | ❌ | Variant ID of the product |
| | template | string | ❌ | Template ID for rendering |
| | init | string | ❌ | Auto-load campaign (default: "true") |
| | lazy | boolean | ❌ | Load campaign when in view |
| | cart-synced | boolean | ❌ | Reload on cart updates |
| **nosto-control** | | | | *No attributes - uses template[segment] children* |
| **nosto-popup** | name | string | ✅ | Unique name for analytics and persistence |
| | segment | string | ❌ | Nosto segment precondition |
| **nosto-section-campaign** | placement | string | ✅ | Placement identifier |
| | section | string | ✅ | Shopify section ID |

### Campaign Level Components Attributes (Part 1)

| Component | Attribute | Type | Required | Description |
|-----------|-----------|------|----------|-------------|
| **nosto-image** | src | string | ✅ | Image source URL (Shopify/BigCommerce) |
| | width | number | ❌ | Image width in pixels |
| | height | number | ❌ | Image height in pixels |
| | aspect-ratio | number | ❌ | Aspect ratio (width/height) |
| | layout | string | ❌ | "fixed", "constrained", or "fullWidth" |
| | crop | string | ❌ | Shopify crop: "center", "left", "right", "top", "bottom" |
| | alt | string | ❌ | Alternative text for accessibility |
| | sizes | string | ❌ | Responsive image sizes attribute |
| | breakpoints | number[] | ❌ | Custom responsive breakpoints |
| | unstyled | boolean | ❌ | Prevent inline styles |
| **nosto-product** | product-id | string | ✅ | Product identifier |
| | reco-id | string | ✅ | Recommendation slot ID |
| | sku-selected | boolean | ❌ | Whether SKU is selected (read-only) |

### Campaign Level Components Attributes (Part 2)

| Component | Attribute | Type | Required | Description |
|-----------|-----------|------|----------|-------------|
| **nosto-simple-card** | handle | string | ✅ | Shopify product handle |
| | alternate | boolean | ❌ | Show alternate image on hover |
| | brand | boolean | ❌ | Show brand/vendor data |
| | discount | boolean | ❌ | Show discount information |
| | rating | number | ❌ | Product rating display |
| | sizes | string | ❌ | Responsive image sizes attribute |
| **nosto-dynamic-card** | handle | string | ✅ | Shopify product handle |
| | section | string | ❌* | Section for rendering (section OR template required) |
| | template | string | ❌* | Template for rendering (section OR template required) |
| | variant-id | string | ❌ | Specific variant ID |
| | placeholder | boolean | ❌ | Show placeholder while loading |
| | lazy | boolean | ❌ | Load when in view |
| **nosto-sku-options** | name | string | ✅ | Option group identifier |
| **nosto-variant-selector** | handle | string | ✅ | Shopify product handle |
| | preselect | boolean | ❌ | Auto-select first option values |

---

## Summary

### 🎯 10 Powerful Web Components

**4 Store Level Components** for campaigns, popups, and conditional content  
**6 Campaign Level Components** for product display, variants, and interactions

#### Key Features:
- 🚀 Lazy loading and intersection observer support
- 🎨 Shopify and BigCommerce integration
- 📱 Responsive image handling
- 🛒 Cart synchronization and add-to-cart functionality
- 🎯 Segment-based conditional rendering
- ⚡ Shadow DOM encapsulation where needed

For detailed documentation and examples, visit the [GitHub repository](https://github.com/Nosto/web-components)