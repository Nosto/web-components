# SimpleCard Native Product Card Rendering Guide

This guide provides an exhaustive approach to configuring and extending the `nosto-simple-card` component to emulate native Shopify product card rendering with full customization capabilities.

## Table of Contents

1. [Overview](#overview)
2. [Core Configuration](#core-configuration)
3. [Variant Selection Integration](#variant-selection-integration)
4. [Swatch Rendering Configuration](#swatch-rendering-configuration)
5. [SKU Alternatives & Data Sources](#sku-alternatives--data-sources)
6. [Advanced Styling & Customization](#advanced-styling--customization)
7. [Complete Implementation Examples](#complete-implementation-examples)
8. [Performance Optimization](#performance-optimization)

---

## Overview

The `nosto-simple-card` component is a fully encapsulated custom element that renders Shopify product cards using data from the Shopify Storefront GraphQL API. It supports:

- **Shadow DOM encapsulation** for style isolation
- **Reactive updates** when attributes change
- **Event-based communication** with nested components
- **Flexible data sources** including Shopify API, mock data, and custom sources
- **CSS Parts** for external styling customization

### Architecture

```
┌─────────────────────────────────────┐
│   nosto-simple-card (Shadow DOM)    │
│  ┌───────────────────────────────┐  │
│  │   Product Card Markup         │  │
│  │   - Images (carousel/alternate)│  │
│  │   - Title, Brand, Price       │  │
│  │   - Discount Badges, Ratings  │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ Slot: Light DOM Content       │  │
│  │ <nosto-variant-selector>      │  │
│  │ <nosto-sku-options>           │  │
│  │ <button n-atc>                │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## Core Configuration

### Basic Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `handle` | string | **required** | Shopify product handle for API fetching |
| `variant-id` | number | undefined | Specific variant ID to display |
| `image-mode` | "alternate" \| "carousel" | undefined | Image display behavior |
| `brand` | boolean | false | Show vendor/brand information |
| `discount` | boolean | false | Show discount badges and original prices |
| `rating` | number | undefined | Star rating (0-5) to display |
| `image-sizes` | string | responsive | Sizes attribute for responsive images |
| `mock` | boolean | false | Use mock data instead of API |

### Setting Global Defaults

Use `setSimpleCardDefaults()` to configure default behavior for all card instances:

```typescript
import { setSimpleCardDefaults } from '@nosto/web-components'

// Apply global defaults
setSimpleCardDefaults({
  brand: true,
  discount: true,
  imageMode: 'alternate',
  imageSizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
})
```

### Image Modes

#### Standard Mode (Default)
Shows the first product image only.

```html
<nosto-simple-card handle="awesome-product"></nosto-simple-card>
```

#### Alternate Mode
Swaps to second image on hover, ideal for showing different product angles.

```html
<nosto-simple-card 
  handle="awesome-product" 
  image-mode="alternate">
</nosto-simple-card>
```

#### Carousel Mode
Scrollable image gallery with navigation indicators.

```html
<nosto-simple-card 
  handle="awesome-product" 
  image-mode="carousel">
</nosto-simple-card>
```

### Responsive Images

Optimize image loading with the `image-sizes` attribute:

```html
<nosto-simple-card
  handle="awesome-product"
  image-sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
  image-mode="alternate">
</nosto-simple-card>
```

---

## Variant Selection Integration

### Using Shopify Native Variant Selector

The `nosto-variant-selector` component integrates seamlessly with SimpleCard to provide native-like variant selection:

```html
<nosto-simple-card handle="configurable-product" brand discount>
  <nosto-variant-selector 
    handle="configurable-product" 
    preselect>
  </nosto-variant-selector>
  <button n-atc>Add to Cart</button>
</nosto-simple-card>
```

#### How it Works

1. **Automatic Syncing**: `nosto-variant-selector` emits `@nosto/variantchange` events
2. **SimpleCard Listens**: SimpleCard automatically updates `variant-id` when selection changes
3. **Price & Image Updates**: Card refreshes to show selected variant's price and image
4. **Add to Cart**: `n-atc` button uses the currently selected variant

### Custom Variant Selection UI

For custom variant selection logic, dispatch the variant change event manually:

```javascript
const card = document.querySelector('nosto-simple-card')
const event = new CustomEvent('@nosto/variantchange', {
  detail: {
    productId: 'gid://shopify/Product/1234567890',
    variantId: 'gid://shopify/ProductVariant/9876543210',
    handle: 'awesome-product'
  },
  bubbles: true
})
card.dispatchEvent(event)
```

---

## Swatch Rendering Configuration

### Current State & Implementation Path

**Important**: Visual swatch rendering is currently marked as **TODO** in the codebase (see `src/components/VariantSelector/options/markup.ts:51`). The infrastructure exists in the GraphQL schema, but visual rendering requires custom implementation.

### Swatch Data Model

Shopify's Storefront API provides two swatch types:

```typescript
type ProductOptionValueSwatch = {
  color?: string;        // Hex color value (e.g., "#FF0000")
  image?: {              // Image-based swatch
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
}
```

### Fetching Swatch Data

Extend the GraphQL query to include swatch information:

```graphql
query ProductByHandle($handle: String!) {
  product(handle: $handle) {
    id
    handle
    title
    options {
      id
      name
      optionValues {
        id
        name
        swatch {
          color
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
}
```

### Swatch Persistence Models

Different stores persist color data differently. Here are configuration approaches for common patterns:

#### Model 1: Shopify Native Swatches (Color Hex in Swatch Field)

**Data Source**: Shopify Storefront API `swatch.color` field

```html
<nosto-simple-card handle="product-with-swatches" brand discount>
  <nosto-variant-selector handle="product-with-swatches" preselect>
    <template data-option="Color">
      <button 
        class="color-swatch"
        data-option-value="${value.name}"
        style="background-color: ${value.swatch?.color}">
        <span class="sr-only">${value.name}</span>
      </button>
    </template>
  </nosto-variant-selector>
</nosto-simple-card>

<style>
  .color-swatch {
    width: 32px;
    height: 32px;
    border: 2px solid #e5e5e5;
    border-radius: 50%;
    cursor: pointer;
  }
  .color-swatch:hover {
    border-color: #333;
  }
  .color-swatch[aria-pressed="true"] {
    border-color: #000;
    box-shadow: 0 0 0 2px white, 0 0 0 4px #000;
  }
</style>
```

#### Model 2: Image-Based Swatches (Fabric Patterns, Textures)

**Data Source**: Shopify Storefront API `swatch.image` field

```html
<nosto-simple-card handle="fabric-product" brand discount>
  <nosto-variant-selector handle="fabric-product">
    <template data-option="Pattern">
      <button 
        class="pattern-swatch"
        data-option-value="${value.name}"
        style="background-image: url(${value.swatch?.image?.url})">
        <span class="sr-only">${value.name}</span>
      </button>
    </template>
  </nosto-variant-selector>
</nosto-simple-card>

<style>
  .pattern-swatch {
    width: 48px;
    height: 48px;
    border: 2px solid #e5e5e5;
    border-radius: 4px;
    background-size: cover;
    background-position: center;
    cursor: pointer;
  }
</style>
```

#### Model 3: Metafield-Based Colors (Legacy/Custom Implementation)

**Data Source**: Product variant metafields or custom app metaobjects

First, extend the GraphQL query to fetch metafields:

```graphql
query ProductByHandle($handle: String!) {
  product(handle: $handle) {
    id
    handle
    title
    options {
      id
      name
      optionValues {
        id
        name
      }
    }
    variants(first: 100) {
      nodes {
        id
        title
        selectedOptions {
          name
          value
        }
        metafield(namespace: "custom", key: "color_hex") {
          value
        }
      }
    }
  }
}
```

Then create a custom mapping function:

```javascript
// Map variant metafields to option values
function buildColorSwatchMap(product) {
  const colorMap = new Map()
  
  product.variants.nodes.forEach(variant => {
    const colorOption = variant.selectedOptions.find(opt => opt.name === 'Color')
    const hexValue = variant.metafield?.value
    
    if (colorOption && hexValue) {
      colorMap.set(colorOption.value, hexValue)
    }
  })
  
  return colorMap
}

// Apply to variant selector
const colorSwatches = buildColorSwatchMap(productData)
document.querySelectorAll('[data-option-name="Color"] button').forEach(btn => {
  const value = btn.dataset.optionValue
  const hex = colorSwatches.get(value)
  if (hex) {
    btn.style.backgroundColor = hex
  }
})
```

#### Model 4: File-Based Color Mapping (JSON Configuration)

**Data Source**: Static JSON file mapping color names to hex values

```javascript
// colors.json
{
  "Midnight Black": "#1a1a1a",
  "Ocean Blue": "#006699",
  "Forest Green": "#228b22",
  "Sunset Red": "#ff4500"
}

// Implementation
async function applyFileBasedSwatches(colorOptionName) {
  const colorMap = await fetch('/config/colors.json').then(r => r.json())
  
  document.querySelectorAll(`[data-option-name="${colorOptionName}"] button`).forEach(btn => {
    const colorName = btn.dataset.optionValue
    const hex = colorMap[colorName]
    if (hex) {
      btn.classList.add('color-swatch')
      btn.style.backgroundColor = hex
    }
  })
}

// Usage
document.addEventListener('DOMContentLoaded', () => {
  applyFileBasedSwatches('Color')
})
```

#### Model 5: Metaobject-Based Swatch Library

**Data Source**: Shopify Metaobjects as centralized swatch definitions

```graphql
query GetSwatchLibrary {
  metaobjects(type: "color_swatch", first: 100) {
    nodes {
      id
      handle
      fields {
        key
        value
      }
    }
  }
}

# Example metaobject structure:
# - handle: "midnight-black"
# - fields:
#   - display_name: "Midnight Black"
#   - hex_value: "#1a1a1a"
#   - image_url: "https://cdn.shopify.com/..."
```

Implementation:

```javascript
class SwatchLibrary {
  constructor() {
    this.swatches = new Map()
  }
  
  async load() {
    const response = await fetch('/apps/nosto/swatches')
    const data = await response.json()
    
    data.metaobjects.nodes.forEach(obj => {
      const fields = Object.fromEntries(
        obj.fields.map(f => [f.key, f.value])
      )
      this.swatches.set(fields.display_name, {
        hex: fields.hex_value,
        image: fields.image_url
      })
    })
  }
  
  get(colorName) {
    return this.swatches.get(colorName)
  }
  
  apply(selector) {
    document.querySelectorAll(selector).forEach(btn => {
      const colorName = btn.textContent.trim()
      const swatch = this.get(colorName)
      
      if (swatch) {
        if (swatch.hex) {
          btn.style.backgroundColor = swatch.hex
        }
        if (swatch.image) {
          btn.style.backgroundImage = `url(${swatch.image})`
        }
      }
    })
  }
}

// Usage
const swatchLib = new SwatchLibrary()
await swatchLib.load()
swatchLib.apply('[data-option-name="Color"] button')
```

### CSS Custom Properties for Swatch Styling

The `nosto-variant-selector` component exposes CSS variables for swatch customization:

```css
nosto-variant-selector {
  --value-bg: #ffffff;
  --value-border: #e5e5e5;
  --value-padding: 8px 16px;
  
  --value-hover-bg: #f5f5f5;
  
  --value-active-bg: #000000;
  --value-active-color: #ffffff;
  
  --value-unavailable-opacity: 0.3;
  
  --values-gap: 8px;
}

/* Custom swatch sizes */
nosto-variant-selector::part(value) {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 0;
}

/* Active state ring */
nosto-variant-selector::part(active) {
  box-shadow: 0 0 0 2px white, 0 0 0 4px #000;
}

/* Unavailable swatches */
nosto-variant-selector::part(unavailable) {
  position: relative;
}

nosto-variant-selector::part(unavailable)::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  height: 2px;
  background: red;
  transform: rotate(-45deg);
}
```

---

## SKU Alternatives & Data Sources

### Default: Shopify Storefront API

The standard implementation fetches product data from Shopify's Storefront GraphQL API:

```javascript
// Automatic in SimpleCard component
<nosto-simple-card handle="product-handle"></nosto-simple-card>
```

This queries:
- Product options and option values
- Variant availability and pricing
- Adjacent variants for option combinations
- First selectable variant per option value

### Extending with Metafields

To include custom data like size charts, materials, or care instructions:

#### Step 1: Extend GraphQL Query

Create a custom GraphQL fragment in your theme:

```graphql
# extensions/product-card-fields.graphql
fragment ExtendedProductFields on Product {
  id
  handle
  title
  
  # Standard fields
  options {
    id
    name
    optionValues {
      id
      name
      swatch { color image { url } }
    }
  }
  
  # Extended metafields
  sizeChart: metafield(namespace: "custom", key: "size_chart") {
    value
    reference {
      ... on Metaobject {
        fields { key value }
      }
    }
  }
  
  fabricInfo: metafield(namespace: "custom", key: "fabric_composition") {
    value
  }
  
  # Variant-level metafields
  variants(first: 100) {
    nodes {
      id
      title
      selectedOptions { name value }
      sku
      weight: metafield(namespace: "custom", key: "weight_grams") {
        value
      }
      dimensions: metafield(namespace: "custom", key: "dimensions") {
        value
      }
    }
  }
}
```

#### Step 2: Create Custom Fetch Function

```javascript
// lib/fetchExtendedProduct.js
import { graphqlRequest } from '@/shopify/graphql/client'
import { convertProduct } from '@/components/SimpleCard/convertProduct'

export async function fetchExtendedProduct(handle) {
  const query = `
    query ExtendedProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ExtendedProductFields
      }
    }
    ${ExtendedProductFieldsFragment}
  `
  
  const response = await graphqlRequest(query, { handle })
  const product = response.data.product
  
  // Attach metafields to product object
  return {
    ...convertProduct(product),
    metafields: {
      sizeChart: product.sizeChart?.reference?.fields || null,
      fabricInfo: product.fabricInfo?.value || null
    },
    variants: product.variants.nodes.map(v => ({
      ...v,
      weight: v.weight?.value,
      dimensions: v.dimensions?.value
    }))
  }
}
```

#### Step 3: Use Extended Data in SimpleCard

```html
<nosto-simple-card handle="extended-product" brand discount>
  <nosto-variant-selector handle="extended-product"></nosto-variant-selector>
  
  <!-- Size chart from metaobject -->
  <details class="size-chart">
    <summary>Size Chart</summary>
    <div data-metafield="sizeChart"></div>
  </details>
  
  <!-- Fabric info from metafield -->
  <div class="fabric-info" data-metafield="fabricInfo"></div>
  
  <button n-atc>Add to Cart</button>
</nosto-simple-card>

<script type="module">
  import { fetchExtendedProduct } from './lib/fetchExtendedProduct.js'
  
  const card = document.querySelector('nosto-simple-card')
  
  card.addEventListener('@nosto/SimpleCard/rendered', async () => {
    const extendedData = await fetchExtendedProduct(card.handle)
    
    // Populate size chart
    const sizeChartEl = card.querySelector('[data-metafield="sizeChart"]')
    if (extendedData.metafields.sizeChart) {
      sizeChartEl.innerHTML = renderSizeChart(extendedData.metafields.sizeChart)
    }
    
    // Populate fabric info
    const fabricEl = card.querySelector('[data-metafield="fabricInfo"]')
    if (extendedData.metafields.fabricInfo) {
      fabricEl.textContent = extendedData.metafields.fabricInfo
    }
  })
</script>
```

### SKU Alternatives from Collections

Fetch related products or alternative SKUs from collections:

```javascript
// Fetch collection products as SKU alternatives
async function fetchCollectionAlternatives(collectionHandle, currentProductId) {
  const query = `
    query CollectionProducts($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        products(first: $first) {
          nodes {
            id
            handle
            title
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            images(first: 1) {
              nodes { url altText }
            }
            variants(first: 1) {
              nodes { id }
            }
          }
        }
      }
    }
  `
  
  const response = await graphqlRequest(query, { 
    handle: collectionHandle, 
    first: 20 
  })
  
  return response.data.collection.products.nodes
    .filter(p => p.id !== currentProductId)
    .slice(0, 4) // Limit to 4 alternatives
}

// Usage in product card
const alternatives = await fetchCollectionAlternatives(
  'similar-products', 
  'gid://shopify/Product/1234567890'
)

// Render as alternative SKU cards
const alternativesHTML = alternatives.map(product => `
  <nosto-simple-card 
    handle="${product.handle}"
    class="alternative-sku">
  </nosto-simple-card>
`).join('')

document.querySelector('.alternatives-container').innerHTML = alternativesHTML
```

### Cross-Sell with Nosto Recommendations

Integrate Nosto product recommendations as SKU alternatives:

```html
<nosto-campaign placement="pdp-alternatives">
  <template>
    <div class="sku-alternatives">
      <h3>You May Also Like</h3>
      <div class="alternatives-grid">
        <nosto-simple-card
          v-for="product in products"
          :handle="product.handle"
          brand
          discount>
        </nosto-simple-card>
      </div>
    </div>
  </template>
</nosto-campaign>
```

### Bundling Multiple SKUs

Use the `nosto-bundle` component for multi-SKU product bundles:

```html
<nosto-campaign placement="product-bundle">
  <template>
    <nosto-bundle .products="products" :result-id="resultId">
      <div class="bundle-grid">
        <nosto-simple-card
          v-for="product in products"
          :handle="product.handle"
          brand
          discount>
          <nosto-variant-selector 
            :handle="product.handle" 
            preselect>
          </nosto-variant-selector>
        </nosto-simple-card>
      </div>
      
      <div class="bundle-summary">
        <h4>Complete the Bundle</h4>
        <ul>
          <li v-for="product in products">
            <label>
              <input type="checkbox" :value="product.productId" checked />
              {{ product.name }} - <span n-price></span>
            </label>
          </li>
        </ul>
        <p class="bundle-total">
          Total: <strong><span n-summary-price></span></strong>
        </p>
        <button n-atc>Add Bundle to Cart</button>
      </div>
    </nosto-bundle>
  </template>
</nosto-campaign>
```

---

## Advanced Styling & Customization

### CSS Parts Reference

SimpleCard exposes the following CSS parts for external styling:

```css
/* Card container */
nosto-simple-card::part(card) {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
}

/* Product link wrapper */
nosto-simple-card::part(link) {
  text-decoration: none;
  color: inherit;
}

/* Content container */
nosto-simple-card::part(content) {
  padding: 16px;
}

/* Brand/vendor text */
nosto-simple-card::part(brand) {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
}

/* Product title */
nosto-simple-card::part(title) {
  font-size: 16px;
  font-weight: 600;
  margin: 8px 0;
}

/* Price container */
nosto-simple-card::part(price) {
  display: flex;
  gap: 8px;
  align-items: baseline;
}

/* Current/sale price */
nosto-simple-card::part(price-current) {
  font-size: 18px;
  font-weight: 700;
  color: #000;
}

/* Original/compare-at price */
nosto-simple-card::part(price-original) {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

/* Product image */
nosto-simple-card::part(image) {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* Star rating display */
nosto-simple-card::part(rating) {
  color: #ffa500;
  font-size: 14px;
}

/* Carousel indicators container */
nosto-simple-card::part(carousel-indicators) {
  display: flex;
  gap: 4px;
  justify-content: center;
  padding: 8px 0;
}

/* Individual carousel indicator */
nosto-simple-card::part(carousel-indicator) {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
}

nosto-simple-card::part(carousel-indicator).active {
  background: #000;
}
```

### Complete Theme Example

```css
/* Modern card theme */
nosto-simple-card {
  display: block;
  transition: transform 0.2s;
}

nosto-simple-card:hover {
  transform: translateY(-4px);
}

nosto-simple-card::part(card) {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s;
}

nosto-simple-card:hover::part(card) {
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

nosto-simple-card::part(image) {
  aspect-ratio: 1;
  object-fit: cover;
  transition: opacity 0.3s;
}

nosto-simple-card::part(content) {
  padding: 20px;
}

nosto-simple-card::part(brand) {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #888;
  text-transform: uppercase;
  margin-bottom: 4px;
}

nosto-simple-card::part(title) {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

nosto-simple-card::part(price) {
  display: flex;
  gap: 10px;
  align-items: baseline;
  margin-top: 8px;
}

nosto-simple-card::part(price-current) {
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
}

nosto-simple-card::part(price-original) {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

nosto-simple-card::part(rating) {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  color: #f59e0b;
  font-size: 13px;
}

/* Carousel styling */
nosto-simple-card::part(carousel-indicators) {
  display: flex;
  gap: 6px;
  justify-content: center;
  padding: 12px 0 8px;
}

nosto-simple-card::part(carousel-indicator) {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d1d5db;
  cursor: pointer;
  transition: all 0.2s;
}

nosto-simple-card::part(carousel-indicator).active {
  background: #1a1a1a;
  width: 24px;
  border-radius: 3px;
}

/* Nested variant selector styling */
nosto-simple-card nosto-variant-selector {
  margin: 16px 0;
  --value-padding: 10px 16px;
  --value-border: #d1d5db;
  --value-hover-bg: #f3f4f6;
  --value-active-bg: #1a1a1a;
  --value-active-color: #fff;
  --values-gap: 8px;
}

/* Add to cart button */
nosto-simple-card button[n-atc] {
  width: 100%;
  padding: 12px 24px;
  margin-top: 16px;
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

nosto-simple-card button[n-atc]:hover {
  background: #000;
}
```

### Dark Mode Support

```css
@media (prefers-color-scheme: dark) {
  nosto-simple-card::part(card) {
    background: #1a1a1a;
    border-color: #333;
  }
  
  nosto-simple-card::part(title),
  nosto-simple-card::part(price-current) {
    color: #fff;
  }
  
  nosto-simple-card::part(brand) {
    color: #aaa;
  }
  
  nosto-simple-card button[n-atc] {
    background: #fff;
    color: #1a1a1a;
  }
  
  nosto-simple-card button[n-atc]:hover {
    background: #e5e5e5;
  }
}
```

---

## Complete Implementation Examples

### Example 1: Native Shopify Product Card Clone

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Native Product Card</title>
  <script type="module" src="https://cdn.nosto.com/web-components/latest.js"></script>
  <style>
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    /* Import card styling from above */
  </style>
</head>
<body>
  <div class="product-grid">
    <nosto-simple-card
      handle="awesome-sneakers"
      image-mode="alternate"
      brand
      discount
      rating="4.5">
      <nosto-variant-selector 
        handle="awesome-sneakers" 
        preselect>
      </nosto-variant-selector>
      <button n-atc>Add to Cart</button>
    </nosto-simple-card>
    
    <nosto-simple-card
      handle="classic-tee"
      image-mode="alternate"
      brand
      discount>
      <nosto-variant-selector 
        handle="classic-tee" 
        preselect>
      </nosto-variant-selector>
      <button n-atc>Quick Add</button>
    </nosto-simple-card>
  </div>
  
  <script type="module">
    import { setSimpleCardDefaults } from '@nosto/web-components'
    
    // Global configuration
    setSimpleCardDefaults({
      brand: true,
      discount: true,
      imageMode: 'alternate',
      imageSizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px'
    })
  </script>
</body>
</html>
```

### Example 2: Advanced Swatch Integration with Metaobjects

```html
<nosto-simple-card handle="designer-jacket" brand discount>
  <nosto-variant-selector 
    handle="designer-jacket" 
    preselect
    class="swatch-enabled">
  </nosto-variant-selector>
  
  <button n-atc>Add to Cart - <span n-price></span></button>
</nosto-simple-card>

<script type="module">
  // Fetch swatch library from metaobjects
  async function loadSwatchLibrary() {
    const query = `
      query SwatchLibrary {
        metaobjects(type: "color_swatch", first: 100) {
          nodes {
            handle
            fields {
              key
              value
            }
          }
        }
      }
    `
    
    const response = await fetch('/api/2024-01/graphql.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })
    
    const data = await response.json()
    const swatches = new Map()
    
    data.data.metaobjects.nodes.forEach(obj => {
      const fields = Object.fromEntries(
        obj.fields.map(f => [f.key, f.value])
      )
      swatches.set(fields.color_name, fields.hex_code)
    })
    
    return swatches
  }
  
  // Apply swatches after variant selector renders
  document.addEventListener('DOMContentLoaded', async () => {
    const swatchLib = await loadSwatchLibrary()
    const selector = document.querySelector('nosto-variant-selector.swatch-enabled')
    
    // Wait for variant selector to render
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Apply color swatches
    const colorButtons = selector.shadowRoot.querySelectorAll('[data-option-name="Color"] button')
    colorButtons.forEach(btn => {
      const colorName = btn.textContent.trim()
      const hexCode = swatchLib.get(colorName)
      
      if (hexCode) {
        btn.classList.add('color-swatch')
        btn.style.backgroundColor = hexCode
        btn.innerHTML = `<span class="sr-only">${colorName}</span>`
      }
    })
  })
</script>

<style>
  nosto-variant-selector.swatch-enabled::part(value) {
    min-width: 44px;
    min-height: 44px;
    border-radius: 50%;
    padding: 0;
    border: 2px solid #e5e5e5;
  }
  
  nosto-variant-selector.swatch-enabled::part(active) {
    border-color: #000;
    box-shadow: 0 0 0 2px white, 0 0 0 4px #000;
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
```

### Example 3: Collection-Based SKU Alternatives

```html
<div class="product-page">
  <div class="main-product">
    <nosto-simple-card 
      handle="premium-backpack" 
      image-mode="carousel"
      brand 
      discount 
      rating="4.8">
      <nosto-variant-selector handle="premium-backpack" preselect></nosto-variant-selector>
      
      <!-- Size chart from metaobject -->
      <details class="size-guide">
        <summary>Size Guide</summary>
        <div id="size-chart-content"></div>
      </details>
      
      <button n-atc>Add to Cart</button>
    </nosto-simple-card>
  </div>
  
  <aside class="alternatives">
    <h3>Similar Styles</h3>
    <div class="alternatives-grid" id="alternatives-container"></div>
  </aside>
</div>

<script type="module">
  import { graphqlRequest } from '@/shopify/graphql/client'
  
  async function loadAlternatives(collectionHandle, excludeProductId) {
    const query = `
      query CollectionAlternatives($handle: String!) {
        collection(handle: $handle) {
          products(first: 4) {
            nodes {
              id
              handle
              title
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                nodes {
                  url(transform: { maxWidth: 300 })
                  altText
                }
              }
            }
          }
        }
      }
    `
    
    const response = await graphqlRequest(query, { handle: collectionHandle })
    return response.data.collection.products.nodes
      .filter(p => p.id !== excludeProductId)
  }
  
  // Load alternatives when page loads
  document.addEventListener('DOMContentLoaded', async () => {
    const mainCard = document.querySelector('nosto-simple-card')
    
    // Wait for main card to load product data
    mainCard.addEventListener('@nosto/SimpleCard/rendered', async () => {
      const alternatives = await loadAlternatives('backpacks-collection', mainCard.productId)
      
      const container = document.getElementById('alternatives-container')
      container.innerHTML = alternatives.map(product => `
        <nosto-simple-card
          handle="${product.handle}"
          image-mode="alternate"
          brand
          discount>
        </nosto-simple-card>
      `).join('')
    })
  })
</script>

<style>
  .product-page {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 48px;
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .alternatives-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  
  .size-guide {
    margin: 16px 0;
    padding: 12px;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
  }
  
  .size-guide summary {
    cursor: pointer;
    font-weight: 600;
  }
  
  @media (max-width: 1024px) {
    .product-page {
      grid-template-columns: 1fr;
    }
    
    .alternatives-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  @media (max-width: 640px) {
    .alternatives-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
```

### Example 4: Dynamic Bundle with Multiple SimpleCards

```html
<nosto-campaign placement="bundle-upsell">
  <template>
    <div class="bundle-container">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
      
      <nosto-bundle .products="products" :result-id="resultId" summary="Bundle Total: {total}">
        <div class="bundle-products">
          <div 
            v-for="product in products" 
            class="bundle-item"
            :data-product-id="product.productId">
            <nosto-simple-card
              :handle="product.handle"
              brand
              discount
              image-mode="alternate">
              <nosto-variant-selector 
                :handle="product.handle" 
                preselect>
              </nosto-variant-selector>
            </nosto-simple-card>
            
            <label class="bundle-checkbox">
              <input 
                type="checkbox" 
                :value="product.productId" 
                checked 
                @change="updateBundleTotal" />
              <span>Include this item</span>
            </label>
          </div>
        </div>
        
        <div class="bundle-footer">
          <div class="bundle-pricing">
            <p class="bundle-savings">Save {{ discount }}%</p>
            <p class="bundle-total">
              <strong>Bundle Total:</strong> 
              <span n-summary-price></span>
            </p>
          </div>
          <button n-atc class="bundle-cta">Add Bundle to Cart</button>
        </div>
      </nosto-bundle>
    </div>
  </template>
</nosto-campaign>

<style>
  .bundle-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px;
  }
  
  .bundle-products {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin: 24px 0;
  }
  
  .bundle-item {
    position: relative;
    border: 2px solid #e5e5e5;
    border-radius: 8px;
    padding: 16px;
    transition: border-color 0.2s;
  }
  
  .bundle-item:has(input:checked) {
    border-color: #000;
  }
  
  .bundle-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    cursor: pointer;
  }
  
  .bundle-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 32px;
    padding: 24px;
    background: #f9fafb;
    border-radius: 8px;
  }
  
  .bundle-pricing {
    text-align: left;
  }
  
  .bundle-savings {
    color: #059669;
    font-weight: 600;
    margin: 0 0 8px 0;
  }
  
  .bundle-total {
    font-size: 20px;
    margin: 0;
  }
  
  .bundle-cta {
    padding: 16px 32px;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .bundle-cta:hover {
    background: #333;
  }
</style>
```

---

## Performance Optimization

### 1. Lazy Loading & Intersection Observer

Defer card rendering until they're visible in viewport:

```javascript
// Lazy load product cards
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target
      card.removeAttribute('data-lazy')
      cardObserver.unobserve(card)
    }
  })
}, {
  rootMargin: '200px' // Start loading 200px before entering viewport
})

// Mark cards as lazy
document.querySelectorAll('nosto-simple-card[data-lazy]').forEach(card => {
  card.setAttribute('loading', 'true')
  cardObserver.observe(card)
})
```

```html
<!-- HTML Usage -->
<nosto-simple-card handle="product-1" data-lazy></nosto-simple-card>
<nosto-simple-card handle="product-2" data-lazy></nosto-simple-card>
<nosto-simple-card handle="product-3" data-lazy></nosto-simple-card>
```

### 2. Image Optimization

Use responsive image sizes and modern formats:

```html
<nosto-simple-card
  handle="product"
  image-mode="alternate"
  image-sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px">
</nosto-simple-card>
```

Shopify automatically serves WebP when supported by the browser.

### 3. Caching Strategies

Implement caching for frequently accessed products:

```javascript
// Simple in-memory cache
const productCache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function cachedFetchProduct(handle) {
  const cached = productCache.get(handle)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  
  const data = await fetchProduct(handle)
  productCache.set(handle, {
    data,
    timestamp: Date.now()
  })
  
  return data
}
```

### 4. Batch GraphQL Queries

Fetch multiple products in a single request:

```javascript
async function fetchMultipleProducts(handles) {
  const query = `
    query MultipleProducts($handles: [String!]!) {
      products(first: 50, query: $handles) {
        nodes {
          id
          handle
          title
          # ... rest of fields
        }
      }
    }
  `
  
  const handlesQuery = handles.map(h => `handle:${h}`).join(' OR ')
  const response = await graphqlRequest(query, { handles: handlesQuery })
  
  return response.data.products.nodes
}

// Usage
const products = await fetchMultipleProducts([
  'product-1',
  'product-2',
  'product-3'
])

products.forEach(product => {
  const card = document.querySelector(`[handle="${product.handle}"]`)
  if (card) {
    card.product = product
    card.render()
  }
})
```

### 5. Preloading Critical Resources

Preload fonts and critical images:

```html
<head>
  <!-- Preload fonts -->
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- Preload first product image -->
  <link rel="preload" as="image" href="https://cdn.shopify.com/s/files/1/0000/0000/products/hero-product.jpg">
  
  <!-- Preconnect to Shopify CDN -->
  <link rel="preconnect" href="https://cdn.shopify.com">
</head>
```

### 6. Debouncing Variant Changes

Prevent excessive API calls when users rapidly change variants:

```javascript
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

const debouncedVariantChange = debounce((detail) => {
  // Update card with new variant
  console.log('Variant changed:', detail)
}, 300)

card.addEventListener('@nosto/variantchange', (e) => {
  debouncedVariantChange(e.detail)
})
```

---

## Summary

This guide covers:

✅ **Core Configuration**: All SimpleCard attributes and global defaults  
✅ **Variant Selection**: Integration with `nosto-variant-selector` and custom implementations  
✅ **Swatch Rendering**: 5 different persistence models (Native, Image, Metafield, File, Metaobject)  
✅ **SKU Alternatives**: Metafields, Collections, Nosto Recommendations, Bundles  
✅ **Advanced Styling**: CSS Parts, theme examples, dark mode  
✅ **Complete Examples**: 4 production-ready implementations  
✅ **Performance**: Lazy loading, caching, batch queries, preloading  

For additional support, consult the component documentation or reach out to the Nosto development team.
