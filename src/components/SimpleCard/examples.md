## Examples

### Basic product card with all features

```html
<nosto-simple-card handle="awesome-product" alternate brand discount rating></nosto-simple-card>
```

### Product card with nested variant selector for interactive options

```html
<nosto-simple-card handle="configurable-product" brand discount>
  <nosto-variant-selector handle="configurable-product" preselect></nosto-variant-selector>
</nosto-simple-card>
```