import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { html } from "lit"
import "./VariantSelector2"

const handles = ["good-ol-shoes", "awesome-sneakers", "old-school-kicks", "insane-shoes"]

const meta: Meta = {
  title: "Components/VariantSelector2",
  component: "nosto-variant-selector2",
  argTypes: {
    handle: {
      control: "text",
      description: "The Shopify product handle to fetch data for"
    },
    storefrontAccessToken: {
      control: "text",
      description: "Shopify Storefront API access token"
    },
    shopDomain: {
      control: "text",
      description: "Shopify shop domain (e.g., 'myshop.myshopify.com')"
    },
    apiVersion: {
      control: "text",
      description: "Shopify Storefront API version (defaults to '2024-01')"
    }
  },
  args: {
    handle: handles[0],
    storefrontAccessToken: "",
    shopDomain: "",
    apiVersion: "2024-01"
  },
  tags: ["autodocs"]
}

export default meta
type Story = StoryObj

export const Default: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-variant-selector2
      handle="${args.handle}"
      storefront-access-token="${args.storefrontAccessToken}"
      shop-domain="${args.shopDomain}"
      api-version="${args.apiVersion}"
    ></nosto-variant-selector2>
  `
}

export const InSimpleCard: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-simple-card handle="${args.handle}" alternate brand discount rating="4.5">
      <nosto-variant-selector2
        handle="${args.handle}"
        storefront-access-token="${args.storefrontAccessToken}"
        shop-domain="${args.shopDomain}"
        api-version="${args.apiVersion}"
      ></nosto-variant-selector2>
    </nosto-simple-card>
  `
}

export const InSimpleCard_AddToCart: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-simple-card handle="${args.handle}" alternate brand discount rating="4.5">
      <nosto-variant-selector2
        handle="${args.handle}"
        storefront-access-token="${args.storefrontAccessToken}"
        shop-domain="${args.shopDomain}"
        api-version="${args.apiVersion}"
      ></nosto-variant-selector2>
      <button n-atc>Add to cart</button>
    </nosto-simple-card>
  `
}

export const MultipleProducts: Story = {
  render: args => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; padding: 1rem; max-width: 1200px;"
    >
      ${handles.map(
        handle => html`
          <nosto-simple-card handle="${handle}" alternate brand discount rating="3.8">
            <nosto-variant-selector2
              handle="${handle}"
              storefront-access-token="${args.storefrontAccessToken}"
              shop-domain="${args.shopDomain}"
              api-version="${args.apiVersion}"
            ></nosto-variant-selector2>
          </nosto-simple-card>
        `
      )}
    </div>
  `
}

export const WithPlaceholder: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-simple-card handle="${args.handle}" alternate brand discount rating="4.5">
      <nosto-variant-selector2
        handle="${args.handle}"
        storefront-access-token="${args.storefrontAccessToken}"
        shop-domain="${args.shopDomain}"
        api-version="${args.apiVersion}"
        placeholder
      ></nosto-variant-selector2>
    </nosto-simple-card>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "When the `placeholder` attribute is set, the component will display cached content from a previous render while loading new data. This is useful for preventing layout shifts and providing a better user experience."
      }
    }
  }
}
