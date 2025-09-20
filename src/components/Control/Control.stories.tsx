import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import { mockNostojs } from "@nosto/nosto-js/testing"
import "./Control.stories.css"

// Storybook decorator for wrapping stories with container styling
const withStoryContainer = (story: () => unknown) => html`
  <div class="story-container">
    <div class="demo-section">
      ${story()}
    </div>
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
          "This component replaces its children with the content of the first template that matches any of the current user's Nosto segments. It enables dynamic content based on user segmentation."
      }
    }
  }
}

export default meta
type Story = StoryObj

export const BasicSegmentation: Story = {
  render: () => {
    // Mock user segments - user belongs to "premium" segment
    mockNostojs({
      internal: {
        getSegments: () => Promise.resolve(["premium", "returning-customer"])
      }
    })

    return createDemoSection(
      "Basic Segmentation",
      "Shows different content based on user segments. This user is in 'premium' and 'returning-customer' segments.",
      html`
        <nosto-control>
          <template segment="new-visitor">
            <div class="segment-content new-visitor">
              <h3>👋 Welcome, New Visitor!</h3>
              <p>Sign up today and get 10% off your first order</p>
              <button class="signup-button">Sign Up Now</button>
            </div>
          </template>
          <template segment="premium">
            <div class="segment-content premium">
              <h3>✨ Premium Member Benefits</h3>
              <p>Enjoy exclusive deals and free shipping on all orders</p>
              <div class="benefits-list">
                <span class="benefit">🚚 Free Shipping</span>
                <span class="benefit">🎁 Exclusive Deals</span>
                <span class="benefit">⚡ Priority Support</span>
              </div>
            </div>
          </template>
          <template segment="returning-customer">
            <div class="segment-content returning">
              <h3>🎉 Welcome Back!</h3>
              <p>We've saved your favorites just for you</p>
              <button class="favorites-button">View Favorites</button>
            </div>
          </template>
        </nosto-control>
      `
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Basic segmentation showing different content for different user segments. The 'premium' template will be shown first since it matches the user's segments."
      }
    }
  }
}

export const NewVisitorExperience: Story = {
  render: () => {
    // Mock user segments - new visitor
    mockNostojs({
      internal: {
        getSegments: () => Promise.resolve(["new-visitor"])
      }
    })

    return createDemoSection(
      "New Visitor Experience",
      "Special onboarding experience for first-time visitors.",
      html`
        <nosto-control>
          <template segment="new-visitor">
            <div class="segment-content onboarding">
              <div class="onboarding-header">
                <h3>🎉 Welcome to Our Store!</h3>
                <p>Discover amazing products tailored just for you</p>
              </div>
              <div class="onboarding-steps">
                <div class="step">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <h4>Browse Categories</h4>
                    <p>Explore our curated collections</p>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <h4>Add to Wishlist</h4>
                    <p>Save items for later</p>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <h4>Get Recommendations</h4>
                    <p>Personalized just for you</p>
                  </div>
                </div>
              </div>
              <button class="start-shopping-button">Start Shopping</button>
            </div>
          </template>
          <template segment="returning-customer">
            <div class="segment-content returning">
              <h3>Welcome back!</h3>
              <p>Continue where you left off</p>
            </div>
          </template>
          <template segment="premium">
            <div class="segment-content premium">
              <h3>Premium Dashboard</h3>
              <p>Your exclusive member area</p>
            </div>
          </template>
        </nosto-control>
      `
    )
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
    mockNostojs({
      internal: {
        getSegments: () => Promise.resolve(["anonymous", "mobile-user"])
      }
    })

    return createDemoSection(
      "No Matching Segment",
      "When no template matches the user's segments, the original content remains unchanged.",
      html`
        <nosto-control>
          <div class="default-content">
            <h3>🌐 Default Content</h3>
            <p>This content shows when no segment templates match the user.</p>
            <p>User segments: anonymous, mobile-user</p>
            <div class="segment-info">
              <small>Available segment templates: premium, new-visitor, vip-customer</small>
            </div>
          </div>
          <template segment="premium">
            <div class="segment-content premium">
              <h3>Premium Member</h3>
              <p>Exclusive premium content</p>
            </div>
          </template>
          <template segment="new-visitor">
            <div class="segment-content new-visitor">
              <h3>New Visitor</h3>
              <p>Welcome to our store!</p>
            </div>
          </template>
          <template segment="vip-customer">
            <div class="segment-content vip">
              <h3>VIP Customer</h3>
              <p>Ultra-exclusive VIP experience</p>
            </div>
          </template>
        </nosto-control>
      `
    )
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
    mockNostojs({
      internal: {
        getSegments: () => Promise.resolve(["vip-customer", "high-value", "premium"])
      }
    })

    return createDemoSection(
      "VIP Customer Experience",
      "Ultra-premium experience for VIP customers with multiple matching segments.",
      html`
        <nosto-control>
          <template segment="new-visitor">
            <div class="segment-content new-visitor">
              <h3>New Visitor Content</h3>
            </div>
          </template>
          <template segment="vip-customer">
            <div class="segment-content vip-experience">
              <div class="vip-header">
                <h3>💎 VIP Customer Portal</h3>
                <div class="vip-badge">VIP</div>
              </div>
              <div class="vip-perks">
                <div class="perk">
                  <div class="perk-icon">🎁</div>
                  <div class="perk-text">
                    <strong>Exclusive Gifts</strong>
                    <p>Complimentary items with every order</p>
                  </div>
                </div>
                <div class="perk">
                  <div class="perk-icon">🚁</div>
                  <div class="perk-text">
                    <strong>Premium Delivery</strong>
                    <p>Same-day delivery available</p>
                  </div>
                </div>
                <div class="perk">
                  <div class="perk-icon">💬</div>
                  <div class="perk-text">
                    <strong>Personal Shopper</strong>
                    <p>Dedicated customer service</p>
                  </div>
                </div>
              </div>
              <button class="vip-button">Access VIP Collection</button>
            </div>
          </template>
          <template segment="premium">
            <div class="segment-content premium">
              <h3>Premium Member Content</h3>
            </div>
          </template>
        </nosto-control>
      `
    )
  },
  parameters: {
    docs: {
      description: {
        story: "VIP customer experience showing the first matching template (vip-customer) even when multiple segments match."
      }
    }
  }
}