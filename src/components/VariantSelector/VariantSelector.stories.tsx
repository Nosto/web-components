import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import "./VariantSelector"

const root = "https://nosto-shopify1.myshopify.com/"
const handles = ["awesome-sneakers", "good-ol-shoes", "old-school-kicks", "insane-shoes"]

// Reusable decorator logic
function updateShopifyRoot(rootUrl: string) {
  window.Shopify = {
    routes: {
      root: rootUrl
    }
  }
}

const meta: Meta = {
  title: "Components/VariantSelector",
  component: "nosto-variant-selector",
  decorators: [
    (story, context) => {
      // Update Shopify root if provided via args
      if (context.args?.root) {
        updateShopifyRoot(context.args.root)
      }
      return story()
    }
  ],
  argTypes: {
    root: {
      control: "text",
      description: "The Shopify store root URL"
    },
    handle: {
      control: "text",
      description: "The Shopify product handle to fetch data for"
    }
  },
  args: {
    root,
    handle: handles[0]
  },
  parameters: {
    docs: {
      description: {
        component:
          "A custom element that renders variant selection controls for Shopify products. Fetches product data from Shopify and allows users to select variants through button controls."
      }
    }
  }
}

export default meta
type Story = StoryObj

export const Basic: Story = {
  decorators: [story => html`<div style="max-width: 600px; margin: 20px auto;">${story()}</div>`],
  render: args => html`
    <div class="story-container">
      <style>
        .story-container {
          padding: 20px;
        }

        .product-demo {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          background: white;
        }

        .product-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }

        .product-description {
          margin-bottom: 20px;
          color: #666;
          line-height: 1.5;
        }

        .variant-info {
          margin-top: 20px;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 4px;
        }

        .variant-info h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .variant-info p {
          margin: 5px 0;
          color: #666;
        }

        .note {
          padding: 15px;
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 4px;
          color: #856404;
          margin-top: 20px;
        }

        /* CSS Variables for component styling */
        nosto-variant-selector {
          --nosto-font-family: system-ui, -apple-system, sans-serif;
          --nosto-option-spacing: 1.5rem;
          --nosto-label-weight: 600;
          --nosto-label-color: #2c3e50;
          --nosto-button-padding: 0.75rem 1rem;
          --nosto-button-border: 2px solid #e9ecef;
          --nosto-button-radius: 6px;
          --nosto-button-bg: white;
          --nosto-button-color: #495057;
          --nosto-button-hover-bg: #f8f9fa;
          --nosto-button-hover-border: #adb5bd;
          --nosto-button-selected-bg: #007bff;
          --nosto-button-selected-color: white;
          --nosto-button-selected-border: #007bff;
          --nosto-button-focus-border: #80bdff;
          --nosto-button-focus-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
          --nosto-button-spacing: 0.75rem;
        }
      </style>

      <div class="product-demo">
        <div class="product-title">Shopify Product Variant Selector</div>
        <div class="product-description">
          This component fetches product data from a real Shopify store and displays variant options as interactive
          buttons. Select different options to see how variants change.
        </div>

        <nosto-variant-selector handle="${args.handle}"></nosto-variant-selector>

        <div class="variant-info">
          <h4>Selected Variant Info:</h4>
          <p id="variant-details">Select variant options to see details...</p>
        </div>

        <div class="note">
          <strong>Note:</strong> This component fetches live data from the Shopify store. The variant selector uses
          Shadow DOM with CSS variables for styling, and renders options as accessible buttons instead of dropdowns.

          <br /><br />

          <strong>CSS Variables:</strong> Customize the appearance using CSS variables like:
          <code>--nosto-button-bg</code>, <code>--nosto-button-selected-bg</code>, <code>--nosto-option-spacing</code>,
          etc.
        </div>
      </div>
    </div>

    <script>
      ;(() => {
        const selector = document.querySelector("nosto-variant-selector")
        const detailsElement = document.getElementById("variant-details")

        function updateVariantInfo(event) {
          const { variant, product } = event.detail
          if (variant) {
            detailsElement.innerHTML = \`
              <strong>\${variant.title}</strong><br>
              SKU: \${variant.sku}<br>
              Price: $\${(variant.price / 100).toFixed(2)}<br>
              Available: \${variant.available ? "Yes" : "No"}
            \`
          } else {
            detailsElement.innerHTML = "No variant selected or variant not found"
          }
        }

        selector.addEventListener("@nosto/VariantSelector/variant-selected", updateVariantInfo)
      })()
    </script>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Basic usage of the VariantSelector component with button-based variant selection and Shadow DOM styling."
      }
    }
  }
}

export const SingleOption: Story = {
  args: {
    handle: "good-ol-shoes"
  },
  decorators: [story => html`<div style="max-width: 600px; margin: 20px auto;">${story()}</div>`],
  render: args => html`
    <div class="story-container">
      <div class="product-demo">
        <div class="product-title">Single Option Product</div>
        <div class="product-description">
          This example shows a product with only one option type, demonstrating simpler use cases.
        </div>

        <nosto-variant-selector handle="${args.handle}"></nosto-variant-selector>

        <div class="variant-info">
          <h4>Selected Variant Info:</h4>
          <p id="shoes-variant-details">Select a variant to see details...</p>
        </div>
      </div>
    </div>

    <script>
      ;(() => {
        const selector = document.querySelector('nosto-variant-selector[handle="good-ol-shoes"]')
        const detailsElement = document.getElementById("shoes-variant-details")

        function updateVariantInfo(event) {
          const { variant } = event.detail
          if (variant) {
            detailsElement.innerHTML = \`
              <strong>\${variant.title}</strong><br>
              SKU: \${variant.sku}<br>
              Price: $\${(variant.price / 100).toFixed(2)}
            \`
          } else {
            detailsElement.innerHTML = "No variant selected"
          }
        }

        selector.addEventListener("@nosto/VariantSelector/variant-selected", updateVariantInfo)
      })()
    </script>
  `,
  parameters: {
    docs: {
      description: {
        story: "VariantSelector with a single option demonstrating simpler use cases."
      }
    }
  }
}
