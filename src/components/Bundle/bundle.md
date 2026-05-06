# Building Product Bundles on Shopify With Nosto

`nosto-bundle` lets shoppers select products from a Nosto recommendation result and add them to the cart as a group. The component fetches full Shopify product data, tracks which products are selected, keeps a running price total, and sends the entire selection to the cart in one call through the Nosto JS API.

## How It Works

The component performs three steps:

1. Receives a list of products from the Nosto campaign result.
2. Fetches full product details for each handle through the Shopify Storefront API.
3. Tracks checkbox state, updates the displayed total price, and adds selected products to the cart when the shopper clicks the add-to-cart button.

```html
<nosto-bundle .products="products" :result-id="resultId">
  <div class="bundle-grid">
    <nosto-simple-card
      v-for="product in products"
      :handle="product.handle"
    ></nosto-simple-card>
  </div>

  <ul>
    <li v-for="product in products">
      <label>
        <input type="checkbox" :value="product.handle" checked />
        Include {{ product.name }}
      </label>
    </li>
  </ul>

  <span n-summary-price></span>
  <button n-atc>Add Bundle to Cart</button>
</nosto-bundle>
```

The `products` property accepts the product array from the Nosto campaign result. The `result-id` attribute is optional and forwards the Nosto result identifier for attribution when products are added to the cart.

## Required Child Elements

The component relies on specific attributes in its child DOM to wire up behavior. No shadow DOM is used; all markup is provided by the template author.

**`n-summary-price`** — An element (e.g. `<span>`, `<div>`) where the component writes the formatted total price of selected products. By default the text uses the template `Total: {total}`, where `{total}` is formatted using the currency from the first product. The format can be customized with the `summary` attribute (see below). The component throws if this element is missing.

**`n-atc`** — A button or clickable element that triggers add-to-cart. When clicked, the component calls `window.Nosto.addMultipleProductsToCart` with one entry per selected product, passing the numeric product ID, the selected variant ID, and a quantity of one.

**Checkboxes with `value` set to a product handle** — Standard `<input type="checkbox">` elements control which products are included in the bundle. The initial checked state of each checkbox determines which products are selected on load. Toggling a checkbox adds or removes the matching product from the selection and recalculates the total.

## Summary Template

The `summary` attribute controls the text written into the `n-summary-price` element. It supports two placeholders:

- `{total}` — the formatted price of all selected products.
- `{amount}` — the number of selected products.

The default template is `Total: {total}`.

```html
<nosto-bundle
  .products="products"
  summary="Buy {amount} items for {total}"
>
  ...
  <span n-summary-price></span>
  <button n-atc>Add Bundle to Cart</button>
</nosto-bundle>
```

With three products selected at a combined price of $120.00, the summary element would read `Buy 3 items for $120.00`.

## Variant Selection

When a `nosto-variant-selector` is placed inside a product card, the bundle listens for variant change events and updates the selected variant for that product. The total price recalculates automatically using the price of each product's currently selected variant.

If the Nosto recommendation result includes a `recommended_sku` for a product, the component selects that variant initially. Otherwise it falls back to the first available variant.

```html
<nosto-bundle .products="products">
  <div class="bundle-grid">
    <nosto-simple-card handle="product-a">
      <nosto-variant-selector handle="product-a" mode="compact"></nosto-variant-selector>
    </nosto-simple-card>
    <nosto-simple-card handle="product-b">
      <nosto-variant-selector handle="product-b" mode="compact"></nosto-variant-selector>
    </nosto-simple-card>
  </div>

  <span n-summary-price></span>
  <button n-atc>Add Bundle to Cart</button>
</nosto-bundle>
```

When the shopper selects a different variant, the add-to-cart payload uses the newly selected variant ID for that product.

## Checkbox Placement and Card Visibility

Checkbox placement determines whether product cards show and hide when toggled.

When a checkbox is **outside** its matching product card, unchecking it hides the card element (`[handle="..."]`) and checking it shows the card again. This suits layouts where a separate control list sits beside or below the product grid.

```html
<nosto-bundle .products="products">
  <div class="bundle-grid">
    <nosto-simple-card handle="product-a"></nosto-simple-card>
    <nosto-simple-card handle="product-b"></nosto-simple-card>
  </div>

  <ul>
    <li>
      <input type="checkbox" value="product-a" checked />
      Include Product A
    </li>
    <li>
      <input type="checkbox" value="product-b" checked />
      Include Product B
    </li>
  </ul>

  <span n-summary-price></span>
  <button n-atc>Add Bundle to Cart</button>
</nosto-bundle>
```

When a checkbox is **inside** its matching product card, the card always stays visible regardless of checked state. This suits layouts where the checkbox overlays the card itself, such as a selection indicator in the corner of each product image.

```html
<nosto-bundle .products="products">
  <div class="bundle-grid">
    <nosto-simple-card handle="product-a">
      <input type="checkbox" value="product-a" checked />
    </nosto-simple-card>
    <nosto-simple-card handle="product-b">
      <input type="checkbox" value="product-b" checked />
    </nosto-simple-card>
  </div>

  <span n-summary-price></span>
  <button n-atc>Add Bundle to Cart</button>
</nosto-bundle>
```

## Using Inside a Nosto Campaign

In production the component is placed inside `nosto-campaign` so the product list and result ID come from the Nosto recommendation response.

```html
<nosto-campaign placement="frontpage-nosto-bundle">
  <template>
    <nosto-bundle .products="products" :result-id="resultId">
      <div class="bundle-grid">
        <nosto-simple-card
          v-for="product in products"
          :handle="product.handle"
        >
          <nosto-variant-selector
            :handle="product.handle"
            mode="compact"
          ></nosto-variant-selector>
        </nosto-simple-card>
      </div>

      <div class="bundle-controls">
        <h4>{{ title }}</h4>
        <ul>
          <li v-for="product in products">
            <label>
              <input type="checkbox" :value="product.handle" checked />
              Include {{ product.name }} - ${{ product.price }}
            </label>
          </li>
        </ul>
        <span n-summary-price></span>
        <button n-atc>Add Bundle to Cart</button>
      </div>
    </nosto-bundle>
  </template>
</nosto-campaign>
```

The template expressions (`.products`, `:result-id`, `v-for`, `{{ }}`) are evaluated by the Nosto campaign templating system at render time.

## Loading State

The component toggles a `loading` attribute while Shopify product data is being fetched. Use it to show a skeleton, reserve layout space, or hide the component until content is ready.

```css
nosto-bundle[loading] {
  opacity: 0.5;
  pointer-events: none;
}
```

## Rendered Event

The component dispatches a `@nosto/Bundle/rendered` custom event when its initialization flow completes. In the typical case, that means Shopify product data has been fetched and the summary price has been set. If the `products` list is empty, the component skips fetching and summary updates but still dispatches the event. The event bubbles and is cancelable. Use it to initialize carousels, analytics, or other post-render logic that should run after the bundle has finished attempting to initialize.

```js
document.addEventListener("@nosto/Bundle/rendered", () => {
  // Bundle initialization has completed
})
```

## Production Recommendations

Keep product counts practical. Each product in the bundle triggers an individual Shopify Storefront API request. Prefer bundles of two to six products and avoid large recommendation counts that would create excessive network overhead.

Preserve Nosto attribution. The component calls `addMultipleProductsToCart` with the campaign `resultId` so Nosto can attribute the conversion. Do not replace or intercept the add-to-cart call without forwarding the result identifier.

Style the summary price element before render. The `n-summary-price` element starts empty and is populated after product data loads. Reserve space or apply a minimum height so the layout does not shift when the total appears.

Handle empty results. Nosto may return no products for a placement. When the product list is empty the component skips fetching and leaves the summary unpopulated, but any light DOM content inside the element remains visible. Conditionally render or hide the entire bundle section when the placement has no result so that empty markup, headings, or add-to-cart buttons are not shown to the shopper.

Use stable placement names. The `placement` attribute on the wrapping `nosto-campaign` and the Nosto campaign configuration must match. Changing either silently breaks rendering and attribution.

Test across pages. Verify the bundle on every page type where it appears — homepage, collection, product, and cart. Confirm that currency formatting, product availability, variant selectors, and add-to-cart behavior all work consistently with the rest of the theme.
