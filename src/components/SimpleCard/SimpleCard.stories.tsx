import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import "./SimpleCard.stories.css"

window.Shopify = {
  routes: {
    root: "https://nosto-shopify1.myshopify.com/"
  }
}

const handles = ["awesome-sneakers", "good-ol-shoes", "old-school-kicks"]

const meta: Meta = {
  title: "Components/SimpleCard",
  component: "simple-card",
  decorators: [
    story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`
  ],
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
    handle: handles[0],
    alternate: false,
    brand: false,
    discount: false,
    rating: false
  }
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: args => html`
    <simple-card
      handle="${args.handle}"
      ${args.alternate ? "alternate" : ""}
      ${args.brand ? "brand" : ""}
      ${args.discount ? "discount" : ""}
      ${args.rating ? "rating" : ""}
    ></simple-card>
  `
}

export const WithAllFeatures: Story = {
  args: {
    handle: handles[0],
    alternate: true,
    brand: true,
    discount: true,
    rating: true
  },
  render: args => html`
    <simple-card
      handle="${args.handle}"
      ${args.alternate ? "alternate" : ""}
      ${args.brand ? "brand" : ""}
      ${args.discount ? "discount" : ""}
      ${args.rating ? "rating" : ""}
    ></simple-card>
  `
}
