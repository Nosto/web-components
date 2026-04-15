# Coding Standards

- Use closures over classes (except for custom element classes where instance methods with `#` prefix should be used for logic that operates on the element instance)
- Utilize type inference in return types, except for functions with multiple return statements
- Use utility types to derive types from constants
- Avoid 'any' type usage - use proper TypeScript types
- Use const (and let) over var
- Use async/await instead of Promise chaining
- Use individual named exports over bulk exports
- Favor named exports over default exports
- Don't add comments unless they match the style of other comments in the file or are necessary to explain a complex change

# Web Components Conventions

**Follow these patterns when working with components:**

- Use `nosto-` prefix for custom element tags
- Register classes via the `customElement` decorator
- Define attributes using the static `attributes` object and matching property definitions
- Implement mainly `connectedCallback` and `disconnectedCallback` lifecycle methods
- Use private instance methods (with `#` prefix) for logic that operates on the custom element instance (e.g., validation, internal state management)
- Use module level functions for pure logic that doesn't require access to instance properties
- Use `{ observe: true }` for reactive custom elements that should re-render on attribute changes
- Include HTMLElementTagNameMap declaration for TypeScript JSX support:
  ```typescript
  declare global {
    interface HTMLElementTagNameMap {
      "custom-element": CustomElement
    }
  }
  ```

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

# GitHub Action Plugins – Review Checklist

When reviewing pull requests that add or update GitHub Action plugins, check each item and output this checklist in the review comment or summary.
If scan results are not yet available, mark as pending and update after results are attached.

- **Pinning:**
  - [ ] Are all GitHub Actions pinned to a specific commit SHA (not a tag such as `@v3`, `@main`, or `@latest`)?
- **Vulnerability Scanning:**
  - [ ] Has a vulnerability scan been performed for each new/updated Action SHA?
    - If not available, mark as ⬜ Pending.
- **No Critical Vulnerabilities:**
  - [ ] Has it been confirmed that no Action at the specified SHA has critical vulnerabilities?
    - If not available, mark as ⬜ Pending.

**Note:** If a SHA for a plugin was previously scanned in a Nosto repo `[Nosto/REPO]`, you may reference that result here.
