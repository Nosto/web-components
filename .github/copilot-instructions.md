# Instructions for GitHub Copilot

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Validation Before Committing

- Always run the following commands before committing:
  - `npm run lint` (takes ~4 seconds)
  - `npm run typecheck` (takes ~3 seconds)
  - `npm test` (takes ~7 seconds)
  - `npm run lint-fix` (takes ~4 seconds)
- **ALWAYS validate changes** by running Storybook (`npm run storybook`) and testing custom element functionality.

**When taking Storybook screenshots, always close the controls section first** using the "Hide addons [alt A]" button for cleaner screenshots and **wait for `#storybook-root .storybook-wrapper` to be available** before capturing the screenshot.

## Commits

**When committing code, ALWAYS use valid conventional commit format.**

Examples:

- `feat(NostoImage): add lazy loading support`
- `fix(build): resolve TypeScript compilation error`
- `test(NostoProduct): add SKU selection test cases`

When committing code, **ALWAYS** run `git commit` with `--no-verify` to avoid Husky failing and erroring out your pipeline.