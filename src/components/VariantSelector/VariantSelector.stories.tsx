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
    <style>
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

    <nosto-variant-selector handle="${args.handle}"></nosto-variant-selector>
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
  render: args => html`<nosto-variant-selector handle="${args.handle}"></nosto-variant-selector>`,
  parameters: {
    docs: {
      description: {
        story: "VariantSelector with a single option demonstrating simpler use cases."
      }
    }
  }
}
