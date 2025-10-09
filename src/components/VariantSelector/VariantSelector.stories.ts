import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import { updateShopifyRoot } from "../../utils/storybook"
import { http, HttpResponse } from "msw"
import { mockProductWithSingleValueOption, mockProductAllSingleValue } from "../../mock/products"
import "./VariantSelector"

const root = "https://nosto-shopify1.myshopify.com/"
const handles = ["good-ol-shoes", "awesome-sneakers", "old-school-kicks", "insane-shoes"]

window.Shopify = {
  routes: {
    root
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
  tags: ["autodocs"]
}

export default meta
type Story = StoryObj

export const Default: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html` <nosto-variant-selector handle="${args.handle}"></nosto-variant-selector> `
}

export const InSimpleCard: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-simple-card handle="${args.handle}" alternate brand discount rating="4.5">
      <nosto-variant-selector handle="${args.handle}"></nosto-variant-selector>
    </nosto-simple-card>
  `
}

export const InSimpleCard_AddToCart: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-simple-card handle="${args.handle}" alternate brand discount rating="4.5">
      <nosto-variant-selector handle="${args.handle}"></nosto-variant-selector>
      <button n-atc>Add to cart</button>
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

export const SingleValueOptionDemo: Story = {
  decorators: [
    story => {
      // Set up MSW handlers for mock products
      const worker = (window as { __mswWorker?: { use: (...handlers: unknown[]) => void } }).__mswWorker
      if (worker) {
        worker.use(
          http.get("*/products/single-value-demo-tshirt.js", () => {
            return HttpResponse.json(mockProductWithSingleValueOption)
          }),
          http.get("*/products/all-single-value-product.js", () => {
            return HttpResponse.json(mockProductAllSingleValue)
          })
        )
      }
      return html`<div style="max-width: 800px; margin: 0 auto; padding: 2rem;">${story()}</div>`
    }
  ],
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 3rem;">
      <div>
        <h3 style="margin-bottom: 1rem; color: #333;">
          Mixed Options: Size (visible) + Material (hidden single-value)
        </h3>
        <p style="margin-bottom: 1rem; color: #666; font-size: 0.9rem;">
          The "Material: Cotton" option is automatically selected and hidden from the UI because it only has one value.
          Only the "Size" option with multiple values is shown.
        </p>
        <nosto-simple-card handle="single-value-demo-tshirt" alternate brand>
          <nosto-variant-selector handle="single-value-demo-tshirt" preselect></nosto-variant-selector>
        </nosto-simple-card>
      </div>

      <div>
        <h3 style="margin-bottom: 1rem; color: #333;">All Single-Value Options: No UI Rendered</h3>
        <p style="margin-bottom: 1rem; color: #666; font-size: 0.9rem;">
          When all options have only one value, no variant selector UI is shown. The variant is automatically selected
          internally.
        </p>
        <nosto-simple-card handle="all-single-value-product" alternate brand>
          <nosto-variant-selector handle="all-single-value-product"></nosto-variant-selector>
          <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #666; font-style: italic;">
            ↑ No variant selector appears (all options auto-selected)
          </div>
        </nosto-simple-card>
      </div>
    </div>
  `
}
