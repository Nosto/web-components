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
  argTypes: {
    root: {
      control: "text",
      description: "The Shopify store root URL"
    },
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
    handle: handles[0],
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
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-simple-card
      handle="${args.handle}"
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

export const WithVariantSelector: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-simple-card
      handle="${args.handle}"
      ?alternate=${args.alternate}
      ?brand=${args.brand}
      ?discount=${args.discount}
      rating=${args.rating || 0}
    >
      <nosto-variant-selector handle="${args.handle}"></nosto-variant-selector>
      <button n-atc>Add to cart</button>
    </nosto-simple-card>
  `
}

export const WithAllFeatures: Story = {
  args: {
    handle: handles[0],
    alternate: true,
    brand: true,
    discount: true,
    rating: 4.2
  },
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-simple-card
      handle="${args.handle}"
      ?alternate=${args.alternate}
      ?brand=${args.brand}
      ?discount=${args.discount}
      rating=${args.rating || 0}
      sizes="${args.sizes || ""}"
    ></nosto-simple-card>
  `
}

export const WithResponsiveSizes: Story = {
  args: {
    handle: handles[0],
    alternate: true,
    brand: true,
    discount: true,
    rating: 4.2,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  },
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-simple-card
      handle="${args.handle}"
      ?alternate=${args.alternate}
      ?brand=${args.brand}
      ?discount=${args.discount}
      rating=${args.rating || 0}
      sizes="${args.sizes || ""}"
    ></nosto-simple-card>
  `
}

export const GridOfCards: Story = {
  decorators: [story => html`<div style="max-width: 1200px; margin: 0 auto;">${story()}</div>`],
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; padding: 1rem; max-width: 1200px;">
      ${handles.map(
        handle => html`
          <nosto-simple-card
            handle="${handle}"
            alternate
            brand
            discount
            rating="3.8"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          ></nosto-simple-card>
        `
      )}
    </div>
  `
}
