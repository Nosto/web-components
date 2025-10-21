import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"

const meta: Meta = {
  title: "Introduction/Welcome",
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

export const Welcome: Story = {
  render: () => html`
    <style>
      .welcome-page {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
        line-height: 1.6;
        color: #333;
      }

      .header {
        text-align: center;
        margin-bottom: 3rem;
        padding: 2rem;
        background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
        color: white;
        border-radius: 12px;
      }

      .header h1 {
        margin: 0 0 1rem 0;
        font-size: 3rem;
        font-weight: 700;
      }

      .header p {
        margin: 0;
        font-size: 1.25rem;
        opacity: 0.9;
      }

      .components-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
      }

      .component-card {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1.5rem;
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition:
          transform 0.2s,
          box-shadow 0.2s;
      }

      .component-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }

      .component-card h3 {
        margin: 0 0 0.5rem 0;
        color: #ff6b35;
        font-size: 1.25rem;
      }

      .component-tag {
        font-family: "Monaco", "Menlo", monospace;
        background: #f5f5f5;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        color: #666;
        margin-bottom: 1rem;
        display: inline-block;
      }

      .component-description {
        color: #666;
        margin-bottom: 1rem;
        font-size: 0.95rem;
      }

      .component-links {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .component-link {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem 1rem;
        background: #ff6b35;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        transition: background 0.2s;
      }

      .component-link:hover {
        background: #e55a2b;
        color: white;
      }

      .component-link.secondary {
        background: #f0f0f0;
        color: #333;
      }

      .component-link.secondary:hover {
        background: #e0e0e0;
        color: #333;
      }

      .category-section {
        margin: 3rem 0;
      }

      .category-title {
        font-size: 1.5rem;
        color: #333;
        margin-bottom: 1rem;
        border-bottom: 2px solid #ff6b35;
        padding-bottom: 0.5rem;
      }

      .category-description {
        color: #666;
        margin-bottom: 2rem;
        font-style: italic;
      }

      .badge {
        background: #e3f2fd;
        color: #1976d2;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
        margin-left: 0.5rem;
      }

      .shopify-badge {
        background: #e8f5e8;
        color: #2e7d32;
      }

      .quick-links {
        background: #f8f9fa;
        padding: 2rem;
        border-radius: 8px;
        margin: 2rem 0;
        text-align: center;
      }

      .quick-links h2 {
        margin-top: 0;
        color: #333;
      }

      .quick-links-grid {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: 1rem;
      }

      .quick-link {
        display: inline-flex;
        align-items: center;
        padding: 0.75rem 1.5rem;
        background: white;
        color: #333;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 500;
        border: 1px solid #e0e0e0;
        transition: all 0.2s;
      }

      .quick-link:hover {
        background: #ff6b35;
        color: white;
        border-color: #ff6b35;
      }
    </style>

    <div class="welcome-page">
      <div class="header">
        <h1>Nosto Web Components</h1>
        <p>
          Custom elements designed to integrate Nosto's personalization and e-commerce solutions into various web
          platforms
        </p>
      </div>

      <div class="quick-links">
        <h2>Quick Navigation</h2>
        <div class="quick-links-grid">
          <a href="https://docs.nosto.com/techdocs/apis/frontend/oss/web-components" class="quick-link" target="_blank">
            📚 Documentation
          </a>
          <a href="https://nosto.github.io/web-components" class="quick-link" target="_blank"> 📖 TypeDoc API </a>
          <a href="https://github.com/Nosto/web-components" class="quick-link" target="_blank">
            🔗 GitHub Repository
          </a>
        </div>
      </div>

      <div class="category-section">
        <h2 class="category-title">Store Level Templating</h2>
        <p class="category-description">Components for store-wide functionality and page-level integrations</p>

        <div class="components-grid">
          <div class="component-card">
            <h3>Campaign</h3>
            <div class="component-tag">&lt;nosto-campaign&gt;</div>
            <div class="component-description">
              Campaign rendering and product recommendation display. Fetches campaign data from Nosto and injects it
              into the DOM.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-campaign--docs" class="component-link" target="_parent">View Docs</a>
              <a
                href="/?path=/story/components-campaign--basic-campaign"
                class="component-link secondary"
                target="_parent"
                >Stories</a
              >
            </div>
          </div>

          <div class="component-card">
            <h3>Control</h3>
            <div class="component-tag">&lt;nosto-control&gt;</div>
            <div class="component-description">
              Conditional content rendering based on user segments. Show different content to different user groups.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-control--docs" class="component-link" target="_parent">View Docs</a>
              <a
                href="/?path=/story/components-control--basic-control"
                class="component-link secondary"
                target="_parent"
                >Stories</a
              >
            </div>
          </div>

          <div class="component-card">
            <h3>Popup</h3>
            <div class="component-tag">&lt;nosto-popup&gt;</div>
            <div class="component-description">
              Popup content with dialog and ribbon slots. Display promotional content, notifications, or interactive
              overlays.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-popup--docs" class="component-link" target="_parent">View Docs</a>
              <a href="/?path=/story/components-popup--dialog-popup" class="component-link secondary" target="_parent"
                >Stories</a
              >
            </div>
          </div>

          <div class="component-card">
            <h3>SectionCampaign <span class="badge shopify-badge">Shopify</span></h3>
            <div class="component-tag">&lt;nosto-section-campaign&gt;</div>
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
            <div class="component-tag">&lt;nosto-image&gt;</div>
            <div class="component-description">
              Progressive image enhancement with optimization. Supports responsive images with Shopify and BigCommerce
              transformations.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-image--docs" class="component-link" target="_parent">View Docs</a>
              <a href="/?path=/story/components-image--constrained" class="component-link secondary" target="_parent"
                >Stories</a
              >
            </div>
          </div>

          <div class="component-card">
            <h3>Product</h3>
            <div class="component-tag">&lt;nosto-product&gt;</div>
            <div class="component-description">
              Product interaction and cart management. Handles product data, SKU selection, and add-to-cart
              functionality.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-product--docs" class="component-link" target="_parent">View Docs</a>
              <a
                href="/?path=/story/components-product--single-product"
                class="component-link secondary"
                target="_parent"
                >Stories</a
              >
            </div>
          </div>

          <div class="component-card">
            <h3>SkuOptions</h3>
            <div class="component-tag">&lt;nosto-sku-options&gt;</div>
            <div class="component-description">
              Product variant and SKU selection interface. Create interactive option selectors for product variants.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-skuoptions--docs" class="component-link" target="_parent">View Docs</a>
              <a
                href="/?path=/story/components-skuoptions--dual-option-groups"
                class="component-link secondary"
                target="_parent"
                >Stories</a
              >
            </div>
          </div>

          <div class="component-card">
            <h3>SimpleCard <span class="badge shopify-badge">Shopify</span></h3>
            <div class="component-tag">&lt;nosto-simple-card&gt;</div>
            <div class="component-description">
              Simple product card templating for Shopify stores. Streamlined product display with basic information.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-simplecard--docs" class="component-link" target="_parent">View Docs</a>
              <a
                href="/?path=/story/components-simplecard--simple-product-card"
                class="component-link secondary"
                target="_parent"
                >Stories</a
              >
            </div>
          </div>

          <div class="component-card">
            <h3>DynamicCard <span class="badge shopify-badge">Shopify</span></h3>
            <div class="component-tag">&lt;nosto-dynamic-card&gt;</div>
            <div class="component-description">
              Dynamic product card templating for Shopify. Advanced product display with customizable layouts and
              content.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-dynamiccard--docs" class="component-link" target="_parent">View Docs</a>
            </div>
          </div>

          <div class="component-card">
            <h3>VariantSelector <span class="badge shopify-badge">Shopify</span></h3>
            <div class="component-tag">&lt;nosto-variant-selector&gt;</div>
            <div class="component-description">
              Product variant options as clickable pills. Shopify-specific variant selection interface with pill-style
              buttons.
            </div>
            <div class="component-links">
              <a href="/?path=/docs/components-variantselector--docs" class="component-link" target="_parent"
                >View Docs</a
              >
              <a
                href="/?path=/story/components-variantselector--color-variant-selector"
                class="component-link secondary"
                target="_parent"
                >Stories</a
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
        story:
          "Welcome to Nosto Web Components Storybook. This page provides an overview of all available components and their usage."
      }
    }
  }
}
