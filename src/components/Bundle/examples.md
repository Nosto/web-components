## Examples

### Basic Bundle with Campaign

This example demonstrates a product bundle inside a campaign context.

```html
<nosto-campaign placement="frontpage-nosto-bundle">
  <template>
    <nosto-bundle .products="products" :result-id="resultId">
      <div class="bundle-grid">
        <nosto-simple-card
          v-for="product in products"
          :handle="product.handle"
        ></nosto-simple-card>
      </div>

      <div class="bundle-controls">
        <h4>{{ title }}</h4>
        <ul>
          <li v-for="product in products">
            <label>
              <input type="checkbox" :value="product.productId" checked />
              Include {{ product.name }} - ${{ product.price }}
            </label>
          </li>
        </ul>
        <button n-atc>Add Bundle to Cart</button>
        <span n-summary-price></span>
      </div>
    </nosto-bundle>
  </template>
</nosto-campaign>
```

### Bundle with Custom Summary Template

This example shows how to customize the summary text using the `template` property with placeholders.

```html
<nosto-campaign placement="frontpage-bundle-custom">
  <template>
    <nosto-bundle 
      .products="products" 
      :result-id="resultId"
      template="Buy {amount} items for {total}">
      <div class="bundle-grid">
        <nosto-simple-card
          v-for="product in products"
          :handle="product.handle"
        ></nosto-simple-card>
      </div>

      <div class="bundle-controls">
        <h4>{{ title }}</h4>
        <ul>
          <li v-for="product in products">
            <label>
              <input type="checkbox" :value="product.productId" checked />
              Include {{ product.name }} - ${{ product.price }}
            </label>
          </li>
        </ul>
        <button n-atc>Add Bundle to Cart</button>
        <span n-summary-price></span>
      </div>
    </nosto-bundle>
  </template>
</nosto-campaign>
```

### Bundle with Amount-Only Template

This example uses a template that only shows the number of selected products.

```html
<nosto-bundle 
  .products="products"
  template="{amount} items selected">
  <span n-summary-price></span>
  <input type="checkbox" value="product-handle-1" checked />
  <input type="checkbox" value="product-handle-2" checked />
</nosto-bundle>
```

### Bundle with Price-Only Template

This example uses the default-style template with custom text.

```html
<nosto-bundle 
  .products="products"
  template="Bundle Total: {total}">
  <span n-summary-price></span>
  <input type="checkbox" value="product-handle-1" checked />
  <input type="checkbox" value="product-handle-2" />
</nosto-bundle>
```
