import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import "./SimpleCard.stories.css"

const meta: Meta = {
  title: "Components/SimpleCard",
  component: "simple-card",
  parameters: {
    docs: {
      description: {
        component: `
A custom element that displays a product card using Shopify product data.

Fetches product data from \`/products/<handle>.js\` and renders a card with product image, title, price, and optional brand, discount, and rating information.

**Note:** In this Storybook environment, the actual Shopify API endpoints are not available, so the cards will show error states. In a real Shopify environment, the component would fetch and display actual product data.
        `
      }
    }
  },
  argTypes: {
    handle: {
      control: "text",
      description: "The Shopify product handle to fetch data for"
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
      description: "Show product rating"
    }
  },
  args: {
    handle: "example-product",
    alternate: false,
    brand: false,
    discount: false,
    rating: false
  }
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: (args) => html`
    <simple-card
      handle="${args.handle}"
      ?alternate="${args.alternate}"
      ?brand="${args.brand}"
      ?discount="${args.discount}"
      ?rating="${args.rating}"
    ></simple-card>
  `
}

export const WithAllFeatures: Story = {
  args: {
    handle: "premium-product",
    alternate: true,
    brand: true,
    discount: true,
    rating: true
  },
  render: (args) => html`
    <simple-card
      handle="${args.handle}"
      ?alternate="${args.alternate}"
      ?brand="${args.brand}"
      ?discount="${args.discount}"
      ?rating="${args.rating}"
    ></simple-card>
  `
}

export const BrandOnly: Story = {
  args: {
    handle: "branded-product",
    alternate: false,
    brand: true,
    discount: false,
    rating: false
  },
  render: (args) => html`
    <simple-card
      handle="${args.handle}"
      ?alternate="${args.alternate}"
      ?brand="${args.brand}"
      ?discount="${args.discount}"
      ?rating="${args.rating}"
    ></simple-card>
  `
}

export const DiscountOnly: Story = {
  args: {
    handle: "sale-product",
    alternate: false,
    brand: false,
    discount: true,
    rating: false
  },
  render: (args) => html`
    <simple-card
      handle="${args.handle}"
      ?alternate="${args.alternate}"
      ?brand="${args.brand}"
      ?discount="${args.discount}"
      ?rating="${args.rating}"
    ></simple-card>
  `
}

export const MultipleCards: Story = {
  render: () => html`
    <div class="card-grid">
      <simple-card handle="product-1"></simple-card>
      <simple-card handle="product-2" brand></simple-card>
      <simple-card handle="product-3" discount></simple-card>
      <simple-card handle="product-4" brand discount rating></simple-card>
      <simple-card handle="product-5" alternate brand discount rating></simple-card>
    </div>
  `
}