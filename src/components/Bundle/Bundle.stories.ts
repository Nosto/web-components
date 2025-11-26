import { html } from "lit"
import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { mockNostojs } from "@nosto/nosto-js/testing"
import type { RequestBuilder } from "@nosto/nosto-js/client"
import { updateShopifyShop } from "@/storybook/loader"
import "./Bundle.stories.css"

const shopifyShop = "nosto-shopify1.myshopify.com"
updateShopifyShop(shopifyShop)

const meta: Meta = {
  title: "Components/Bundle",
  component: "nosto-bundle",
  tags: ["autodocs"],
  decorators: [
    (story, context) => {
      // Update Shopify root if provided via args
      if (context.args?.root) {
        updateShopifyShop(context.args.root)
      }
      return story()
    }
  ],
  argTypes: {
    root: {
      control: "text",
      description: "The Shopify store root URL"
    }
  }
}

// Mock data for the bundle campaign
const bundleMockData = {
  "frontpage-nosto-bundle": {
    title: "Complete the Look",
    products: [
      { id: 1, handle: "awesome-sneakers", title: "Awesome Sneakers 1x", price: 120.0, price_currency_code: "USD" },
      { id: 2, handle: "good-ol-shoes", title: "Good Ol Shoes", price: 110.0, price_currency_code: "USD" },
      { id: 3, handle: "insane-shoes", title: "Insane Shoes", price: 120.0, price_currency_code: "USD" },
      { id: 4, handle: "old-school-kicks", title: "Old School Kicks", price: 110.0, price_currency_code: "USD" }
    ]
  }
}

// Set up the NostoJS mock to return our data
const mockBuilder = {
  disableCampaignInjection: () => mockBuilder,
  setElements: () => mockBuilder,
  setResponseMode: () => mockBuilder,
  setProducts: () => mockBuilder,
  load: async () => ({ recommendations: bundleMockData })
}
mockNostojs({
  placements: {
    injectCampaigns(results: Record<string, { html: string }>, targets: Record<string, HTMLElement>) {
      Object.entries(results).forEach(([placementId, content]) => {
        if (targets[placementId] && content.html) {
          targets[placementId].innerHTML = content.html
        }
      })
      return { filledElements: Object.keys(results), unFilledElements: [] }
    }
  },
  createRecommendationRequest: () => mockBuilder as unknown as RequestBuilder,
  attributeProductClicksInCampaign: () => {}
})

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => {
    return html`
      <nosto-campaign placement="frontpage-nosto-bundle">
        <template>
          <nosto-bundle .products="products">
            <div class="bundle-grid">
              <nosto-simple-card v-for="product in products" :handle="product.handle"> </nosto-simple-card>
            </div>
            <div class="bundle-controls">
              <h4>{{ title }}</h4>
              <ul>
                <li v-for="product in products">
                  <input type="checkbox" :value="product.handle" checked />
                  <label :for="'bundle-' + product.handle">Include {{ product.title }}</label>
                </li>
              </ul>
              <button n-atc>Add Bundle to Cart</button>
              <span n-summary-price></span>
            </div>
          </nosto-bundle>
        </template>
      </nosto-campaign>
    `
  }
}

export const CheckboxCard: Story = {
  render: () => {
    return html`
      <nosto-campaign placement="frontpage-nosto-bundle">
        <template>
          <nosto-bundle .products="products">
            <div class="bundle-grid">
              <nosto-simple-card v-for="product in products" :handle="product.handle">
                <input type="checkbox" :value="product.handle" checked />
              </nosto-simple-card>
            </div>
            <div class="bundle-summary">
              <button n-atc>Add Bundle to Cart</button>
              <span n-summary-price></span>
            </div>
          </nosto-bundle>
        </template>
      </nosto-campaign>
    `
  }
}
