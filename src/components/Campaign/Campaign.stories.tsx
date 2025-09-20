import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import { mockNostoRecs } from "../../../test/mockNostoRecs"
import "./Campaign.stories.css"

// Helper function for creating demo section
function createDemoSection(title: string, description: string, content: unknown) {
  return html`
    <div class="story-container">
      <div class="demo-section">
        <div class="demo-title">${title}</div>
        <div class="demo-description">${description}</div>
        ${content}
      </div>
    </div>
  `
}

const meta: Meta = {
  title: "Components/Campaign",
  component: "nosto-campaign",
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
    }
  }
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

    return createDemoSection(
      "Basic Campaign",
      "Simple campaign that displays HTML content from Nosto API.",
      html`
        <nosto-campaign placement="homepage-hero" product-id="demo-product">
          <template>{{ html }}</template>
        </nosto-campaign>
      `
    )
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

    return createDemoSection(
      "Product Recommendations",
      "Campaign that displays personalized product recommendations using Vue-like templating.",
      html`
        <nosto-campaign 
          placement="product-recommendations" 
          product-id="current-product">
          <template>
            <div class="recommendations-section">
              <h3>{{ title }}</h3>
              <div class="products-grid">
                <div class="product-card" v-for="product in products">
                  <img :src="'https://picsum.photos/200/200?random=' + product.id" :alt="product.title" class="product-image" />
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
    )
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

    return createDemoSection(
      "Lazy Loaded Campaign",
      "Campaign that only loads content when it comes into the viewport. Scroll down to see it load!",
      html`
        <div class="spacer">
          <p>👆 Scroll up and down to see the lazy loading in action</p>
        </div>
        <nosto-campaign placement="lazy-campaign" product-id="demo-product" lazy>
        </nosto-campaign>
        <div class="spacer">
          <p>👇 The campaign above should load when scrolled into view</p>
        </div>
      `
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Campaign component with lazy loading enabled. Content is only fetched when the element enters the viewport."
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

    return createDemoSection(
      "Manual Initialization",
      'Campaign with init="false" that requires manual loading. Click the button to load the campaign.',
      html`
        <div class="manual-controls">
          <button 
            class="load-button"
            onclick="document.querySelector('nosto-campaign[placement=manual-campaign]').load()">
            Load Campaign
          </button>
        </div>
        <nosto-campaign placement="manual-campaign" product-id="demo-product" init="false">
        </nosto-campaign>
      `
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Campaign component with manual initialization (init="false"). The load() method must be called programmatically.'
      }
    }
  }
}