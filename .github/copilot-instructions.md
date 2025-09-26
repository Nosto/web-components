# Instructions for GitHub Copilot

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Node.js Requirements

**CRITICAL**: This project requires Node.js >= 22.12.0 and npm >= 10.9.0 as specified in package.json engines.

- The project will work with Node.js 20.x but will show warnings during `npm ci`.

## Quick Start & Working Effectively

**Bootstrap, build, and test the repository:**

1. `npm ci` -- installs dependencies. Takes ~60 seconds. NEVER CANCEL. Set timeout to 90+ seconds.

**Validation steps:**

- Always run the following commands before committing:
  - `npm run lint` (takes ~4 seconds)
  - `npm run typecheck` (takes ~3 seconds)
  - `npm test` (takes ~7 seconds)
  - `npm run lint-fix` (takes ~4 seconds)
- **ALWAYS validate changes** by running Storybook (`npm run storybook`) and testing custom element functionality.

**When taking Storybook screenshots, always close the controls section first** using the "Hide addons [alt A]" button for cleaner screenshots and **wait for `#storybook-root .storybook-wrapper` to be available** before capturing the screenshot.

## Commits

When committing code, ALWAYS use valid conventional commit format.

Examples:

- `feat(NostoImage): add lazy loading support`
- `fix(build): resolve TypeScript compilation error`
- `test(NostoProduct): add SKU selection test cases`

When committing code, ALWAYS run `git commit` with `--no-verify` to avoid Husky failing and erroring out your pipeline.


