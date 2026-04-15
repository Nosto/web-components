---
name: testing
description: Testing conventions for this repository.
---

# Testing Conventions

## Use this skill when
- Editing tests in `test/*`.

## Core testing rules
- Use vitest
- Use `describe` and `it`
- Use `beforeEach` and `afterEach` for setup/cleanup
- Use `expect` for assertions
- Maintain 90%+ coverage on statements, branches, lines, and functions
- Tests run in jsdom

## JSX/TSX testing patterns
- Prefer JSX/TSX syntax for component creation tests
- Use `.tsx` extension for tests creating custom elements
- Add `/** @jsx createElement */` pragma in TSX test files
- Import `createElement` from `@/utils/jsx` and custom element classes
- Keep custom element imports to trigger `@customElement` decorator registration for component tests
- Only explicitly register custom elements in `beforeAll()` when defining test-only elements inside the spec; guard with `if (!customElements.get('custom-element'))` before calling `customElements.define(...)`

## Mock products
- Centralize mock Shopify products in `src/mock/products.ts`
- Import from `@/mock/products` instead of inline product definitions
