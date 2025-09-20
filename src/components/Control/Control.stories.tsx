import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import { mockNostojs } from "@nosto/nosto-js/testing"

const meta: Meta = {
  title: "Components/Control",
  component: "nosto-control",
  parameters: {
    docs: {
      description: {
        component:
          "Custom element that replaces its children with the content of the first template that matches any of the current user's Nosto segments."
      }
    }
  }
}

export default meta
type Story = StoryObj

export const WithMatchingSegment: Story = {
  render: () => {
    // Mock Nosto API to return segments that match our template
    mockNostojs({
      internal: {
        getSegments: () => Promise.resolve(["premium", "new-customer"])
      }
    })

    return html`
      <div class="story-container">
        <h3>Control with Matching Segment</h3>
        <p>This control has segments ["premium", "new-customer"] and will show the premium template content:</p>
        <nosto-control>
          <template segment="premium">
            <div style="padding: 20px; background: gold; border-radius: 8px;">
              <h4>🌟 Premium Content</h4>
              <p>You're seeing this because you're in the "premium" segment!</p>
              <button style="padding: 8px 16px; background: #333; color: white; border: none; border-radius: 4px;">
                Exclusive Offer
              </button>
            </div>
          </template>
          <template segment="regular">
            <div style="padding: 20px; background: lightblue; border-radius: 8px;">
              <h4>Regular Content</h4>
              <p>Standard user content.</p>
            </div>
          </template>
          <template segment="new-customer">
            <div style="padding: 20px; background: lightgreen; border-radius: 8px;">
              <h4>Welcome New Customer!</h4>
              <p>Special welcome content for new customers.</p>
            </div>
          </template>
        </nosto-control>
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "Control component that shows the first matching template. In this case, the user has 'premium' and 'new-customer' segments, so the premium template is displayed (first match wins)."
      }
    }
  }
}

export const WithNoMatchingSegment: Story = {
  render: () => {
    // Mock Nosto API to return segments that don't match any template
    mockNostojs({
      internal: {
        getSegments: () => Promise.resolve(["unknown-segment"])
      }
    })

    return html`
      <div class="story-container">
        <h3>Control with No Matching Segment</h3>
        <p>
          This control has segment ["unknown-segment"] which doesn't match any template, so original content remains:
        </p>
        <nosto-control>
          <p style="padding: 20px; background: #f5f5f5; border-radius: 8px; color: #666;">
            Default content that remains when no segment matches
          </p>
          <template segment="premium">
            <div style="padding: 20px; background: gold; border-radius: 8px;">
              <h4>🌟 Premium Content</h4>
              <p>This won't be shown because user is not in premium segment.</p>
            </div>
          </template>
          <template segment="regular">
            <div style="padding: 20px; background: lightblue; border-radius: 8px;">
              <h4>Regular Content</h4>
              <p>This won't be shown because user is not in regular segment.</p>
            </div>
          </template>
        </nosto-control>
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "Control component when no segments match. The original content inside the control element remains unchanged."
      }
    }
  }
}

export const WithEmptySegments: Story = {
  render: () => {
    // Mock Nosto API to return empty segments array
    mockNostojs({
      internal: {
        getSegments: () => Promise.resolve([])
      }
    })

    return html`
      <div class="story-container">
        <h3>Control with Empty Segments</h3>
        <p>This control has no segments, so original content remains:</p>
        <nosto-control>
          <div style="padding: 20px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px;">
            <h4>⚠️ Default Content</h4>
            <p>This content shows when the user has no segments assigned.</p>
          </div>
          <template segment="premium">
            <div style="padding: 20px; background: gold; border-radius: 8px;">
              <h4>Premium Content</h4>
              <p>Hidden because no segments match.</p>
            </div>
          </template>
          <template segment="regular">
            <div style="padding: 20px; background: lightblue; border-radius: 8px;">
              <h4>Regular Content</h4>
              <p>Hidden because no segments match.</p>
            </div>
          </template>
        </nosto-control>
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "Control component when user has no segments. The original content remains unchanged since no templates match."
      }
    }
  }
}

export const MultipleMatchingSegments: Story = {
  render: () => {
    // Mock Nosto API to return multiple segments where multiple templates could match
    mockNostojs({
      internal: {
        getSegments: () => Promise.resolve(["regular", "premium", "vip"])
      }
    })

    return html`
      <div class="story-container">
        <h3>Control with Multiple Matching Segments</h3>
        <p>User has segments ["regular", "premium", "vip"]. First matching template (regular) wins:</p>
        <nosto-control>
          <template segment="regular">
            <div style="padding: 20px; background: lightblue; border-radius: 8px;">
              <h4>📝 Regular Content</h4>
              <p>You're seeing this because "regular" is the first matching segment in the template order!</p>
            </div>
          </template>
          <template segment="premium">
            <div style="padding: 20px; background: gold; border-radius: 8px;">
              <h4>🌟 Premium Content</h4>
              <p>This won't show even though user is premium, because regular template comes first.</p>
            </div>
          </template>
          <template segment="vip">
            <div style="padding: 20px; background: purple; color: white; border-radius: 8px;">
              <h4>💎 VIP Content</h4>
              <p>This won't show because regular template comes first.</p>
            </div>
          </template>
        </nosto-control>
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "Control component when user has multiple matching segments. The first template in DOM order that matches any user segment is used."
      }
    }
  }
}
