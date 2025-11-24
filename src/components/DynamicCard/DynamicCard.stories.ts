import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { html } from "lit"
import { exampleHandlesLoader, updateShopifyShop } from "@/storybook/loader"

const shopifyShop = "nosto-shopify1.myshopify.com"
updateShopifyShop(shopifyShop)

const meta = {
  title: "Components/DynamicCard",
  component: "nosto-dynamic-card",
  decorators: [
    (story, context) => {
      // Update Shopify root if provided via args
      if (context.args?.root) {
        updateShopifyShop(context.args.root)
      }
      return story()
    }
  ],
  argTypes: {
    root: {
      control: "text",
      description: "The Shopify store root URL"
    },
    template: {
      control: "text",
      description: "The template to use for rendering the product",
      if: { arg: "section", truthy: false }
    },
    section: {
      control: "text",
      description: "The section to use for rendering the product",
      if: { arg: "template", truthy: false }
    },
    mock: {
      control: "boolean"
    }
  },
  args: {
    root: shopifyShop,
    template: "",
    section: "",
    mock: false
  },
  tags: ["autodocs"]
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  loaders: [exampleHandlesLoader],
  argTypes: {
    columns: {
      description: "Number of columns to display in the grid",
      control: { type: "range", min: 1, max: 8, step: 1 },
      table: {
        category: "Layout options"
      }
    },
    products: {
      description: "Number of products to display in the grid",
      control: { type: "range", min: 1, max: 20, step: 1 },
      table: {
        category: "Layout options"
      }
    }
  },
  args: {
    columns: 4,
    products: 12
  },
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    if (!args.template && !args.section) {
      return html`<p>Please provide either a template or section id.</p>`
    }
    return html`
      <div style="display: grid; grid-template-columns: repeat(${args.columns}, 1fr); gap: 1rem; padding: 1rem;">
        ${handles.map(
          handle => html`
            <nosto-dynamic-card
              handle="${handle}"
              template="${args.template}"
              section="${args.section}"
              ?mock=${args.mock}
            ></nosto-dynamic-card>
          `
        )}
      </div>
    `
  },
  decorators: [
    ...(meta.decorators ?? []),
    story => html`<div style="max-width: 1200px; margin: 0 auto;">${story()}</div>`
  ]
}

export const Mock: Story = {
  args: {
    mock: true
  },
  render: args => html`
    <div style="max-width: 300px">
      <nosto-dynamic-card handle="mock" mock=${args.mock}></nosto-dynamic-card>
    </div>
  `
}
