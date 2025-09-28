---
applyTo: "**/*.ts"
---

# Coding Standards

- Use closures over classes
- Utilize type inference in return types, except for functions with multiple return statements
- Use utility types to derive types from constants
- Avoid 'any' type usage - use proper TypeScript types
- Use const (and let) over var
- Use async/await instead of Promise chaining
- Use individual named exports over bulk exports
- Favor named exports over default exports
- Don't add comments unless they match the style of other comments in the file or are necessary to explain a complex change