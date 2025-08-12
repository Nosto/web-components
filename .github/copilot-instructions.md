# Instructions for GitHub Copilot

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Quick Start & Working Effectively

**Bootstrap, build, and test the repository:**
1. `npm ci` -- installs dependencies. Takes ~60 seconds. NEVER CANCEL. Set timeout to 90+ seconds.
2. `npm run build` -- compiles TypeScript, bundles with esbuild, and generates TypeDoc documentation. Takes ~8 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
3. `npm test` -- runs test suite with vitest and coverage reporting. Takes ~7 seconds. NEVER CANCEL. Set timeout to 30+ seconds.

**Validation steps:**
- Always run `npm run lint` (takes ~4 seconds) and `npm run lint-fix` (takes ~4 seconds) before committing.
- **ALWAYS validate changes** by running the dev server and testing web component functionality.

## Node.js Requirements

**CRITICAL**: This project requires Node.js >= 22.12.0 and npm >= 10.9.0 as specified in package.json engines.
- The project will work with Node.js 20.x but will show warnings during `npm ci`.
- If available, install Node.js 22+ for optimal compatibility.


## Core Commands & Timing

**NEVER CANCEL any of these commands. Wait for completion:**

- `npm ci` -- 60 seconds (timeout: 90+ seconds) - Installs dependencies, preferred over npm install
- `npm run build` -- 8 seconds (timeout: 30+ seconds) - Full build with TypeScript compilation, esbuild bundling, and TypeDoc generation
- `npm test` -- 7 seconds (timeout: 30+ seconds) - Runs vitest with coverage (requires 90%+ coverage on statements, branches, lines, functions)
- `npm run lint` -- 4 seconds (timeout: 15+ seconds) - ESLint code quality and style checking
- `npm run lint-fix` -- 4 seconds (timeout: 15+ seconds) - ESLint with auto-fix (run before committing)
- `npm run dev` -- 300ms startup time - Vite dev server on port 8080
- `npm run typedoc` -- Generates documentation in docs/ folder
- `npm run visualize` -- Creates bundle size visualization

## Repository Structure & Navigation

**Key directories:**
- `src/` - Source code for all web components
- `src/components/` - Main web component implementations (NostoCampaign, NostoImage, NostoProduct, etc.)
- `src/templating/` - Templating utilities (context.ts, vue.ts)
- `test/` - Test files using vitest
- `dev/` - Development server setup with Express and Liquid templates
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

## Coding Standards

- Use closures over classes
- Utilize type inference in return types, except for functions with multiple return statements
- Use utility types to derive types from constants
- Avoid 'any' type usage - use proper TypeScript types
- Use const (and let) over var
- Use async/await instead of Promise chaining
- Use individual named exports over bulk exports
- Favor named exports over default exports

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
2. `npm run lint-fix` -- to automatically fix linting issues
3. `npm run build` -- must complete successfully
4. `npm test` -- must pass all tests with 90%+ coverage

**GitHub Actions will run:**
- Build job: npm ci → npm run build → npm test
- Lint job: npm ci → npm run lint



## Common Troubleshooting

- **Node.js version warnings**: Expected with Node.js < 22.12.0, but builds still work
- **Picsum.photos blocked images**: Normal in development environment, doesn't affect component functionality
- **"Nosto addSkuToCart function is not available"**: Expected error in dev environment when testing cart functionality
- **Build artifacts**: Exclude dist/, docs/, node_modules/, coverage/ from commits (already in .gitignore)

## Commits

Use conventional commits format: `<type>(<optional scope>): <subject>`

Examples:
- `feat(NostoImage): add lazy loading support`
- `fix(build): resolve TypeScript compilation error`
- `test(NostoProduct): add SKU selection test cases`
