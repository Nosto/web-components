import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { html } from "lit"
import { shopifyRootDecorator, gridLayoutArgTypes } from "../../storybookUtils"
import { exampleHandlesLoader } from "../../storybook"

const root = "https://nosto-shopify1.myshopify.com/"

window.Shopify = {
  routes: {
    root
  }
}

const meta = {
  title: "Components/DynamicCard",
  component: "nosto-dynamic-card",
  decorators: [shopifyRootDecorator],
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
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  loaders: [exampleHandlesLoader],
  argTypes: gridLayoutArgTypes,
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
