import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import type { JSONProduct, RequestBuilder } from "@nosto/nosto-js/client"
import { mockNostojs } from "@nosto/nosto-js/testing"
import "./Campaign.stories.css"

type MockResult = { products: Partial<JSONProduct>[] } | { html: string } | Record<string, unknown> | string

// Mock campaign data
const mockCampaignHtml = `
<div class="nosto-campaign-content">
  <div class="nosto-campaign-title">Recommended for You</div>
  <div class="nosto-campaign-products">
    <div class="nosto-campaign-product">
      <img src="https://picsum.photos/id/20/200/200" alt="Product 1" />
      <div class="nosto-campaign-product-name">Stylish Jacket</div>
      <div class="nosto-campaign-product-price">€89.99</div>
    </div>
    <div class="nosto-campaign-product">
      <img src="https://picsum.photos/id/21/200/200" alt="Product 2" />
      <div class="nosto-campaign-product-name">Casual Shoes</div>
      <div class="nosto-campaign-product-price">€65.50</div>
    </div>
    <div class="nosto-campaign-product">
      <img src="https://picsum.photos/id/22/200/200" alt="Product 3" />
      <div class="nosto-campaign-product-name">Designer Watch</div>
      <div class="nosto-campaign-product-price">€199.00</div>
    </div>
  </div>
</div>
`

const mockCampaignJson = {
  result_id: "storybook-demo-123",
  result_type: "campaign",
  products: [
    {
      product_id: "product-1",
      name: "Premium Headphones",
      url: "https://example.com/product-1",
      image_url: "https://picsum.photos/id/23/200/200",
      price: "€129.99",
      price_currency_code: "EUR"
    },
    {
      product_id: "product-2",
      name: "Smart Watch",
      url: "https://example.com/product-2",
      image_url: "https://picsum.photos/id/24/200/200",
      price: "€299.00",
      price_currency_code: "EUR"
    },
    {
      product_id: "product-3",
      name: "Wireless Speaker",
      url: "https://example.com/product-3",
      image_url: "https://picsum.photos/id/25/200/200",
      price: "€79.99",
      price_currency_code: "EUR"
    }
  ]
}

// Setup mock Nosto API for Storybook
function setupMockNosto(campaigns: Record<string, MockResult>) {
  const load = () => Promise.resolve({ recommendations: campaigns })

  const mockBuilder: Partial<RequestBuilder> = {
    disableCampaignInjection: () => mockBuilder as RequestBuilder,
    setElements: () => mockBuilder as RequestBuilder,
    setResponseMode: () => mockBuilder as RequestBuilder,
    setProducts: () => mockBuilder as RequestBuilder,
    load: load as any
  }

  const injectCampaigns = async (campaigns: Record<string, string>, targets: Record<string, HTMLElement>) => {
    const filledElements: string[] = []
    const unFilledElements: string[] = []

    Object.keys(campaigns).forEach(placementId => {
      const target = targets[placementId]
      if (target) {
        target.innerHTML = campaigns[placementId]
        filledElements.push(placementId)
      } else {
        unFilledElements.push(placementId)
      }
    })

    return { filledElements, unFilledElements }
  }

  const api = {
    createRecommendationRequest: () => mockBuilder as RequestBuilder,
    attributeProductClicksInCampaign: () => {},
    placements: {
      injectCampaigns
    }
  }

  mockNostojs(api as any)
}

const meta: Meta = {
  title: "Components/Campaign",
  component: "nosto-campaign",
  parameters: {
    docs: {
      description: {
        component:
          "Custom element that renders a Nosto campaign based on the provided placement and fetched campaign data. Supports both HTML and JSON response modes."
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
      description: "Optional. The ID of the product to associate with the campaign."
    },
    variantId: {
      control: "text",
      description: "Optional. The variant ID of the product."
    },
    template: {
      control: "text",
      description: "Optional. The ID of the template to use for rendering the campaign."
    },
    init: {
      control: "text",
      description:
        "Optional. If set to 'false', the component will not automatically load the campaign. Defaults to 'true'."
    },
    lazy: {
      control: "boolean",
      description:
        "Optional. If true, the component will only load the campaign when it comes into view. Defaults to false."
    }
  }
}

export default meta
type Story = StoryObj

export const HtmlCampaign: Story = {
  render: () => {
    // Setup mock with HTML response
    setupMockNosto({
      "frontpage-1": mockCampaignHtml,
      "frontpage-2": mockCampaignHtml.replace("Recommended for You", "Recently Viewed")
    })

    return html`
      <div class="story-container">
        <div class="campaign-demo-section">
          <div class="campaign-demo-title">HTML Campaign Rendering</div>
          <div class="campaign-demo-sub-title">Basic HTML Campaign</div>
          <div class="campaign-grid">
            <div class="campaign-item">
              <nosto-campaign placement="frontpage-1"></nosto-campaign>
            </div>
          </div>

          <div class="campaign-demo-sub-title">Campaign with Product Context</div>
          <div class="campaign-grid">
            <div class="campaign-item">
              <nosto-campaign placement="frontpage-2" product-id="demo-product"></nosto-campaign>
            </div>
          </div>
        </div>
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Campaign component rendering HTML content directly from the Nosto API."
      }
    }
  }
}

export const JsonCampaignWithTemplate: Story = {
  render: () => {
    // Setup mock with JSON response
    setupMockNosto({
      "category-1": mockCampaignJson,
      "pdp-recommendations": {
        ...mockCampaignJson,
        result_id: "pdp-demo-456"
      }
    })

    return html`
      <div class="story-container">
        <div class="campaign-demo-section">
          <div class="campaign-demo-title">JSON Campaign with Template</div>
          <div class="campaign-demo-sub-title">Custom Template Rendering</div>
          <div class="campaign-grid">
            <div class="campaign-item">
              <nosto-campaign placement="category-1">
                <template>
                  <div class="nosto-campaign-content">
                    <div class="nosto-campaign-title">{{title || "Featured Products"}}</div>
                    <div class="nosto-campaign-products">
                      <div v-for="product in products" class="nosto-campaign-product">
                        <img :src="product.image_url" :alt="product.name" />
                        <div class="nosto-campaign-product-name">{{product.name}}</div>
                        <div class="nosto-campaign-product-price">{{product.price}}</div>
                      </div>
                    </div>
                  </div>
                </template>
              </nosto-campaign>
            </div>
          </div>

          <div class="campaign-demo-sub-title">PDP Recommendations</div>
          <div class="campaign-grid">
            <div class="campaign-item">
              <nosto-campaign placement="pdp-recommendations" product-id="current-product" variant-id="variant-123">
                <template>
                  <div class="nosto-campaign-content">
                    <div class="nosto-campaign-title">You might also like</div>
                    <div class="nosto-campaign-products">
                      <div v-for="product in products" class="nosto-campaign-product">
                        <img :src="product.image_url" :alt="product.name" />
                        <div class="nosto-campaign-product-name">{{product.name}}</div>
                        <div class="nosto-campaign-product-price">{{product.price}}</div>
                      </div>
                    </div>
                  </div>
                </template>
              </nosto-campaign>
            </div>
          </div>
        </div>
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Campaign component using JSON data with custom Vue templates for rendering."
      }
    }
  }
}

export const LazyLoadingCampaign: Story = {
  render: () => {
    // Setup mock with delayed response
    setupMockNosto({
      "lazy-placement": mockCampaignHtml.replace("Recommended for You", "Lazy Loaded Content")
    })

    return html`
      <div class="story-container">
        <div class="campaign-demo-section">
          <div class="campaign-demo-title">Lazy Loading Campaign</div>
          <div class="campaign-demo-sub-title">Scroll down to trigger loading</div>

          <!-- Add some spacing to demonstrate lazy loading -->
          <div
            style="height: 100vh; display: flex; align-items: center; justify-content: center; background: #f0f0f0; margin: 20px 0; border-radius: 8px;"
          >
            <p>Scroll down to see the lazy-loaded campaign ↓</p>
          </div>

          <div class="campaign-grid">
            <div class="campaign-item">
              <nosto-campaign placement="lazy-placement" lazy></nosto-campaign>
            </div>
          </div>
        </div>
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Campaign component with lazy loading enabled. The campaign will only load when it comes into viewport."
      }
    }
  }
}

export const ManuallyTriggeredCampaign: Story = {
  render: () => {
    setupMockNosto({
      "manual-placement": mockCampaignHtml.replace("Recommended for You", "Manually Loaded Campaign")
    })

    // Add a function to manually trigger campaign loading
    setTimeout(() => {
      const button = document.querySelector("#load-campaign-btn") as HTMLButtonElement
      const campaign = document.querySelector("#manual-campaign") as HTMLElement & { load: () => void }

      if (button && campaign) {
        button.onclick = () => {
          campaign.load()
          button.disabled = true
          button.textContent = "Loading..."
        }
      }
    }, 100)

    return html`
      <div class="story-container">
        <div class="campaign-demo-section">
          <div class="campaign-demo-title">Manually Triggered Campaign</div>
          <div class="campaign-demo-sub-title">Campaign with init="false" and manual loading</div>

          <button
            id="load-campaign-btn"
            style="margin-bottom: 16px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >
            Load Campaign
          </button>

          <div class="campaign-grid">
            <div class="campaign-item">
              <nosto-campaign id="manual-campaign" placement="manual-placement" init="false"></nosto-campaign>
            </div>
          </div>
        </div>
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "Campaign component with automatic initialization disabled. The campaign is loaded manually when the button is clicked."
      }
    }
  }
}
