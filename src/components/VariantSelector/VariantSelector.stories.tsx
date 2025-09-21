import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import "./VariantSelector"

const meta: Meta = {
  title: "Components/VariantSelector",
  component: "nosto-variant-selector",
  parameters: {
    docs: {
      description: {
        component:
          "A custom element that renders variant selection controls for Shopify products. Fetches product data from Shopify and allows users to select variants through dropdown controls."
      }
    }
  }
}

export default meta
type Story = StoryObj

// Note: In a real Shopify environment, this component would fetch actual product data.
// For Storybook demos, you would need to set up mock service workers or use a real Shopify product.

export const Basic: Story = {
  render: () => {
    return html`
      <div class="story-container">
        <style>
          .story-container {
            max-width: 600px;
            margin: 20px auto;
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

          .note {
            padding: 15px;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            color: #856404;
            margin-top: 20px;
          }

          .variant-selector {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .variant-option {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }

          .variant-option label {
            font-weight: 600;
            color: #333;
          }

          .variant-option select {
            padding: 8px 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            background: white;
          }

          .variant-option select:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
          }

          .variant-selector-error {
            color: #dc3545;
            background: #f8d7da;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #f5c6cb;
          }

          [loading] {
            opacity: 0.6;
          }

          [loading]::after {
            content: " (Loading...)";
            color: #666;
          }
        </style>

        <div class="product-demo">
          <div class="product-title">Variant Selector Demo</div>
          <div class="product-description">
            This component fetches product data from Shopify's <code>/products/&lt;handle&gt;.js</code> endpoint and
            renders variant selection controls.
          </div>

          <!-- This will show an error in Storybook since there's no real Shopify product -->
          <nosto-variant-selector handle="demo-product"></nosto-variant-selector>

          <div class="note">
            <strong>Note:</strong> In a real Shopify environment, this component would fetch product data and display
            variant options. In this Storybook demo, it shows an error because no Shopify backend is available.
            
            <br><br>
            
            <strong>Usage:</strong>
            <pre><code>&lt;nosto-variant-selector handle="your-product-handle"&gt;&lt;/nosto-variant-selector&gt;</code></pre>
            
            <br>
            
            <strong>Events:</strong> The component emits <code>@nosto/VariantSelector/variant-selected</code> events
            when the user selects different variants.
          </div>
        </div>
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story: 
          "Basic usage of the VariantSelector component. In a real Shopify environment, this would fetch product data and display variant options. The component automatically handles rendering select inputs for each product option (color, size, etc.) and emits events when variants are selected."
      }
    }
  }
}