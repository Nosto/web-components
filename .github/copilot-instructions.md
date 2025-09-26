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

**NEVER CANCEL any of these commands. Wait for completion:**

- `npm ci` -- 60 seconds (timeout: 90+ seconds) - Installs dependencies, preferred over npm install
- `npm run build` -- 8 seconds (timeout: 30+ seconds) - Full build with TypeScript compilation, esbuild bundling, and TypeDoc generation
- `npm test` -- 7 seconds (timeout: 30+ seconds) - Runs vitest with coverage (requires 90%+ coverage on statements, branches, lines, functions)
- `npm run lint` -- 4 seconds (timeout: 15+ seconds) - ESLint code quality and style checking
- `npm run lint-fix` -- 4 seconds (timeout: 15+ seconds) - ESLint with auto-fix (run before committing)
- `npm run typecheck` -- 3 seconds (timeout: 15+ seconds) - TypeScript type checking without emitting files (run before committing)
- `npm run typedoc` -- Generates documentation in docs/ folder
- `npm run visualize` -- Creates bundle size visualization
- `npm run storybook` -- Starts Storybook development server on port 6006
- `npm run build-storybook` -- 5 seconds (timeout: 30+ seconds) - Builds Storybook for production deployment

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

## Common Troubleshooting

- **Picsum.photos blocked images**: Normal in development environment, doesn't affect component functionality
- **"Nosto addSkuToCart function is not available"**: Expected error in dev environment when testing cart functionality

## Commits

When committing code, ALWAYS use valid conventional commit format.

Examples:

- `feat(NostoImage): add lazy loading support`
- `fix(build): resolve TypeScript compilation error`
- `test(NostoProduct): add SKU selection test cases`

When committing code, ALWAYS run `git commit` with `--no-verify` to avoid Husky failing and erroring out your pipeline.


