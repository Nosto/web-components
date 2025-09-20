import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import { mockNostojs } from "@nosto/nosto-js/testing"
import "./Control.stories.css"

// Helper function to mock user segments
function mockSegments(segments: string[]) {
  mockNostojs({
    internal: {
      getSegments: () => Promise.resolve(segments)
    }
  })
}

// Storybook decorator for wrapping stories with container styling
const withStoryContainer = (story: () => unknown) => html`
  <div class="story-container">
    <div class="demo-section">${story()}</div>
  </div>
`

const meta: Meta = {
  title: "Components/Control",
  component: "nosto-control",
  decorators: [withStoryContainer],
  parameters: {
    docs: {
      description: {
        component:
          "A custom element that shows different content templates based on user segments from Nosto. The first matching segment template will be displayed."
      }
    }
  }
}

export default meta
type Story = StoryObj

export const BasicSegmentation: Story = {
  render: () => {
    // Mock user segments - user belongs to "premium" segment
    mockSegments(["premium", "returning-customer"])

    return html`
      <nosto-control>
        <template segment="new-visitor">
          <h3>👋 Welcome, New Visitor!</h3>
        </template>
        <template segment="premium">
          <h3>✨ Premium Member Benefits</h3>
        </template>
        <template segment="returning-customer">
          <h3>🎉 Welcome Back!</h3>
        </template>
      </nosto-control>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "Basic segmentation showing different content for different user segments. The 'premium' template will be shown first since it matches the user's segments."
      }
    }
  }
}

export const NewVisitorExperience: Story = {
  render: () => {
    // Mock user segments - new visitor
    mockSegments(["new-visitor"])

    return html`
      <nosto-control>
        <template segment="new-visitor">
          <h3>🎉 Welcome to Our Store!</h3>
        </template>
        <template segment="returning-customer">
          <h3>Welcome back!</h3>
        </template>
        <template segment="premium">
          <h3>Premium Dashboard</h3>
        </template>
      </nosto-control>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Specialized onboarding experience for new visitors with step-by-step guidance."
      }
    }
  }
}

export const NoMatchingSegment: Story = {
  render: () => {
    // Mock user segments - user has segments that don't match any templates
    mockSegments(["anonymous", "mobile-user"])

    return html`
      <nosto-control>
        <div class="default-content">
          <h3>🌐 Default Content</h3>
        </div>
        <template segment="premium">
          <h3>Premium Member</h3>
        </template>
        <template segment="new-visitor">
          <h3>New Visitor</h3>
        </template>
        <template segment="vip-customer">
          <h3>VIP Customer</h3>
        </template>
      </nosto-control>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates fallback behavior when no template segment matches the user's current segments."
      }
    }
  }
}

export const VIPCustomerExperience: Story = {
  render: () => {
    // Mock user segments - VIP customer
    mockSegments(["vip-customer", "high-value", "premium"])

    return html`
      <nosto-control>
        <template segment="new-visitor">
          <h3>New Visitor Content</h3>
        </template>
        <template segment="vip-customer">
          <h3>💎 VIP Customer Portal</h3>
        </template>
        <template segment="premium">
          <h3>Premium Member Content</h3>
        </template>
      </nosto-control>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "VIP customer experience showing the first matching template (vip-customer) even when multiple segments match."
      }
    }
  }
}
