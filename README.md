# Nosto Web Components

This repository contains a collection of custom elements designed to integrate Nosto's personalization and e-commerce solutions into various web platforms.

## Usage

Usage options for this library are documented [here](https://docs.nosto.com/techdocs/apis/frontend/oss/web-components/loading-web-components)

## Components

This package provides the following custom elements:

### Store level templating

| Component       | Tag Name                 | Description                                            | Notes        |
| --------------- | ------------------------ | ------------------------------------------------------ | ------------ |
| Campaign        | `nosto-campaign`         | Campaign rendering and product recommendation display  |              |           
| Control         | `nosto-control`          | Conditional content rendering based on user segments   |              |
| Popup           | `nosto-popup`            | Popup content with dialog and ribbon slots             |              |
| SectionCampaign | `nosto-section-campaign` | Campaign rendering using the Section Rendering API     | Shopify only |

### Campaign level templating

| Component       | Tag Name                 | Description                                     | Notes        |
| --------------- | ------------------------ | ----------------------------------------------- | ------------ |
| DynamicCard     | `nosto-dynamic-card`     | Dynamic product card templating                 | Shopify only |
| Image           | `nosto-image`            | Progressive image enhancement with optimization |              |
| Product         | `nosto-product`          | Product interaction and cart management         |              |
| SimpleCard      | `nosto-simple-card`      | Simple product card templating                  | Shopify only |
| SkuOptions      | `nosto-sku-options`      | Product variant and SKU selection interface     |              |
| VariantSelector | `nosto-variant-selector` | Product variant options as clickable pills      | Shopify only |

## Documentation

Read our [Techdocs](https://docs.nosto.com/techdocs/apis/frontend/oss/web-components) for more information on how to use these components.

[Library TypeDoc page](https://nosto.github.io/web-components) includes detailed library documentation.

[Interactive Storybook](https://nosto.github.io/web-components/storybook/) provides live examples and documentation for each component.

### Usage Examples

Component usage examples are located in dedicated `examples.md` files alongside each component:

- [`src/components/Campaign/examples.md`](src/components/Campaign/examples.md)
- [`src/components/Control/examples.md`](src/components/Control/examples.md)  
- [`src/components/DynamicCard/examples.md`](src/components/DynamicCard/examples.md)
- [`src/components/Image/examples.md`](src/components/Image/examples.md)
- [`src/components/Popup/examples.md`](src/components/Popup/examples.md)
- [`src/components/Product/examples.md`](src/components/Product/examples.md)
- [`src/components/SectionCampaign/examples.md`](src/components/SectionCampaign/examples.md)
- [`src/components/SimpleCard/examples.md`](src/components/SimpleCard/examples.md)
- [`src/components/SkuOptions/examples.md`](src/components/SkuOptions/examples.md)
- [`src/components/VariantSelector/examples.md`](src/components/VariantSelector/examples.md)

These examples are automatically included in the [generated TypeDoc documentation](https://nosto.github.io/web-components) as separate pages for each component.
