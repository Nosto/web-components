import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import "./Campaign.stories.css"
import { mockNostojs } from "@nosto/nosto-js/testing"
import type { RequestBuilder } from "@nosto/nosto-js/client"

function mockNostoRecs(recommendations: Record<string, unknown>) {
  const mockBuilder = {
    disableCampaignInjection: () => mockBuilder,
    setElements: () => mockBuilder,
    setResponseMode: () => mockBuilder,
    setProducts: () => mockBuilder,
    load: async () => ({ recommendations })
  }
  mockNostojs({
    placements: {
      injectCampaigns() {
        Object.entries(recommendations).forEach(([placementId, content]) => {
          const element = document.querySelector(`nosto-campaign[placement="${placementId}"]`)
          if (element) {
            // @ts-expect-error type mismatch
            element.innerHTML = "html" in content ? content.html : content
          }
        })
        return { filledElements: Object.keys(recommendations), unFilledElements: [] }
      }
    },
    attributeProductClicksInCampaign: () => {},
    createRecommendationRequest: () => mockBuilder as unknown as RequestBuilder
  })
}

// Storybook decorator for wrapping stories with container styling
const withStoryContainer = (story: () => unknown) => html`
  <div class="story-container">
    <div class="demo-section">${story()}</div>
  </div>
`

const meta: Meta = {
  title: "Components/Campaign",
  component: "nosto-campaign",
  decorators: [withStoryContainer],
  parameters: {
    docs: {
      description: {
        component:
          "A custom element that renders a Nosto campaign based on the provided placement and fetched campaign data. This component fetches campaign data from Nosto and injects it into the DOM."
      }
    }
  },
  argTypes: {
    placement: {
      control: "text",
      description: "Required. The placement identifier for the campaign."
    },
    productId: {
      control: "text",
      description: "The ID of the product to associate with the campaign."
    },
    variantId: {
      control: "text",
      description: "The variant ID of the product."
    },
    template: {
      control: "text",
      description: "The ID of the template to use for rendering the campaign."
    },
    lazy: {
      control: "boolean",
      description: "If true, the component will only load the campaign when it comes into view."
    },
    cartSynced: {
      control: "boolean",
      description: "If true, the component will listen for cart updates and reload the campaign automatically."
    }
  },
  tags: ["autodocs"]
}

export default meta
type Story = StoryObj

export const BasicCampaign: Story = {
  render: () => {
    // Mock campaign data with HTML content
    mockNostoRecs({
      "homepage-hero": {
        html: `
          <div class="campaign-content">
            <h2>Special Offer!</h2>
            <p>Get 20% off selected items</p>
            <button class="cta-button">Shop Now</button>
          </div>
        `
      }
    })

    return html` <nosto-campaign placement="homepage-hero" product-id="demo-product"> </nosto-campaign> `
  },
  parameters: {
    docs: {
      description: {
        story: "Basic campaign component that renders HTML content from the Nosto API."
      }
    }
  }
}

export const ProductRecommendations: Story = {
  render: () => {
    // Mock campaign data with product recommendations
    mockNostoRecs({
      "product-recommendations": {
        title: "Recommended for You",
        products: [
          { id: "prod-1", title: "Wireless Headphones", price: "$129.99" },
          { id: "prod-2", title: "Smart Watch", price: "$299.99" },
          { id: "prod-3", title: "Laptop Stand", price: "$79.99" },
          { id: "prod-4", title: "Phone Case", price: "$24.99" }
        ]
      }
    })

    return html`
      <nosto-campaign placement="product-recommendations" product-id="current-product">
        <template>
          <div class="recommendations-section">
            <h3>{{ title }}</h3>
            <div class="products-grid">
              <div class="product-card" v-for="product in products">
                <img
                  :src="'https://picsum.photos/200/200?random=' + product.id"
                  :alt="product.title"
                  class="product-image"
                />
                <div class="product-info">
                  <h4 class="product-title">{{ product.title }}</h4>
                  <div class="product-price">{{ product.price || '$99.99' }}</div>
                  <button class="add-to-cart">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </nosto-campaign>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Campaign component with product recommendations using inline Vue-like template."
      }
    }
  }
}

export const LazyLoadedCampaign: Story = {
  render: () => {
    // Mock campaign data
    mockNostoRecs({
      "lazy-campaign": {
        html: `
          <div class="lazy-campaign-content">
            <h3>🚀 Lazy Loaded Content</h3>
            <p>This campaign was loaded when it came into view!</p>
            <div class="campaign-stats">
              <span class="stat">📈 +25% CTR</span>
              <span class="stat">⚡ Optimized Loading</span>
            </div>
          </div>
        `
      }
    })

    return html`
      <div class="spacer">
        <p>👆 Scroll up and down to see the lazy loading in action</p>
      </div>
      <nosto-campaign placement="lazy-campaign" product-id="demo-product" lazy> </nosto-campaign>
      <div class="spacer">
        <p>👇 The campaign above should load when scrolled into view</p>
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "Campaign component with lazy loading enabled. Content is only fetched when the element enters the viewport."
      }
    }
  }
}

export const ManualInitialization: Story = {
  render: () => {
    // Mock campaign data
    mockNostoRecs({
      "manual-campaign": {
        html: `
          <div class="manual-campaign-content">
            <h3>✋ Manually Initialized</h3>
            <p>This campaign was loaded programmatically</p>
            <small>Use init="false" to prevent auto-loading</small>
          </div>
        `
      }
    })

    return html`
      <div class="manual-controls">
        <button
          class="load-button"
          onclick="document.querySelector('nosto-campaign[placement=manual-campaign]').load()"
        >
          Load Campaign
        </button>
      </div>
      <nosto-campaign placement="manual-campaign" product-id="demo-product" init="false"> </nosto-campaign>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          'Campaign component with manual initialization (init="false"). The load() method must be called programmatically.'
      }
    }
  }
}

export const CartSyncedCampaign: Story = {
  render: () => {
    // Mock campaign data that would typically change based on cart contents
    mockNostoRecs({
      "cart-recommendations": {
        html: `
          <div class="cart-synced-campaign">
            <h3>🛒 Cart-Synchronized Recommendations</h3>
            <p>This campaign reloads automatically when cart is updated</p>
            <div class="campaign-products">
              <div class="product-item">
                <span>📦 Complementary Product A</span>
              </div>
              <div class="product-item">
                <span>📦 Complementary Product B</span>
              </div>
            </div>
            <small>cart-synced attribute enabled</small>
          </div>
        `
      }
    })

    return html`
      <div class="demo-section">
        <p class="demo-description">
          This campaign listens for cart updates and automatically reloads when the cart changes. In a real
          implementation, the campaign content would update based on current cart contents.
        </p>
        <nosto-campaign placement="cart-recommendations" cart-synced> </nosto-campaign>

        <div class="cart-demo-controls">
          <p><strong>Simulate cart changes:</strong></p>
          <button
            class="demo-button"
            onclick="
              const api = window.nostojs ? window.nostojs : (() => console.log('Nosto API not available in demo'));
              api(client => {
                if (client.listen) {
                  // Simulate a cartUpdated event
                  client.listen && console.log('Cart update would trigger campaign reload');
                } else {
                  console.log('Cart sync feature requires nostojs with cartUpdated event support');
                }
              });
            "
          >
            Add Item to Cart (Demo)
          </button>
          <button
            class="demo-button"
            onclick="
              const campaign = document.querySelector('nosto-campaign[cart-synced]');
              if (campaign && campaign.load) {
                campaign.load();
                console.log('Campaign manually reloaded');
              }
            "
          >
            Manual Reload
          </button>
        </div>
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "Campaign component with cart synchronization enabled. When cart-synced attribute is present, the campaign automatically reloads when the cart is updated via nostojs cartUpdated event."
      }
    }
  }
}
