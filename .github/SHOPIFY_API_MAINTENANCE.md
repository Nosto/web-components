# Shopify API Maintenance Guide

## Overview

This repository integrates with Shopify's Storefront GraphQL API. To ensure continued compatibility and take advantage of new features, periodic validation and updates are necessary.

## Automated Validation

### Bi-Annual Validation Workflow

A GitHub Actions workflow (`.github/workflows/shopify-api-validation.yml`) runs automatically twice per year:
- **January 15th** at 9:00 AM UTC
- **July 15th** at 9:00 AM UTC

### What the Workflow Does

1. **Runs all tests** to verify current functionality
2. **Runs linter** to check code quality
3. **Runs type checker** to ensure type safety
4. **Creates a GitHub issue** with validation tasks if successful
5. **Creates an urgent issue** if the workflow fails

### Manual Trigger

You can also trigger the validation workflow manually:
1. Go to the [Actions tab](../../actions)
2. Select "Shopify API Validation"
3. Click "Run workflow"

## Current Implementation

### API Version
- **Current:** `2025-10`
- **Location:** `src/shopify/graphql/constants.ts`
- **Support Period:** Minimum 12 months from release (until at least October 2026)

### GraphQL Queries
- `src/shopify/graphql/getProductByHandle.graphql` - Product query by handle
- `src/shopify/graphql/getProductsByIds.graphql` - Batch product query by IDs

### Integration Points
- `src/shopify/graphql/fetchProduct.ts` - API calls and caching
- `src/shopify/graphql/utils.ts` - Response transformation utilities
- `src/shopify/graphql/types.ts` - TypeScript type definitions
- `src/utils/createShopifyUrl.ts` - URL construction with Shopify context

## Manual Validation Process

When the automated workflow creates a validation issue, follow these steps:

### 1. Check API Version Support

Visit [Shopify API Versioning](https://shopify.dev/docs/api/usage/versioning) to verify:
- Current version (`2025-10`) is still supported
- Any newer stable versions are available
- Deprecation notices for current version

### 2. Review Changelog

Check the [Shopify Developer Changelog](https://shopify.dev/changelog) for:
- Breaking changes in newer versions
- New features that might benefit the integration
- Deprecation warnings

### 3. Validate GraphQL Queries

Using Shopify's GraphQL Explorer or documentation:
- Verify all fields in `getProductByHandle.graphql` are still available
- Verify all fields in `getProductsByIds.graphql` are still available
- Check for new recommended fields or approaches

### 4. Run Tests Locally

```bash
npm test
npm run lint
npm run typecheck
```

### 5. Consider Updating API Version

If a newer version is available and recommended:

**Update the API version:**
```typescript
// src/shopify/graphql/constants.ts
export const apiUrl = createShopifyUrl(`/api/YYYY-MM/graphql.json`)
```

**Validate the queries still work:**
- Run all tests
- Test manually in a Shopify environment if possible
- Check for any breaking changes in the new version

**Update documentation:**
- Update this file with the new version
- Update the workflow file with the new version reference
- Document any breaking changes or migration notes

### 6. Update Dependencies

Check if any related dependencies need updates:
- Shopify SDKs (if any)
- Type definitions
- Testing mocks

## Shopify API Release Schedule

Shopify releases new API versions quarterly:
- **January** (2025-01, 2026-01, etc.)
- **April** (2025-04, 2026-04, etc.)
- **July** (2025-07, 2026-07, etc.)
- **October** (2025-10, 2026-10, etc.)

Each version is supported for a minimum of 12 months, with at least 9 months overlap between versions.

## Best Practices

1. **Update proactively**: Don't wait until the current version is deprecated
2. **Test thoroughly**: Always run the full test suite after updates
3. **Monitor changelog**: Subscribe to Shopify's developer updates
4. **Document changes**: Keep this guide updated with each API version change
5. **Use stable versions**: Avoid using `unstable` or release candidate versions in production

## Troubleshooting

### Validation Workflow Fails
- Check the workflow run logs for specific errors
- Run tests locally to reproduce the issue
- Review recent Shopify API changes that might affect the code

### GraphQL Query Errors
- Validate queries against the current API version's schema
- Check for deprecated or removed fields
- Review Shopify's migration guides for the version

### Type Errors
- Update TypeScript types in `src/shopify/graphql/types.ts`
- Ensure types match the current API version's schema
- Check for changes in GraphQL response structure

## Resources

- [Shopify API Documentation](https://shopify.dev/docs/api)
- [Storefront API Reference](https://shopify.dev/docs/api/storefront)
- [API Versioning Guide](https://shopify.dev/docs/api/usage/versioning)
- [Developer Changelog](https://shopify.dev/changelog)
- [GraphQL Explorer](https://shopify.dev/docs/api/usage/api-exploration/admin-graphiql-explorer)

## Contact

For questions or issues with Shopify API integration, create a GitHub issue with the `shopify` and `api` labels.
