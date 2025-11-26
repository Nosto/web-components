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

**Use lit-html templates for component creation in tests:**

- Import `element` and `elements` from test utils
- Create components using tagged template literals with type assertions:

  ```typescript
  import { element } from "../../utils/element"

  // Create a custom element using tagged template with type assertion
  const card = element`<nosto-simple-card handle="test-handle" template="default"></nosto-simple-card>` as SimpleCard
  ```

- For boolean attributes: use attribute presence (e.g., `<element attr>`) instead of `attr="true"`
- For number/object properties: set them after element creation:
  ```typescript
  const selector = element`<nosto-variant-selector handle="product"></nosto-variant-selector>` as VariantSelector
  selector.variantId = 1002
  selector.maxValues = 5
  ```

- For template literal interpolation in HTML content:
  ```typescript
  const value = "dynamic"
  const div = element`<div attr="${value}">Content</div>` as HTMLDivElement
  ```

- For multiple elements:
  ```typescript
  import { elements } from "../../utils/element"
  const [div1, div2] = elements`<div>One</div><div>Two</div>` as HTMLDivElement[]
  ```

- For raw text content (like JSON in script tags), create elements directly:
  ```typescript
  const jsonData = JSON.stringify({key: "value"})
  const scriptEl = document.createElement("script")
  scriptEl.type = "application/json"
  scriptEl.textContent = jsonData
  // Then append scriptEl to parent element
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