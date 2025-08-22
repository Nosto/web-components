# Nosto Web Components

This repository contains a collection of web components designed to integrate Nosto's personalization and e-commerce solutions into various web platforms.

## Usage

Usage options for this library are documented [here](https://docs.nosto.com/techdocs/apis/frontend/oss/web-components/loading-web-components)

### Individual Component Imports

You can import individual components for smaller bundle sizes:

```javascript
// Import only the specific component you need
import { NostoImage } from '@nosto/web-components/NostoImage'
import { NostoProduct } from '@nosto/web-components/NostoProduct'
import { NostoCampaign } from '@nosto/web-components/NostoCampaign'
```

Or import the entire bundle:

```javascript
// Import all components
import { NostoCampaign, NostoImage, NostoProduct } from '@nosto/web-components'
```

### CDN Usage

Individual components can also be loaded via CDN:

```html
<!-- Load only specific components -->
<script type="module" src="https://unpkg.com/@nosto/web-components/dist/NostoImage.es.js"></script>
<script type="module" src="https://unpkg.com/@nosto/web-components/dist/NostoProduct.es.js"></script>

<!-- Or load the complete bundle -->
<script type="module" src="https://unpkg.com/@nosto/web-components/dist/main.es.bundle.js"></script>
```

## Components

This package provides the following web components:

### Store level templating

| Component     | Description                                           |
| ------------- | ----------------------------------------------------- |
| NostoCampaign | Campaign rendering and product recommendation display |
| NostoControl  | Conditional content rendering based on user segments |

### Campaign level templating

| Component         | Description                                                         |
| ----------------- | ------------------------------------------------------------------- |
| NostoDynamicCard  | Dynamic product card templating (Shopify only)                     |
| NostoImage        | Progressive image enhancement with optimization                     |
| NostoProduct      | Product interaction and cart management                             |
| NostoProductCard  | Product card templating for recommendations                         |
| NostoSkuOptions   | Product variant and SKU selection interface                         |

## Documentation

Read our [Techdocs](https://docs.nosto.com/techdocs/apis/frontend/oss/web-components) for more information on how to use these components.

[Library TypeDoc page](https://nosto.github.io/web-components) includes detailed library documentation.