## Examples

### Basic Bundle with Campaign

This example demonstrates a product bundle inside a campaign context.

```html
<nosto-campaign placement="frontpage-nosto-bundle">
  <template>
    <nosto-bundle .products="products">
      <!-- Products slot: displays product cards in a grid -->
      <div slot="products" class="bundle-grid">
        <nosto-simple-card
          v-for="product in products"
          :key="product.productId"
          :handle="product.handle"
        ></nosto-simple-card>
      </div>

      <!-- Controls slot: checkboxes, add to cart button, and price summary -->
      <div slot="controls" class="bundle-controls">
        <h4>{{ title }}</h4>
        <ul>
          <li v-for="product in products" :key="product.productId">
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
