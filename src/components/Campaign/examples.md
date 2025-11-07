## Examples

### Basic campaign rendering with HTML response mode

This is the simplest campaign implementation that fetches content from Nosto for the "front-page" placement and renders it directly using HTML response mode. The campaign content is provided by Nosto's recommendation engine and displayed as-is.

```html
<nosto-campaign placement="front-page"></nosto-campaign>
```

or alternatively

```html
<nosto-campaign id="front-page"></nosto-campaign>
```

for better compatibility with the scoped styling conventions in our Velocity templates.

### Campaign with template-based rendering

This example demonstrates custom template-based rendering using Vue-like syntax. Instead of using Nosto's pre-rendered HTML, this approach gives you full control over the campaign layout and styling using a template element with Vue directives.

```html
<nosto-campaign placement="front-page">
  <template>
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

This example demonstrates how to implement lazy loading with product context. The `lazy` attribute ensures the campaign only loads when it comes into view, improving page performance. The `product-id` and `variant-id` provide context to Nosto overriding the page context.

```html
<nosto-campaign placement="product-recommendations" product-id="123" variant-id="456" lazy></nosto-campaign>
```

### Campaign with cart-synced functionality for dynamic cart updates

This example demonstrates cart synchronization functionality. When `cart-synced` is enabled, the campaign will automatically reload whenever cart update events occur, keeping cart-related recommendations (like cross-sells or upsells) in sync with the current cart state.

```html
<nosto-campaign placement="cart-recommendations" cart-synced></nosto-campaign>
```