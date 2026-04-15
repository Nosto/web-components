---
name: coding-standards
description: TypeScript coding standards for this repository.
---

# Coding Standards

## Use this skill when
- Editing `**/*.{ts,tsx}` files.

## Rules
- Use closures over classes (except custom element classes where instance logic should use `#` private methods)
- Utilize type inference in return types, except for functions with multiple return statements
- Use utility types to derive types from constants
- Avoid `any`; use proper TypeScript types
- Use `const` (and `let`) over `var`
- Use `async`/`await` over Promise chaining
- Use individual named exports over bulk exports
- Favor named exports over default exports
- Avoid adding comments unless necessary or consistent with existing style
