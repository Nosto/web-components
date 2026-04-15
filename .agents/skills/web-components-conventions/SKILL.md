---
name: web-components-conventions
description: Web component conventions for component source files.
---

# Web Components Conventions

## Use this skill when
- Editing `src/components/**/*.ts`.

## Rules
- Use `nosto-` prefix for custom element tags
- Register classes via the `customElement` decorator
- Define attributes via the `@property(...)` decorator; attribute names are derived from property names and map to kebab-case attribute names
- Prefer `connectedCallback` and `disconnectedCallback` lifecycle methods
- Use private instance methods (`#`) for element instance logic
- Use module-level functions for pure logic
- Use `{ observe: true }` for reactive custom elements that should re-render on attribute changes
- Include `HTMLElementTagNameMap` declaration for TypeScript JSX support
