import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { html } from "lit"
import { updateShopifyRoot } from "../../utils/storybook"
import { getExampleHandles } from "../../shopify/graphql/getExampleHandles"

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
  title: "Components/SimpleCard",
  component: "nosto-simple-card",
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
      control: "number",
      description: "Product rating (0-5 stars)"
    },
    sizes: {
      control: "text",
      description: "The sizes attribute for responsive images"
    }
  },
  args: {
    root,
    alternate: false,
    brand: false,
    discount: false,
    rating: 0,
    sizes: ""
  },
  tags: ["autodocs"]
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.1rem; max-width: 1200px;">
        ${handles.map(
          (handle: string) => html`
            <nosto-simple-card
              handle="${handle}"
              ?alternate=${args.alternate}
              ?brand=${args.brand}
              ?discount=${args.discount}
              rating=${args.rating || 0}
              sizes="${args.sizes || ""}"
            ></nosto-simple-card>
          `
        )}
      </div>
    `
  },
  decorators: [story => html`<div style="max-width: 1200px; margin: 0 auto;">${story()}</div>`]
}

export const SingleCard: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <nosto-simple-card
        handle="${handles[0]}"
        ?alternate=${args.alternate}
        ?brand=${args.brand}
        ?discount=${args.discount}
        rating=${args.rating || 0}
        sizes="${args.sizes || ""}"
      >
        <button n-atc>Add to cart</button>
      </nosto-simple-card>
    `
  }
}

export const WithVariantSelector: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <nosto-simple-card
        handle="${handles[0]}"
        ?alternate=${args.alternate}
        ?brand=${args.brand}
        ?discount=${args.discount}
        rating=${args.rating || 0}
      >
        <nosto-variant-selector handle="${handles[0]}"></nosto-variant-selector>
        <button n-atc>Add to cart</button>
      </nosto-simple-card>
    `
  }
}

export const WithAllFeatures: Story = {
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <nosto-simple-card
        handle="${handles[0]}"
        ?alternate=${args.alternate}
        ?brand=${args.brand}
        ?discount=${args.discount}
        rating=${args.rating || 0}
        sizes="${args.sizes || ""}"
      ></nosto-simple-card>
    `
  },
  args: {
    alternate: true,
    brand: true,
    discount: true,
    rating: 4.2
  },
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`]
}

export const Mocked: Story = {
  render: args => html` <nosto-simple-card handle="mock" mock="${args.mock}"></nosto-simple-card> `,
  args: {
    mock: true
  },
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
}
