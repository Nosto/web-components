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

## JSX/TSX Testing Patterns

**Prefer JSX/TSX syntax for component creation in tests:**

- Use `.tsx` file extension for test files that create custom elements
- Add `/** @jsx createElement */` pragma at the top of TSX test files
- Import `createElement` from `../utils/jsx` and the custom element classes
- Use explicit custom element registration in `beforeAll()` blocks:
  ```typescript
  beforeAll(() => {
    if (!customElements.get("custom-element")) {
      customElements.define("custom-element", CustomElement)
    }
  })
  ```
- Create components using JSX syntax with proper TypeScript typing:

  ```typescript
  // Preferred JSX/TSX pattern
  const card = <custom-element handle="test-handle" template="default" />

  // Instead of imperative pattern
  const card = new CustomElement()
  card.handle = "test-handle"
  card.template = "default"
  ```

- Use parentheses for multi-line JSX expressions
- Always preserve custom element imports as they trigger `@customElement` decorator registration