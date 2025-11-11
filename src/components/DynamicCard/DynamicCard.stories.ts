import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { html } from "lit"
import { updateShopifyRoot } from "../../utils/storybook"

const root = "https://nosto-shopify1.myshopify.com/"
const handles = ["good-ol-shoes", "awesome-sneakers", "old-school-kicks", "insane-shoes"]

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
    handle: {
      control: "text",
      description: "The product handle to fetch data for"
    },
    template: {
      control: "text",
      description: "The template to use for rendering the product"
    },
    section: {
      control: "text",
      description: "The section to use for rendering the product"
    },
    variantId: {
      control: "text",
      description: "The variant ID to fetch specific variant data"
    },
    placeholder: {
      control: "boolean",
      description: "Display placeholder content while loading"
    },
    lazy: {
      control: "boolean",
      description: "Only fetch data when it comes into view"
    },
    mock: {
      control: "boolean",
      description: "Display a mock preview instead of fetching real product data"
    }
  },
  args: {
    root,
    handle: handles[0],
    template: "card",
    section: "",
    variantId: "",
    placeholder: false,
    lazy: false,
    mock: false
  },
  tags: ["autodocs"]
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: {
      mock: true,
      handle: handles[1],
      template: "card",
      placeholder: true
  },
  decorators: [story => html`<div style="max-width: 600px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-dynamic-card
      handle="${args.handle}"
      template="${args.template}"
      ?placeholder=${args.placeholder}
      ?lazy=${args.lazy}
      ?mock=${args.mock}
    ></nosto-dynamic-card>
  `
}