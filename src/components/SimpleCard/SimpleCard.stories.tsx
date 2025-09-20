import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"

const meta: Meta = {
  title: "Components/SimpleCard",
  component: "nosto-simple-card",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The SimpleCard component fetches Shopify product data and renders a product card with configurable display options.

**Features:**
- Fetches product data from Shopify's \`/products/<handle>.js\` endpoint
- Configurable display of brand, discount, rating, and alternate images
- Based on Shopify Dawn theme card structure
- Loading states and error handling

**Note:** In this demo, the component will show an error since it cannot reach actual Shopify endpoints. 
In a real Shopify environment, it would fetch and display product data.
        `.trim()
      }
    }
  },
  argTypes: {
    handle: {
      control: "text",
      description: "Product handle to fetch data for"
    },
    alternate: {
      control: "boolean",
      description: "Show alternate product image on hover"
    },
    brand: {
      control: "boolean",
      description: "Show brand/vendor data"
    },
    discount: {
      control: "boolean",
      description: "Show discount data"
    },
    rating: {
      control: "boolean",
      description: "Show rating data"
    }
  }
}

export default meta

type Story = StoryObj

export const Default: Story = {
  args: {
    handle: "awesome-product"
  },
  render: (args) => html`
    <nosto-simple-card
      handle="${args.handle}"
      ?alternate="${args.alternate}"
      ?brand="${args.brand}"
      ?discount="${args.discount}"
      ?rating="${args.rating}"
    ></nosto-simple-card>
  `
}

export const WithAllFeatures: Story = {
  args: {
    handle: "premium-headphones",
    alternate: true,
    brand: true,
    discount: true,
    rating: true
  },
  render: (args) => html`
    <nosto-simple-card
      handle="${args.handle}"
      ?alternate="${args.alternate}"
      ?brand="${args.brand}"
      ?discount="${args.discount}"
      ?rating="${args.rating}"
    ></nosto-simple-card>
  `
}

export const WithBrandOnly: Story = {
  args: {
    handle: "basic-product",
    brand: true
  },
  render: (args) => html`
    <nosto-simple-card
      handle="${args.handle}"
      ?alternate="${args.alternate}"
      ?brand="${args.brand}"
      ?discount="${args.discount}"
      ?rating="${args.rating}"
    ></nosto-simple-card>
  `
}

export const FeatureComparison: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; max-width: 800px;">
      <div>
        <h3 style="margin-top: 0; margin-bottom: 1rem;">Basic Card</h3>
        <nosto-simple-card handle="product-basic"></nosto-simple-card>
      </div>
      <div>
        <h3 style="margin-top: 0; margin-bottom: 1rem;">Full Featured Card</h3>
        <nosto-simple-card
          handle="product-featured"
          alternate
          brand
          discount
          rating
        ></nosto-simple-card>
      </div>
    </div>
  `
}