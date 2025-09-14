import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"

const meta: Meta = {
  title: "Components/QuickView",
  component: "nosto-quick-view",
  parameters: {
    layout: "centered"
  }
}

export default meta

type Story = StoryObj

// TODO expose mock product data via http
export const Default: Story = {
  render: () => html`<nosto-quick-view handle="test" reco-id="test"></nosto-quick-view>`
}
