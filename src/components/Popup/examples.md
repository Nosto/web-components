## Examples

### Basic popup with dialog and ribbon content

```html
<nosto-popup name="promo-popup" segment="5b71f1500000000000000006">
  <h2>Special Offer!</h2>
  <p>Get 20% off your order today</p>
  <button n-close>Close</button>
  <div slot="ribbon">
    <span>Limited time!</span>
  </div>
</nosto-popup>
```

This example demonstrates a promotional popup with both dialog content and ribbon functionality. The popup only displays to users in the specified Nosto segment. The main content appears in a modal dialog, while the ribbon slot provides a collapsed view that can be expanded to show the full popup content. When users interact with the ribbon, it transitions to the full dialog view. The `n-close` attribute creates a close button, and the popup state is persisted using localStorage based on the `name` attribute.