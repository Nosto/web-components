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
