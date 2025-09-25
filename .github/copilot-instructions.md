# Instructions for GitHub Copilot

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Quick Start & Working Effectively

**Bootstrap, build, and test the repository:**

1. `npm ci` -- installs dependencies. Takes ~60 seconds. NEVER CANCEL. Set timeout to 90+ seconds.
2. `npm run build` -- compiles TypeScript, bundles with esbuild, and generates TypeDoc documentation. Takes ~8 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
3. `npm test` -- runs test suite with vitest and coverage reporting. Takes ~7 seconds. NEVER CANCEL. Set timeout to 30+ seconds.

**Validation steps:**

- Always run the following commands before committing:
  - `npm run lint` (takes ~4 seconds)
  - `npm run typecheck` (takes ~3 seconds)
  - `npm test` (takes ~7 seconds)
  - `npm run lint-fix` (takes ~4 seconds)
- **ALWAYS validate changes** by running Storybook (`npm run storybook`) and testing custom element functionality.

**When taking Storybook screenshots, always close the controls section first** using the "Hide addons [alt A]" button for cleaner screenshots and **wait for `#storybook-root .storybook-wrapper` to be available** before capturing the screenshot.

## Node.js Requirements

**CRITICAL**: This project requires Node.js >= 22.12.0 and npm >= 10.9.0 as specified in package.json engines.

- The project will work with Node.js 20.x but will show warnings during `npm ci`.

## Core Commands & Timing

**Key commands for development workflow:**

- `npm ci` -- 60 seconds (timeout: 90+ seconds) - Installs dependencies, preferred over npm install
- `npm run build` -- 8 seconds (timeout: 30+ seconds) - Full build with TypeScript compilation, esbuild bundling, and TypeDoc generation
- `npm test` -- 7 seconds (timeout: 30+ seconds) - Runs vitest with coverage (requires 90%+ coverage on statements, branches, lines, functions)
- `npm run storybook` -- Starts Storybook development server on port 6006

## Repository Structure & Navigation

**Key directories:**

- `src/` - Source code for all custom elements
- `src/components/` - Main custom element implementations (NostoCampaign, NostoImage, NostoProduct, etc.)
- `src/templating/` - Templating utilities (context.ts, vue.ts)
- `test/` - Test files using vitest
- `.storybook/` - Storybook configuration and setup
- `dist/` - Build outputs (created by npm run build)
- `docs/` - Generated TypeDoc documentation

**Key files to check when making changes:**

- `src/main.ts` - Main entry point, exports all components
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite and vitest configuration
- `esbuild.mjs` - Build script for bundling
- `eslint.config.js` - ESLint configuration

## Web Components Conventions

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

## Coding Standards

- Use closures over classes
- Utilize type inference in return types, except for functions with multiple return statements
- Use utility types to derive types from constants
- Avoid 'any' type usage - use proper TypeScript types
- Use const (and let) over var
- Use async/await instead of Promise chaining
- Use individual named exports over bulk exports
- Favor named exports over default exports
- Don't add comments unless they match the style of other comments in the file or are necessary to explain a complex change

## Commits

When committing code, ALWAYS use valid conventional commit format.

Examples:

- `feat(NostoImage): add lazy loading support`
- `fix(build): resolve TypeScript compilation error`
- `test(NostoProduct): add SKU selection test cases`

When committing code, ALWAYS run `git commit` with `--no-verify` to avoid Husky failing and erroring out your pipeline.

## Testing

- Use vitest as the test framework
- Use 'describe' and 'it' for test structure
- Use 'beforeEach' for setup and 'afterEach' for cleanup
- Use 'expect' for assertions
- Maintain 90%+ coverage on statements, branches, lines, and functions
- Tests run in jsdom environment

## CI/CD Validation

**Before committing, ALWAYS run these commands to ensure CI passes:**

1. `npm run lint` -- must pass without errors
2. `npm run typecheck` -- must pass without TypeScript errors
3. `npm run test` -- must pass all tests with 90%+ coverage
4. `npm run lint-fix` -- to automatically fix linting issues
5. `npm run build` -- must complete successfully
6. `npm run build-storybook` -- must build Storybook successfully

**GitHub Actions will run:**

- Build job: npm ci → npm run build → npm test
- Lint job: npm ci → npm run lint
- Storybook build job: npm ci → npm run build-storybook

## GitHub Action Plugins – Review Checklist

When reviewing pull requests that add or update GitHub Action plugins, Copilot should check each item and output this checklist in its review comment or summary.  
If scan results are not yet available, mark as pending and update after results are attached or after invoking `@copilot` for scanning.

- **Pinning:**
  - [ ] Are all GitHub Actions pinned to a specific commit SHA (not a tag such as `@v3`, `@main`, or `@latest`)?
- **Vulnerability Scanning:**
  - [ ] Has a vulnerability scan been performed for each new/updated Action SHA?
    - If not available, mark as ⬜ Pending.
- **No Critical Vulnerabilities:**
  - [ ] Has it been confirmed that no Action at the specified SHA has critical vulnerabilities?
    - If not available, mark as ⬜ Pending.

**Note:** If a SHA for a plugin was previously scanned in a Nosto repo `[Nosto/REPO]`, you may reference that result here.
