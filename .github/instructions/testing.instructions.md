---
applyTo: "test/*"
---

# Testing

- Use vitest as the test framework
- Use 'describe' and 'it' for test structure
- Use 'beforeEach' for setup and 'afterEach' for cleanup
- Use 'expect' for assertions
- Maintain 90%+ coverage on statements, branches, lines, and functions
- Tests run in jsdom environment

## HTML Template Testing Patterns

**Use lit-html style templates for component creation in tests:**

- Import `html` from `@/templating/html` and `createElement` from test utils
- Create components using html template literals with `createElement` wrapper:

  ```typescript
  import { html } from "@/templating/html"
  import { createElement } from "../../utils/createElement"

  // Create a custom element
  const card = createElement(html`<nosto-simple-card handle="test-handle" template="default"></nosto-simple-card>`) as SimpleCard
  ```

- For boolean attributes: use attribute presence (e.g., `<element attr>`) instead of `attr="true"`
- For number/object properties: set them after element creation:
  ```typescript
  const selector = createElement(html`<nosto-variant-selector handle="product"></nosto-variant-selector>`) as VariantSelector
  selector.variantId = 1002
  selector.maxValues = 5
  ```

- For template literal interpolation in HTML content:
  ```typescript
  const value = "dynamic"
  const element = createElement(html`<div attr="${value}">Content</div>`)
  ```

- For raw HTML (like JSON in script tags):
  ```typescript
  const jsonData = JSON.stringify({key: "value"})
  const element = createElement(html`<script type="application/json">${{ html: jsonData }}</script>`)
  ```

- Always preserve custom element imports as they trigger `@customElement` decorator registration

## Mock Products

**Centralize all mock Shopify products in `src/mock/products.ts`:**

- Import mock products from `@/mock/products` instead of defining them inline in test files
- Available mock products include:
  - `mockProductWithVariants` - Product with multiple variants (Size, Color options)
  - `mockProductWithoutVariants` - Product with no options
  - `mockSimpleCardProduct` - Basic product for SimpleCard tests
  - `mockProductWithSingleValueOption` - Product with one single-value option
  - `mockProductAllSingleValue` - Product where all options have single values
  - Additional specialized test products as needed
- When adding new mock products, add them to `src/mock/products.ts` for reusability