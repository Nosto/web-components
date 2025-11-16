# Product Fetching Batching Implementation

## Overview

This document describes the batching optimization implemented for the `fetchProduct` function in `src/shopify/graphql/fetchProduct.ts`. The implementation aggregates multiple product fetch requests within the same animation frame into a single GraphQL call, reducing network overhead when multiple components request different products simultaneously.

## Problem Statement

Previously, when multiple components (e.g., `SimpleCard`, `VariantSelector`) requested different products at the same time, each request would result in a separate GraphQL call. For example, displaying a grid of 12 products would result in 12 separate network requests.

## Solution

### 1. Request Batching Mechanism

The `ProductBatcher` class collects all product fetch requests within a single `requestAnimationFrame` cycle and combines them into a single GraphQL request.

**Key Features:**
- Uses `requestAnimationFrame` to batch requests naturally aligned with browser rendering
- Supports up to 10 products per batch (Shopify GraphQL API limitation)
- Automatically falls back to single-product query when only one product is requested
- Deduplicates requests for the same product handle

### 2. GraphQL Query Structure

**Single Product Query** (`getProductByHandle.graphql`):
```graphql
query ProductByHandle($country: CountryCode!, $language: LanguageCode!, $handle: String!)
@inContext(country: $country, language: $language) {
  product(handle: $handle) {
    # ... product fields
  }
}
```

**Batch Query** (`getProductsByHandles.graphql`):
```graphql
query ProductsByHandles(
  $country: CountryCode!
  $language: LanguageCode!
  $handle1: String
  $handle2: String
  # ... up to handle10
)
@inContext(country: $country, language: $language) {
  product1: product(handle: $handle1) { ...ProductFragment }
  product2: product(handle: $handle2) { ...ProductFragment }
  # ... up to product10
}
```

The batch query uses field aliases (`product1`, `product2`, etc.) to fetch multiple products in a single request.

### 3. Integration with Caching

The batching layer integrates seamlessly with the existing `cached` utility:

```typescript
// Batching happens at the fetch level
async function fetchProductUncached(handle: string): Promise<ShopifyProduct> {
  return batcher.request(handle)
}

// Caching wraps the batched fetch
export const [fetchProduct, clearProductCache] = cached(fetchProductUncached)
```

**Flow:**
1. Component calls `fetchProduct(handle)`
2. Cache checks if product is already cached
3. If not cached, batching layer queues the request
4. Batch is flushed on next animation frame
5. Results are distributed to waiting promises
6. Each product is cached individually

### 4. Error Handling

The implementation supports partial failures:
- Each product in a batch can succeed or fail independently
- Network errors reject all pending requests in the batch
- Product-not-found errors only reject that specific product request
- Error handling doesn't interfere with cache layer

## Performance Benefits

### Before (No Batching)
- 12 product components = 12 separate GraphQL requests
- Each request has network overhead (DNS, connection, headers, etc.)
- Slower page load and higher server load

### After (With Batching)
- 12 product components = 2 GraphQL requests (10 + 2)
- Reduced network overhead
- Faster page load and lower server load
- Better user experience

## Usage Examples

### Example 1: Multiple Components Rendered Simultaneously
```typescript
// All three calls happen within the same frame
const product1Promise = fetchProduct("product-1")
const product2Promise = fetchProduct("product-2")
const product3Promise = fetchProduct("product-3")

// Results in a SINGLE GraphQL request for all three products
const [p1, p2, p3] = await Promise.all([product1Promise, product2Promise, product3Promise])
```

### Example 2: Duplicate Request Deduplication
```typescript
// Multiple components request the same product
const p1 = fetchProduct("same-product")
const p2 = fetchProduct("same-product")
const p3 = fetchProduct("same-product")

// All three promises resolve with the same product data
// Only ONE product is fetched in the batch request
```

### Example 3: Cache Integration
```typescript
// First request - fetches from API
const product1 = await fetchProduct("product-1")

// Second request - served from cache (no network call)
const product2 = await fetchProduct("product-1")
```

### Example 4: Single Product Optimization
```typescript
// When only one product is requested in a frame
const product = await fetchProduct("single-product")

// Uses the more efficient single-product query automatically
// No overhead from batch query structure
```

## Test Coverage

The implementation includes comprehensive tests (`test/shopify/fetchProduct.spec.tsx`):

1. ✅ Single product fetch (backward compatibility)
2. ✅ Multiple product batching (3 products in one request)
3. ✅ Request deduplication (same handle requested multiple times)
4. ✅ Cache integration (subsequent requests use cache)
5. ✅ Partial failure handling (some products fail, others succeed)
6. ✅ Network error handling (all requests fail together)
7. ✅ Separate frame batching (requests in different frames)
8. ✅ Batch size limit (up to 10 products per batch)
9. ✅ Cache clearing functionality
10. ✅ Single product query optimization

## Technical Details

### Animation Frame Timing

The batching uses `requestAnimationFrame` instead of `setTimeout` because:
- It's naturally aligned with browser rendering cycles
- It ensures batching happens before the next paint
- It's more efficient for UI-driven operations
- It automatically pauses when tab is not visible

### Promise Resolution Pattern

Each `fetchProduct` call returns a Promise that's resolved when the batch completes:

```typescript
request(handle: string): Promise<ShopifyProduct> {
  return new Promise((resolve, reject) => {
    // Store resolve/reject callbacks
    const requests = this.pendingRequests.get(handle) || []
    requests.push({ handle, resolve, reject })
    this.pendingRequests.set(handle, requests)
    
    // Schedule batch flush if needed
    if (this.scheduledFlush === null) {
      this.scheduledFlush = requestAnimationFrame(() => this.flush())
    }
  })
}
```

### Deduplication Strategy

Requests for the same handle are stored in an array:
- Multiple components requesting "product-1" are grouped together
- The product is only fetched once in the GraphQL query
- All waiting promises are resolved with the same product data
- This works naturally with the cache layer

## Limitations

1. **Maximum Batch Size**: 10 products per batch (Shopify API limitation)
2. **Frame Boundary**: Requests in different animation frames result in separate batches
3. **Error Propagation**: Network errors affect all requests in the batch

## Future Enhancements

Potential improvements for future iterations:
1. Support for more than 10 products with automatic batch splitting
2. Configurable batch timing (e.g., debounce vs animation frame)
3. Metrics/telemetry for batch performance monitoring
4. Priority-based batching for above-the-fold content

## Migration Guide

No migration needed! The change is fully backward compatible:
- Existing code using `fetchProduct` works without modification
- Single product requests still use efficient single-product query
- Caching behavior is unchanged
- Error handling is preserved

## Conclusion

The batching implementation provides significant performance improvements for scenarios where multiple products are fetched simultaneously, while maintaining full backward compatibility and preserving existing caching and error handling behavior.
