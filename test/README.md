# Testing Guide

This directory contains tests for the Nosto Web Components library.

## JSX Test Utilities

Our test utilities provide JSX support through the `createElement` function, which allows for cleaner and more readable component testing.

### Property Binding Syntax

The JSX engine supports explicit property binding using the `.property` syntax. This allows you to set JavaScript properties directly on custom elements without the boilerplate of manual property assignment.

#### Usage

Property binding uses the dot (`.`) prefix to distinguish property assignment from attribute assignment:

```typescript
import { createElement } from "./utils/jsx"
import { Bundle } from "@/components/Bundle/Bundle"
import type { JSONProduct } from "@nosto/nosto-js/client"

const products = [
  { handle: "product-1", price: 10, price_currency_code: "USD" },
  { handle: "product-2", price: 20, price_currency_code: "USD" }
] as JSONProduct[]

// ✅ Property binding - sets the JavaScript property directly
const bundle = createElement("nosto-bundle", { ".products": products }) as Bundle

// ❌ Old approach - required manual property assignment
const bundleOld = <nosto-bundle /> as Bundle
bundleOld.products = products
```

#### Benefits

- **Less boilerplate**: No need to create element first then assign properties
- **Type safety**: Full TypeScript support for property types
- **Cleaner tests**: More declarative and readable test code
- **Consistency**: Similar to Lit's property binding syntax

#### Combining Properties and Attributes

You can mix property bindings (with `.` prefix) and attribute assignments in the same element:

```typescript
const bundle = createElement(
  "nosto-bundle",
  {
    ".products": products,           // Property binding
    ".selectedProducts": selected,   // Property binding
    id: "my-bundle",                 // Attribute assignment
    "data-test": "bundle-test"       // Attribute assignment
  },
  <span n-summary-price></span>     // Children
) as Bundle
```

#### JSX Syntax Limitations

Due to JSX parser limitations, the `.property` syntax cannot be used directly in JSX tags. Instead, use the `createElement` function with property names as strings:

```typescript
// ✅ Works - using createElement
const element = createElement("nosto-bundle", { ".products": products })

// ❌ Doesn't work - JSX doesn't support dot in attribute names
const element = <nosto-bundle .products={products} />
```

#### TypeScript Support

The JSX type definitions include support for property binding through the `PropertyBindingMapping` type helper, providing full type checking and autocomplete for properties prefixed with `.`:

```typescript
type PropertyBindingMapping<T> = {
  [K in keyof T as `.${string & K}`]?: T[K]
}
```

This ensures that `.products`, `.selectedProducts`, and other properties are properly typed based on the component's interface.

## Running Tests

```bash
# Run all tests
npm test

# Run tests for a specific file
npm test -- path/to/test.spec.tsx

# Run tests with coverage
npm test -- --coverage
```

## Test Structure

Tests follow the vitest framework conventions:
- Use `describe` and `it` for test structure
- Use `beforeEach` and `afterEach` for setup and cleanup
- Use `expect` for assertions
- Maintain 90%+ coverage on statements, branches, lines, and functions
