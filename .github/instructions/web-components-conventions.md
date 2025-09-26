---
applyTo: "src/components/**/*.ts"
---

# Web Components Conventions

**Follow these patterns when working with components:**

- Use `Nosto` prefix for custom element class names and `nosto-` prefix for custom element tags
- Register classes via the `customElement` decorator
- Define attributes using the static `attributes` object and matching property definitions
- Implement mainly `connectedCallback` and `disconnectedCallback` lifecycle methods
- Use module level functions for other logic
- Use `{ observe: true }` for reactive custom elements that should re-render on attribute changes
- Include HTMLElementTagNameMap declaration for TypeScript JSX support:
  ```typescript
  declare global {
    interface HTMLElementTagNameMap {
      "custom-element": CustomElement
    }
  }
  ```