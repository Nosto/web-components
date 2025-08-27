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

## Testing

- Use vitest as the test framework
- Use 'describe' and 'it' for test structure
- Use 'beforeEach' for setup and 'afterEach' for cleanup
- Use 'expect' for assertions
- Maintain 90%+ coverage on statements, branches, lines, and functions
- Tests run in jsdom environment

### Vitest Setup Infrastructure

**Global Setup (test/setup.ts):**
- **Automatic Component Registration**: All components from `src/main.ts` are automatically registered as custom elements using kebab-case conversion (e.g., `NostoSimpleCampaign` → `nosto-simple-campaign`)
- **Document Cleanup**: `document.body.innerHTML = ""` is automatically run before each test
- **Mock Reset**: All `vi` mocks are automatically reset before each test
- **No Manual Registration Needed**: Since components are auto-registered, avoid manual `beforeAll()` blocks for component registration

**MSW Setup (test/msw.setup.ts):**
- **HTTP Mocking Server**: MSW server is automatically started/stopped for all tests
- **Handler Management**: Use `addHandlers()` function to add HTTP request handlers for specific tests
- **Automatic Cleanup**: Request handlers are automatically reset after each test
- **Error on Unhandled**: Server configured with `onUnhandledRequest: "error"` to catch missing mocks

**Mock Utilities (test/mockNostoRecs.ts):**
- **Nosto API Mocking**: Use `mockNostoRecs(recommendations)` to mock Nosto recommendation responses
- **Campaign Injection**: Provides mock implementations for `injectCampaigns` and related API calls
- **Request Builder**: Mock `RequestBuilder` with chainable methods for testing

**JSX Test Utilities (test/utils/jsx.ts):**
- **Custom createElement**: Handles JSX syntax in tests with proper attribute mapping and event listeners
- **Type Safety**: Full TypeScript support for all Nosto components in JSX
- **Attribute Handling**: Automatic kebab-case conversion and event listener attachment

### JSX/TSX Testing Patterns

**Prefer JSX/TSX syntax for component creation in tests:**
- Use `.tsx` file extension for test files that create custom elements
- Add `/** @jsx createElement */` pragma at the top of TSX test files
- Import `createElement` from `../utils/jsx` and the custom element classes
- **Avoid manual component registration**: Components are auto-registered by `test/setup.ts`, so avoid `beforeAll()` blocks for registration
- Create components using JSX syntax with proper TypeScript typing:
  ```typescript
  // Preferred JSX/TSX pattern
  const card = <custom-element handle="test-handle" template="default" />
  
  // Instead of imperative pattern
  const card = new CustomElement()
  card.handle = "test-handle"
  card.template = "default"
  ```
- Use parentheses for multi-line JSX expressions
- Always preserve custom element imports as they trigger `@customElement` decorator registration

**Test Structure Best Practices:**
- Use `afterEach()` for component cleanup instead of `beforeEach()` for setup
- Create helper functions for HTTP mocking (e.g., `addProductHandlers()`) that call `addHandlers()` from MSW setup
- Use `mockNostoRecs()` utility for mocking Nosto API responses
- Leverage automatic document cleanup - no need to manually clear `document.body`
- Rely on automatic mock reset - no need to manually reset mocks in `beforeEach()`

**Example Test Structure:**
```typescript
/** @jsx createElement */
import { describe, it, expect, afterEach } from "vitest"
import { CustomElement } from "@/components/CustomElement/CustomElement"
import { createElement } from "../utils/jsx"
import { addHandlers } from "../msw.setup"
import { mockNostoRecs } from "../mockNostoRecs"
import { http, HttpResponse } from "msw"

describe("CustomElement", () => {
  let element: CustomElement
  
  function addProductHandlers() {
    addHandlers(
      http.get("/products/:handle", ({ params }) => {
        return HttpResponse.text(`<div>${params.handle}</div>`)
      })
    )
  }
  
  afterEach(() => {
    element?.remove?.()
  })
  
  it("should render correctly", async () => {
    const mockResult = { products: [{ name: "Test Product" }] }
    mockNostoRecs({ "test-placement": mockResult })
    
    element = <custom-element placement="test-placement" />
    document.body.appendChild(element)
    
    await element.connectedCallback()
    expect(element.innerHTML).toContain("Test Product")
  })
}
```

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

- **Picsum.photos blocked images**: Normal in development environment, doesn't affect component functionality
- **"Nosto addSkuToCart function is not available"**: Expected error in dev environment when testing cart functionality

## Commits

When committing code, ALWAYS use valid conventional commit format.

Examples:
- `feat(NostoImage): add lazy loading support`
- `fix(build): resolve TypeScript compilation error`
- `test(NostoProduct): add SKU selection test cases`

When committing code, ALWAYS run `git commit` with `--no-verify` to avoid Husky failing and erroring out your pipeline.

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
