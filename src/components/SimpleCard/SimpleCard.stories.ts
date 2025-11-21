import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { html } from "lit"
import { ifDefined } from "lit/directives/if-defined.js"
import {
  shopifyRootDecorator,
  shopifyProductArgTypes,
  gridLayoutArgTypes,
  shopifyLoaders,
  createShopifyProductArgs
} from "../../storybookUtils"

const root = "https://nosto-shopify1.myshopify.com/"

window.Shopify = {
  routes: {
    root
  }
}

const meta: Meta = {
  title: "Components/SimpleCard",
  component: "nosto-simple-card",
  decorators: [shopifyRootDecorator],
  loaders: shopifyLoaders,
  argTypes: shopifyProductArgTypes,
  args: createShopifyProductArgs(root),
  tags: ["autodocs"]
}

export default meta
type Story = StoryObj

export const Default: Story = {
  argTypes: gridLayoutArgTypes,
  args: {
    columns: 4,
    products: 12
  },
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <div
        style="display: grid; grid-template-columns: repeat(${args.columns}, 1fr); gap: 0.5rem; padding: 1rem; max-width: 1200px;"
      >
        ${handles.map(
          handle => html`
            <nosto-simple-card
              handle="${handle}"
              image-mode=${ifDefined(args.imageMode)}
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
        image-mode=${ifDefined(args.imageMode)}
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
        image-mode=${ifDefined(args.imageMode)}
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
        image-mode=${ifDefined(args.imageMode)}
        ?brand=${args.brand}
        ?discount=${args.discount}
        rating=${args.rating || 0}
        sizes="${args.sizes || ""}"
      ></nosto-simple-card>
    `
  },
  args: {
    imageMode: "alternate",
    brand: true,
    discount: true,
    rating: 4.2
  },
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`]
}

export const WithCarousel: Story = {
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <nosto-simple-card
        handle="${handles[0]}"
        image-mode=${ifDefined(args.imageMode)}
        ?brand=${args.brand}
        ?discount=${args.discount}
        rating=${args.rating || 0}
        sizes="${args.sizes || ""}"
      ></nosto-simple-card>
    `
  },
  args: {
    imageMode: "carousel",
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
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`]
}
