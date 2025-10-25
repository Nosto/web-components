## Examples

### Basic campaign rendering with HTML mode

```html
<nosto-campaign placement="front-page"></nosto-campaign>
```

### Campaign with template-based rendering

```html
<nosto-campaign placement="front-page" template="my-template">
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

### Campaign with lazy loading and product context

```html
<nosto-campaign placement="product-recommendations" product-id="123" variant-id="456" lazy></nosto-campaign>
```

### Campaign with cart-synced functionality for dynamic cart updates

```html
<nosto-campaign placement="cart-recommendations" cart-synced></nosto-campaign>
```