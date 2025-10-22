import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"

const meta: Meta = {
  title: "Overview",
  parameters: {
    docs: {
      page: null // Use custom page
    },
    layout: "fullscreen",
    options: {
      showPanel: false
    }
  }
}

export default meta
type Story = StoryObj

export const Overview: Story = {
  render: () => html`
    <style>
      .overview-page {
        font-family: sans-serif;
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .components-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        margin: 2rem 0;
      }

      .component-card {
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        padding: 1rem;
      }

      .component-links {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-top: 1rem;
      }

      .component-link {
        padding: 0.25rem 0.5rem;
        background: #ff6b35;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-size: 0.875rem;
      }

      .component-link.secondary {
        background: #f0f0f0;
        color: #333;
      }

      .component-tag {
        font-family: monospace;
        margin-bottom: 0.5rem;
      }
    </style>

    <div class="overview-page">
      <h1>Nosto Web Components</h1>

      <div class="category-section">
        <h2 class="category-title">Store Level Templating</h2>
        <p class="category-description">Components for store-wide functionality and page-level integrations</p>

        <div class="components-grid">
          <div class="component-card">
            <h3>Campaign</h3>
            <div class="component-tag">&lt;nosto-campaign/&gt;</div>
            <div class="component-description">
              Campaign rendering and product recommendation display. Fetches campaign data from Nosto and injects it
              into the DOM.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-campaign--docs" class="component-link" target="_parent">View Docs</a>
            </div>
          </div>

          <div class="component-card">
            <h3>Control</h3>
            <div class="component-tag">&lt;nosto-control/&gt;</div>
            <div class="component-description">
              Conditional content rendering based on user segments. Show different content to different user groups.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-control--docs" class="component-link" target="_parent">View Docs</a>
            </div>
          </div>

          <div class="component-card">
            <h3>Popup</h3>
            <div class="component-tag">&lt;nosto-popup/&gt;</div>
            <div class="component-description">
              Popup content with dialog and ribbon slots. Display promotional content, notifications, or interactive
              overlays.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-popup--docs" class="component-link" target="_parent">View Docs</a>
            </div>
          </div>

          <div class="component-card">
            <h3>SectionCampaign</h3>
            <div class="component-tag">&lt;nosto-section-campaign/&gt;</div>
            <div class="component-description">
              Campaign rendering using the Section Rendering API. Shopify-specific implementation for theme sections.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-sectioncampaign--docs" class="component-link" target="_parent"
                >View Docs</a
              >
            </div>
          </div>
        </div>
      </div>

      <div class="category-section">
        <h2 class="category-title">Campaign Level Templating</h2>
        <p class="category-description">Components for product-level functionality and campaign content</p>

        <div class="components-grid">
          <div class="component-card">
            <h3>Image</h3>
            <div class="component-tag">&lt;nosto-image/&gt;</div>
            <div class="component-description">
              Progressive image enhancement with optimization. Supports responsive images with Shopify and BigCommerce
              transformations.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-image--docs" class="component-link" target="_parent">View Docs</a>
            </div>
          </div>

          <div class="component-card">
            <h3>Product</h3>
            <div class="component-tag">&lt;nosto-product/&gt;</div>
            <div class="component-description">
              Product interaction and cart management. Handles product data, SKU selection, and add-to-cart
              functionality.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-product--docs" class="component-link" target="_parent">View Docs</a>
            </div>
          </div>

          <div class="component-card">
            <h3>SkuOptions</h3>
            <div class="component-tag">&lt;nosto-sku-options/&gt;</div>
            <div class="component-description">
              Product variant and SKU selection interface. Create interactive option selectors for product variants.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-skuoptions--docs" class="component-link" target="_parent">View Docs</a>
            </div>
          </div>

          <div class="component-card">
            <h3>SimpleCard</h3>
            <div class="component-tag">&lt;nosto-simple-card&gt;</div>
            <div class="component-description">
              Simple product card templating for Shopify stores. Streamlined product display with basic information.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-simplecard--docs" class="component-link" target="_parent">View Docs</a>
            </div>
          </div>

          <div class="component-card">
            <h3>DynamicCard</h3>
            <div class="component-tag">&lt;nosto-dynamic-card/&gt;</div>
            <div class="component-description">
              Dynamic product card templating for Shopify. Advanced product display with customizable layouts and
              content.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-dynamiccard--docs" class="component-link" target="_parent">View Docs</a>
            </div>
          </div>

          <div class="component-card">
            <h3>VariantSelector</h3>
            <div class="component-tag">&lt;nosto-variant-selector/&gt;</div>
            <div class="component-description">
              Product variant options as clickable pills. Shopify-specific variant selection interface with pill-style
              buttons.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-variantselector--docs" class="component-link" target="_parent"
                >View Docs</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: "Overview of all available Nosto Web Components with links to their documentation and examples."
      }
    }
  }
}
