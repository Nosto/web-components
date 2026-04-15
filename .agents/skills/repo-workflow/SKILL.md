---
name: repo-workflow
description: Required validation and commit workflow for this repository.
---

# Repository Workflow

## Use this skill when
- Working on any change in this repository.

## Required validation steps
Run these commands before committing:
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run lint-fix`

Also validate changes with Storybook:
- Run `npm run storybook`
- Test custom element functionality
- For screenshots, click **Hide addons [alt A]** first
- Wait for `#storybook-root .storybook-wrapper` before taking screenshots

## Commit requirements
- Use conventional commits, for example:
  - `feat(NostoImage): add lazy loading support`
  - `fix(build): resolve TypeScript compilation error`
  - `test(NostoProduct): add SKU selection test cases`
- Commit with `--no-verify`
