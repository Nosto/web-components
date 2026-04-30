# Rendering Nosto Recommendations With Shopify Sections

`nosto-section-campaign` can render a Nosto recommendation result through Shopify's Section Rendering API. This is useful when the storefront should keep using existing Liquid sections, product cards, translations, prices, badges, and theme CSS instead of rendering recommendation markup directly in the browser.

## How It Works

The component performs three steps:

1. Requests the configured Nosto placement as a JSON recommendation result.
2. Reads the recommended product handles from `result.products`.
3. Calls Shopify section rendering on `/search` with `section_id` and a search query made from the handles.

The rendered section HTML is then inserted into the component, and Nosto click attribution is attached to the inserted campaign content.

```html
<nosto-section-campaign
  placement="front-page-recommendations"
  section="nosto-product-recommendations"
  title-selector=".nosto-recommendations__title"
></nosto-section-campaign>
```

For the example above, the component requests the `front-page-recommendations` placement and fetches Shopify section HTML from a URL equivalent to:

```text
/search?section_id=nosto-product-recommendations&q=handle-a%20OR%20handle-b%20OR%20handle-c
```

The `section` attribute must match a Shopify section file name without the `.liquid` extension. The `title-selector` attribute is optional. When provided and the Nosto result has a title, the component replaces the matching heading text inside the rendered section with the recommendation title.

## Shopify Section Example

The Shopify section can read the requested product handles from `search.terms`, look up matching products, and render the same card markup used elsewhere in the theme.

```liquid
{% comment %}
  sections/nosto-product-recommendations.liquid
{% endcomment %}

{% assign recommended_handles = search.terms | split: ' OR ' %}

{% if recommended_handles.size > 0 %}
  <div class="nosto-recommendations">
    <h2 class="nosto-recommendations__title">
      {{ section.settings.fallback_title | escape }}
    </h2>

    <div class="nosto-recommendations__grid">
      {% for handle in recommended_handles %}
        {% assign product = all_products[handle] %}

        {% if product != blank %}
          <article class="product-card">
            <a href="{{ product.url }}">
              {% if product.featured_image %}
                {{ product.featured_image
                  | image_url: width: 480
                  | image_tag:
                    loading: 'lazy',
                    widths: '240, 320, 480',
                    sizes: '(min-width: 990px) 25vw, 50vw',
                    alt: product.featured_image.alt
                }}
              {% endif %}

              <h3>{{ product.title | escape }}</h3>
              <span>{{ product.price | money }}</span>
            </a>
          </article>
        {% endif %}
      {% endfor %}
    </div>
  </div>
{% endif %}
```

If the returned section contains a nested `nosto-section-campaign` with the same placement, only that nested element's inner HTML is used. This lets a section include theme wrappers or alternate markup while still controlling the exact campaign fragment that replaces the original component.

```liquid
<div class="theme-section-wrapper">
  <nosto-section-campaign placement="front-page-recommendations">
    <div class="nosto-recommendations">
      ...
    </div>
  </nosto-section-campaign>
</div>
```

## Production Recommendations

Use the component as a theme integration point, but harden the surrounding Liquid and storefront behavior before production rollout.

Keep the Shopify section deterministic. The component sends product handles in Nosto result order, so the Liquid section should preserve that order and avoid replacing it with Shopify search relevance sorting.

Handle empty and partial results. Nosto may return no result, or Shopify may not find every handle. The section should render nothing, a compact fallback, or a merchandised fallback collection when the handle list is empty or products are unavailable.

Keep tracking intact. Do not replace the inserted DOM after `nosto-section-campaign` renders unless click attribution is reapplied. For carousels or tabs initialized after render, initialize them inside or after the component content without discarding the attributed elements.

Escape merchant-controlled text. Render product titles, image alt text, fallback titles, and other configurable content through Liquid escaping filters unless the content is intentionally trusted HTML.

Budget for one extra section request per placement. Each component instance performs a Nosto request and then a Shopify section request. Prefer a small number of placements per page, lazy-load below-the-fold placements where possible, and avoid expensive Liquid inside the section.

Use stable section names and placement names. Treat the `section` and `placement` attributes as integration contracts between the theme, Nosto campaign configuration, and storefront code. Changing either can silently stop rendering or attribution.

Add loading and failure styling. The component toggles a `loading` attribute while rendering. Use it for skeletons, reserved layout space, or visibility control so the page does not jump while the section request is in flight.

Check Shopify lookup limits. Shopify's `all_products` and search behavior can have practical limits depending on theme implementation and platform behavior. Validate the maximum recommendation count used by the placement and keep the section optimized for that count.

Validate in the target theme. Test the exact section on collection, product, cart, and landing pages where it will appear. Confirm currency formatting, localization, product availability rules, sale badges, quick-add controls, and analytics all behave the same as native theme product lists.
