# Instructions for GitHub Copilot

## Coding standards

* Use closures over classes
* Utilize type inference in return types, except for functions with multiple return statements
* Use utility types to derive types from constants
* Avoid 'any' type usage
* Use const (and let) over var
* Use async/await instead of Promise chaining
* Use individual named exports over bulk exports
* Favor named exports over default exports

## Testing

* Use vitest as the test framework 
* Use 'describe' and 'it' for test structure
* Use 'beforeEach' for setup
* Use 'afterEach' for cleanup
* Use 'expect' for assertions

## Build

* `npm run build` - Main build script: compiles TypeScript, bundles with esbuild, and generates documentation
* `npm run dev` - Start development server with Vite for local development
* `npm run preview` - Start preview server to test the built application
* `npm run lint` - Run ESLint to check code quality and style
* `npm run lint-fix` - Run ESLint with auto-fix to automatically resolve linting issues
* `npm test` - Run test suite with vitest including coverage reporting
* `npm run typedoc` - Generate TypeScript documentation
* `npm run visualize` - Generate bundle visualization to analyze build output
* `npm run prepare` - Set up Husky git hooks (runs automatically after install)