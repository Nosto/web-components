## Examples

### Basic campaign rendering with HTML response mode

```html
<nosto-campaign placement="front-page"></nosto-campaign>
```

This is the simplest campaign implementation that fetches content from Nosto for the "front-page" placement and renders it directly using HTML response mode. The campaign content is provided by Nosto's recommendation engine and displayed as-is.

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

This example demonstrates custom template-based rendering using Vue-like syntax. Instead of using Nosto's pre-rendered HTML, this approach gives you full control over the campaign layout and styling using a template element with Vue directives.

### Campaign with lazy loading and product context

```html
<nosto-campaign placement="product-recommendations" product-id="123" variant-id="456" lazy></nosto-campaign>
```

This example demonstrates how to implement lazy loading with product context. The `lazy` attribute ensures the campaign only loads when it comes into view, improving page performance. The `product-id` and `variant-id` provide context to Nosto overriding the page context.

### Campaign with cart-synced functionality for dynamic cart updates

```html
<nosto-campaign placement="cart-recommendations" cart-synced></nosto-campaign>
```

This example demonstrates cart synchronization functionality. When `cart-synced` is enabled, the campaign will automatically reload whenever cart update events occur, keeping cart-related recommendations (like cross-sells or upsells) in sync with the current cart state.