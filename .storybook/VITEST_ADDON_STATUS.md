# Storybook Vitest Addon - Integration Status

## Overview

This document tracks the status of integrating the `@storybook/experimental-addon-test` with this project.

## Current Status: ⚠️ BLOCKED

The Storybook Vitest addon is currently **not functional** with Storybook 10.x due to API compatibility issues.

## Issue Details

### Error
```
TypeError: generator.storyFileNames is not a function
```

### Root Cause
The `@storybook/experimental-addon-test` addon was designed for Storybook 8.x. It attempts to call `generator.storyFileNames()` on the `StoryIndexGenerator` instance, but this method no longer exists in Storybook 10.x's API.

### Versions Tested
- `@storybook/experimental-addon-test@8.6.14` (stable) - ❌ Not compatible
- `@storybook/experimental-addon-test@9.0.0-alpha.1` (next) - ❌ Not compatible  
- `@storybook/experimental-addon-test@canary` - ❌ Not compatible

### Current Configuration

The following files have been created according to the official documentation:

1. **`.storybook/main.ts`** - Addon registered
2. **`.storybook/vitest.setup.ts`** - Vitest setup file for Storybook
3. **`.storybook/vitest.config.ts`** - Vitest configuration for story tests
4. **`package.json`** - Test scripts added (`test:storybook`, `test:storybook:watch`)

### Dependencies Installed

- `@storybook/experimental-addon-test` (canary)
- `@vitest/browser@^4.0.15`
- `playwright@^1.57.0`

## Possible Solutions

### Option 1: Wait for Official Support (Recommended)
Monitor the Storybook repository for updates to the addon that support Storybook 10.x:
- GitHub: https://github.com/storybookjs/storybook
- Issue tracker: https://github.com/storybookjs/storybook/issues

### Option 2: Use @storybook/test-runner
An alternative testing approach that is currently stable:
```bash
npm install --save-dev @storybook/test-runner
```

The test-runner uses Playwright to test stories and is fully compatible with Storybook 10.x.

### Option 3: Downgrade to Storybook 8.x
**Not recommended** - Would require downgrading all Storybook packages to 8.x, losing newer features and improvements.

### Option 4: Manual Story Testing
Write custom Vitest tests that import and render stories directly without using the addon.

## References

- Original issue: Requesting Storybook Vitest addon integration
- Documentation: https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
- Note: The documentation may be for Storybook 8.x and hasn't been updated for 10.x yet

## Next Steps

1. Monitor Storybook releases for addon compatibility with version 10.x
2. Consider implementing Option 2 (@storybook/test-runner) as an interim solution
3. Update this documentation when the addon becomes compatible

## Testing the Configuration (When Compatible)

Once the addon is compatible, run:

```bash
# Run story tests once
npm run test:storybook

# Run story tests in watch mode
npm run test:storybook:watch
```

---

*Last Updated: 2025-12-09*
