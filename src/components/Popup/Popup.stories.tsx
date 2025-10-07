import type { StoryObj, Meta } from "@storybook/web-components"
import { html } from "lit"

import "./Popup"

const meta: Meta = {
  title: "Components/Popup",
  component: "nosto-popup",
  argTypes: {
    name: {
      control: "text",
      description: "Optional name used in analytics and localStorage for persistent closing"
    },
    segment: {
      control: "text",
      description: "Optional Nosto segment that acts as a precondition for activation"
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
A popup component that displays content in a dialog with optional ribbon content.
Supports segment-based activation and persistent closure state using localStorage.
        `
      }
    }
  }
}

export default meta
type Story = StoryObj

// reset popular storage key for demo purposes
localStorage.clear()

export const Default: Story = {
  args: {},
  render: () => html`
    <nosto-popup name="default-example">
      <div slot="default" style="padding: 2rem; background: white; border-radius: 8px; max-width: 400px;">
        <h2 style="margin-top: 0;">Special Offer!</h2>
        <p>Get 20% off your next purchase when you sign up for our newsletter.</p>
        <button
          style="background: #007acc; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer;"
        >
          Sign Up Now
        </button>
        <button
          n-ribbon
          style="background: transparent; border: 1px solid #ccc; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer; margin-left: 0.5rem;"
        >
          Maybe Later
        </button>
        <button
          n-close
          style="background: transparent; border: 1px solid #ccc; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer; margin-left: 0.5rem;"
        >
          Close
        </button>
      </div>
      <div slot="ribbon">Hello from the ribbon!</div>
    </nosto-popup>
  `
}

export const WithRibbon: Story = {
  args: {},
  render: () => html`
    <nosto-popup name="ribbon-example">
      <div slot="default" style="padding: 2rem; background: white; border-radius: 8px; max-width: 400px;">
        <h2 style="margin-top: 0;">Limited Time Offer</h2>
        <p>Don't miss out on this exclusive deal!</p>
        <button
          style="background: #e74c3c; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer;"
        >
          Shop Now
        </button>
        <button
          n-close
          style="background: transparent; border: 1px solid #ccc; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer; margin-left: 0.5rem;"
        >
          Maybe Later
        </button>
      </div>
      <div
        slot="ribbon"
        style="background: #f39c12; color: white; padding: 0.75rem 1rem; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);"
      >
        <strong>⏰ Only 2 hours left!</strong>
        <button
          n-close
          style="background: transparent; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: 0.5rem;"
        >
          ×
        </button>
      </div>
    </nosto-popup>
  `
}
