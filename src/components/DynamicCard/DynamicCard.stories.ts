import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { html } from "lit"

const meta: Meta = {
  title: "Components/DynamicCard",
  component: "nosto-dynamic-card",
  argTypes: {
    mock: {
      control: "boolean"
    }
  },
  args: {
    mock: false
  },
  tags: ["autodocs"]
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => html`
    <div>
      The nosto-dynamic-card component is designed to fetch live product data from Shopify and does not render in
      Storybook when mock is false. To view an example, please see the <strong>Mock</strong> story.
    </div>
  `
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
