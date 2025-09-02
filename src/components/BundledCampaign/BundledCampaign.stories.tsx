import type { Meta, StoryObj } from "@storybook/web-components"
import { BundledCampaign } from "./BundledCampaign"

const meta: Meta<BundledCampaign> = {
  title: "Components/BundledCampaign",
  component: "nosto-bundled-campaign",
  parameters: {
    layout: "centered"
  },
  argTypes: {
    placement: {
      control: "text",
      description: "The placement identifier for the campaign."
    },
    handles: {
      control: "text",
      description: "The product handles to compare against fetched results."
    }
  }
}

export default meta
type Story = StoryObj<BundledCampaign>

export const Default: Story = {
  args: {
    placement: "bundled-product-recommendations",
    handles: "product-a:product-b"
  },
  render: args => `
    <nosto-bundled-campaign 
      placement="${args.placement}" 
      handles="${args.handles}">
      <p>Loading bundled campaign content...</p>
    </nosto-bundled-campaign>
  `
}

export const DifferentHandles: Story = {
  args: {
    placement: "bundled-product-recommendations",
    handles: "different-product:another-product"
  },
  render: args => `
    <nosto-bundled-campaign 
      placement="${args.placement}" 
      handles="${args.handles}">
      <p>This will trigger a fetch since handles will likely differ from recommendations...</p>
    </nosto-bundled-campaign>
  `
}

export const EmptyState: Story = {
  args: {
    placement: "empty-placement",
    handles: ""
  },
  render: args => `
    <nosto-bundled-campaign 
      placement="${args.placement}" 
      handles="${args.handles}">
      <p>Empty state - no recommendations available.</p>
    </nosto-bundled-campaign>
  `
}