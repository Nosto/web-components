## Examples

### Basic product with SKU selector dropdown

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

```html
<nosto-product product-id="123" reco-id="front-page">
  <div n-sku-id="456">
    <span n-atc>Blue</span>
  </div>,
  <div n-sku-id="101">
    <span n-atc>Black</span>
  </div>
</nosto-product>
```