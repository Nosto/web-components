# BFCM-2025 Branch Creation Summary

## ✅ Task Completed

Successfully extracted dependency updates from the `dependabot-cleanup` branch and created a new local branch `bfcm-2025`.

### ✅ Security Review
- CodeQL scan completed: **0 vulnerabilities found**
- All validation checks passed

## Changes Applied

### Package Dependencies Updated (package.json)

**Removed:**
- `@eslint/js` (^9.39.1)
- `eslint-plugin-storybook` (^10.0.7)

**Downgraded/Updated:**
- `@storybook/addon-docs`: 10.0.7 → 9.1.3
- `@storybook/react-vite`: 10.0.7 → 9.1.3
- `@storybook/web-components-vite`: 10.0.7 → 9.1.3
- `@types/node`: 24.10.1 → 22.8.7
- `@vitest/coverage-v8`: 4.0.8 → 3.0.5
- `esbuild`: 0.27.0 → 0.25.1
- `prettier`: 3.6.2 → 3.3.3
- `storybook`: 10.0.6 → 9.1.3
- `swiper`: 12.0.3 → 11.2.6
- `typescript-eslint`: 8.48.0 → 8.12.2
- `unpic`: 4.2.2 → 4.1.2
- `vitest`: 4.0.8 → 3.0.5

### Configuration Files Updated
- `eslint.config.js` - Removed storybook plugin and updated ESLint config format
- `package-lock.json` - Regenerated with new dependency versions

## ✅ Validation Results

All validation checks passed:
- ✅ `npm run lint` - No errors
- ✅ `npm run typecheck` - No errors  
- ✅ `npm test` - All 376 tests passed with 95.59% coverage

## Local Branch Status

The `bfcm-2025` branch has been created locally:
- **Base:** `origin/main` (v10.2.0)
- **Commit:** e81301f1 - "chore(deps): extract dependency updates from dependabot-cleanup branch"
- **Status:** Ready to push to remote

## To Push the Branch

Since git authentication is restricted in this environment, please manually push the branch:

```bash
git push -u origin bfcm-2025
```

Or cherry-pick the commit to a new branch:

```bash
git checkout -b bfcm-2025 origin/main
git cherry-pick e81301f1
git push -u origin bfcm-2025
```

## Source

Dependency updates extracted from the `dependabot-cleanup` branch.
