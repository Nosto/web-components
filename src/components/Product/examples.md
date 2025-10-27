## Examples

### Basic product with SKU selector dropdown

This example shows a product component with a dropdown-style SKU selector. The `n-sku-selector` attribute on the select element allows users to choose between different product variants, while the `n-atc` button handles adding the selected variant to cart.

```html
<nosto-product product-id="123" reco-id="front-page">
  <select n-sku-selector>
    <option value="sku1">Option 1</option>
    <option value="sku2">Option 2</option>
  </select>
  <button n-atc>Add to Cart</button>
</nosto-product>
```

### Product with individual SKU elements

This demonstrates an alternative SKU selection method using individual elements with `n-sku-id` attributes. Each element represents a specific SKU variant and can be clicked to select that variant and add it to cart. This approach is useful for visual variant selection like color swatches or size buttons.

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