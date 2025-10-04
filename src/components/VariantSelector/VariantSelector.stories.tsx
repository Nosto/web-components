import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"

const root = "https://nosto-shopify1.myshopify.com/"
const handles = ["awesome-sneakers", "good-ol-shoes", "old-school-kicks", "insane-shoes"]

window.Shopify = {
  routes: {
    root
  }
}

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
  }
}

export default meta
type Story = StoryObj

export const Default: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html` <nosto-variant-selector handle="${args.handle}"></nosto-variant-selector> `
}

export const WithSimpleCard: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-simple-card handle="${args.handle}" alternate brand discount rating="4.5">
      <nosto-variant-selector handle="${args.handle}"></nosto-variant-selector>
    </nosto-simple-card>
  `
}

export const MultipleProducts: Story = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; padding: 1rem; max-width: 1200px;"
    >
      ${handles.map(
        handle => html`
          <nosto-simple-card handle="${handle}" alternate brand discount rating="3.8">
            <nosto-variant-selector handle="${handle}"></nosto-variant-selector>
          </nosto-simple-card>
        `
      )}
    </div>
  `
}
