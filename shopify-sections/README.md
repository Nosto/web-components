# Shopify Section Definitions

This directory contains Shopify section definition files (`.liquid`) that work with Nosto web components. These sections are designed to be copied into a Shopify theme's `sections/` directory.

## Nosto Search Products Section

### Overview

The `nosto-search-products.liquid` section is designed to work with Shopify's Section Rendering API and the `nosto-section-campaign` web component. It renders products based on a colon-separated list of product handles passed via the search query parameter.

### Features

- ✅ Accepts colon-separated product handles via `search.terms` (from `q` parameter)
- ✅ Looks up products using `all_products[handle]`
- ✅ Renders configurable blocks for each product with product binding
- ✅ Fully customizable through Shopify's theme editor
- ✅ Compatible with the Search page template

### Installation

1. Copy `nosto-search-products.liquid` to your Shopify theme's `sections/` directory
2. The section will be available in the theme editor for the Search page template

### Usage with nosto-section-campaign

```html
<nosto-section-campaign 
  placement="front-page" 
  section="nosto-search-products">
</nosto-section-campaign>
```

The `nosto-section-campaign` component will:
1. Fetch product recommendations from Nosto
2. Extract product handles
3. Call the Section Rendering API with handles as: `?q=handle1:handle2:handle3`
4. Render the section with the products

### How It Works

1. **Input**: The section receives a colon-separated list of product handles via the `q` URL parameter
   - Example: `?q=product-handle-1:product-handle-2:product-handle-3`

2. **Processing**: 
   - The `search.terms` Liquid variable contains the query string
   - Handles are split using the `:` delimiter
   - Each handle is used to lookup the product via `all_products[handle]`

3. **Rendering**:
   - All configured blocks are rendered for each product
   - The `product` variable is available within each block's context
   - Blocks can be added, removed, and reordered in the theme editor

### Available Blocks

The section supports the following block types:

- **Product Image**: Displays the product's featured image with configurable width
- **Product Title**: Shows the product title with configurable font size
- **Product Price**: Displays the price (and compare-at price if on sale)
- **Product Description**: Shows a truncated product description
- **Product Vendor**: Displays the product vendor/brand
- **Product Button**: A customizable button/link to the product page
- **Custom Liquid**: Allows custom Liquid code with access to the product variable

### Section Settings

Customize the section appearance through these settings:

- **Heading**: Optional heading text (supports `nosto-title` attribute for dynamic titles)
- **Description**: Optional description text
- **Products per row**: Grid columns (1-6)
- **Grid gap**: Space between products (0-50px)
- **Empty state message**: Message shown when no products are found

### Block Settings

Each block type has its own settings:

- **Product Image**: Image width (100-800px)
- **Product Title**: Title font size (12-32px)
- **Product Description**: Character limit (50-500 characters)
- **Product Button**: Customizable button text
- **Custom Liquid**: Full access to Liquid code

### Example: Manual Testing

To test the section manually without the web component:

1. Install the section in your theme
2. Navigate to: `/search?section_id=nosto-search-products&q=product-1:product-2:product-3`
3. Replace the handles with actual product handles from your store

### Template Compatibility

This section is configured for the `search` template but can be adapted for other templates by modifying the `templates` array in the schema.

### Best Practices

1. **Block Configuration**: Set up default blocks in the theme editor to match your design system
2. **Performance**: The section uses lazy loading for images
3. **Accessibility**: All images include proper alt text
4. **Fallbacks**: The section gracefully handles missing products or empty results
5. **Customization**: Use the Custom Liquid block for advanced use cases

### Technical Details

- **Liquid Version**: Compatible with Shopify's latest Liquid version
- **Section Rendering API**: Fully compatible with Shopify's Section Rendering API
- **Product Lookup**: Uses `all_products[handle]` for efficient product access
- **Block Rendering**: Supports dynamic block ordering and configuration

### Troubleshooting

**No products showing?**
- Verify product handles are correct and products exist
- Check that handles are colon-separated: `handle1:handle2:handle3`
- Ensure the section is properly installed in the theme

**Styling issues?**
- The section uses minimal inline styles for layout
- Add custom CSS targeting `.nosto-search-products` classes
- Use your theme's existing button and typography classes

**Empty results?**
- Check the "Empty state message" setting
- Verify the `search.terms` parameter contains valid handles
- Test with known product handles from your store

### Advanced Usage

#### Custom Styling

Target specific elements with CSS:

```css
.nosto-search-products__heading {
  /* Heading styles */
}

.nosto-search-products__grid {
  /* Grid container styles */
}

.nosto-search-products__item {
  /* Individual product card styles */
}
```

#### Custom Liquid Block Example

Use the Custom Liquid block for advanced features:

```liquid
{% if product.tags contains 'new' %}
  <span class="badge badge--new">New</span>
{% endif %}

{% if product.available %}
  <span class="badge badge--in-stock">In Stock</span>
{% else %}
  <span class="badge badge--sold-out">Sold Out</span>
{% endif %}
```

## Support

For more information about Nosto web components, visit:
- [Nosto Web Components Documentation](https://docs.nosto.com/techdocs/apis/frontend/oss/web-components)
- [Interactive Storybook](https://nosto.github.io/web-components/storybook/)
- [GitHub Repository](https://github.com/Nosto/web-components)
