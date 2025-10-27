## Examples

### Basic SKU options with color selection

This example demonstrates a color selection interface where each option element has an `n-option` attribute and lists the available SKUs for that option with `n-skus`. Users can click on any color option to select it, and the component will manage option state, disable unavailable combinations, and integrate with the parent product component's SKU selection system.

```html
<nosto-sku-options name="color">
  <span n-option n-skus="123,145">Black</span>
  <span n-option n-skus="223,234,245">White</span>
  <span n-option n-skus="334,345">Blue</span>
</nosto-sku-options>
```