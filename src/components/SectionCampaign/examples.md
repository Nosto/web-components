## Examples

### Basic usage with Shopify section rendering

This example demonstrates basic integration with Shopify's Section Rendering API to display Nosto campaign results. The component fetches recommendations from the "front-page" placement and renders them using the "product-recommendations" section, maintaining consistency with your Shopify theme's styling and layout.

```html
<nosto-section-campaign placement="front-page" section="product-recommendations"></nosto-section-campaign>
```

### Advanced usage for specific product page recommendations

This shows a more targeted implementation for product page cross-selling. By using a specific placement like "product-page-cross-sell", you can display contextually relevant recommendations that complement the current product, rendered through a dedicated section optimized for cross-sell scenarios.

```html
<nosto-section-campaign placement="product-page-cross-sell" section="related-products-section"></nosto-section-campaign>
```

### Using ID mode for union of ID filters

This example demonstrates using the `mode="id"` attribute to format the search query as a union of product IDs. Instead of product handles, the component will use product IDs with the OR operator (e.g., "id:10 OR id:20 OR id:30"), which is useful for certain Shopify search configurations.

```html
<nosto-section-campaign placement="front-page" section="product-recommendations" mode="id"></nosto-section-campaign>
```

### Example Shopify Liquid template for use with nosto-section-campaign

Here's an example of a Shopify Liquid template that can be used with the `nosto-section-campaign` component:

```liquid
{% comment %}
  Section: product-recommendations.liquid
  This template takes product handles from search.terms and renders product cards
{% endcomment %}

{% if search.terms != blank %}
  {% assign handles = search.terms | split: ':' %}
  <div class="product-recommendations">
    <h2 nosto-title></h2>
    <div class="product-grid">
      {% for handle in handles %}
        {% assign product = collections.all.products[handle] %}
        {% if product != blank %}
          <div class="product-card">
            <a href="{{ product.url }}">
              {% if product.featured_image %}
                <img src="{{ product.featured_image | image_url: width: 300 }}" 
                     alt="{{ product.featured_image.alt | escape }}" 
                     loading="lazy">
              {% endif %}
              <h3>{{ product.title }}</h3>
              <span class="price">{{ product.price | money }}</span>
              {% if product.compare_at_price > product.price %}
                <span class="compare-price">{{ product.compare_at_price | money }}</span>
              {% endif %}
            </a>
          </div>
        {% endif %}
      {% endfor %}
    </div>
  </div>
{% endif %}
```