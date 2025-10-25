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