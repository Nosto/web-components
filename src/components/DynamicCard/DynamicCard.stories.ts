import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { html } from "lit"
import { updateShopifyRoot } from "../../utils/storybook"
import { getExampleHandles } from "../../shopify/graphql/getExampleHandles"

const root = "https://nosto-shopify1.myshopify.com/"

// Shared loader for fetching example handles
const exampleHandlesLoader = async (context: { args: { root?: string; products?: number } }) => {
  const { products, root: argRoot } = context.args
  return {
    handles: await getExampleHandles(argRoot || root, products)
  }
}

window.Shopify = {
  routes: {
    root
  }
}

const meta: Meta = {
  title: "Components/DynamicCard",
  component: "nosto-dynamic-card",
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
    template: {
      control: "text",
      description: "The template to use for rendering the product"
    },
    section: {
      control: "text",
      description: "The section to use for rendering the product"
    },
    mock: {
      control: "boolean"
    }
  },
  args: {
    root,
    template: "",
    section: "",
    mock: false
  },
  tags: ["autodocs"]
}

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
