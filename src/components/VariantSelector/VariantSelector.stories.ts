import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { html } from "lit"
import { updateShopifyRoot } from "../../utils/storybook"
import { getExampleHandles } from "../../shopify/graphql/getExampleHandles"
import "./VariantSelector"

const root = "https://nosto-shopify1.myshopify.com/"

// Shared loader for fetching example handles
const exampleHandlesLoader = async (context: { args: { root?: string } }) => ({
  handles: await getExampleHandles(context.args.root || root, 12)
})

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
  loaders: [exampleHandlesLoader],
  argTypes: {
    root: {
      control: "text",
      description: "The Shopify store root URL"
    }
  },
  args: {
    root
  },
  tags: ["autodocs"]
}

export default meta
type Story = StoryObj

export const SingleProduct: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (_args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html` <nosto-variant-selector handle="${handles[0]}"></nosto-variant-selector> `
  },
  loaders: [exampleHandlesLoader]
}

export const InSimpleCard: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (_args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <nosto-simple-card handle="${handles[0]}" alternate brand discount rating="4.5">
        <nosto-variant-selector handle="${handles[0]}"></nosto-variant-selector>
      </nosto-simple-card>
    `
  },
  loaders: [exampleHandlesLoader]
}

export const InSimpleCard_AddToCart: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (_args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <nosto-simple-card handle="${handles[0]}" alternate brand discount rating="4.5">
        <nosto-variant-selector handle="${handles[0]}"></nosto-variant-selector>
        <button n-atc>Add to cart</button>
      </nosto-simple-card>
    `
  },
  loaders: [exampleHandlesLoader]
}

export const Default: Story = {
  loaders: [exampleHandlesLoader],
  render: (_args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <div
        style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; padding: 1rem; max-width: 1200px;"
      >
        ${handles.map(
          (handle: string) => html`
            <nosto-simple-card handle="${handle}" alternate brand discount rating="3.8">
              <nosto-variant-selector handle="${handle}"></nosto-variant-selector>
            </nosto-simple-card>
          `
        )}
      </div>
    `
  }
}

export const WithPlaceholder: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (_args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <nosto-simple-card handle="${handles[0]}" alternate brand discount rating="4.5">
        <nosto-variant-selector handle="${handles[0]}" placeholder></nosto-variant-selector>
      </nosto-simple-card>
    `
  },
  loaders: [exampleHandlesLoader],
  parameters: {
    docs: {
      description: {
        story:
          "When the `placeholder` attribute is set, the component will display cached content from a previous render while loading new data. This is useful for preventing layout shifts and providing a better user experience."
      }
    }
  }
}
