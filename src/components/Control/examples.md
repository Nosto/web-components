## Examples

### Conditional content based on user segments

```html
<nosto-control>
  <template segment="5b71f1500000000000000006">
    <div class="premium-offer">
      <h2>Exclusive Premium Offer!</h2>
      <p>Get 20% off your next purchase</p>
    </div>
  </template>
  <template segment="5a497a000000000000000001">
    <div class="welcome-offer">
      <h2>Welcome! Get Started</h2>
      <p>Use code WELCOME10 for 10% off your first order</p>
    </div>
  </template>
  <template segment="5a497a000000000000000002">
    <div class="loyalty-message">
      <h2>Thank you for your loyalty!</h2>
      <p>Free shipping on all orders this month</p>
    </div>
  </template>
</nosto-control>
```

This example shows how to display different content based on Nosto user segments. Each template element has a `segment` attribute that corresponds to a Nosto segment ID. The component will render the content from the first template whose segment matches the current user's segments, enabling personalized messaging.

### Control element with fallback content when no segments match

```html
<nosto-control>
  <template segment="5b71f1500000000000000006">
    <div class="premium-offer">
      <h2>VIP Members Only</h2>
      <p>Exclusive early access to new arrivals</p>
    </div>
  </template>

  <template segment="5a497a000000000000000001">
    <div class="first-time-visitor">
      <h2>First time here?</h2>
      <p>Sign up for 15% off your first order</p>
    </div>
  </template>

  <div class="default-content">
    <h2>Welcome to our store!</h2>
    <p>Discover our latest products and special offers</p>
    <a href="/collections/all" class="browse-all">Browse All Products</a>
  </div>
</nosto-control>
```

This demonstrates segment-based content with fallback behavior. When none of the user's segments match any template, the component will display the default content (elements not wrapped in template tags). This ensures all users see relevant content even if they don't belong to any specific segment.