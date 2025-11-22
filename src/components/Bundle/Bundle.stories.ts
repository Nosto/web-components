import { html } from "lit"
import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { mockNostojs } from "@nosto/nosto-js/testing"
import type { RequestBuilder } from "@nosto/nosto-js/client"
import { updateShopifyRoot } from "@/storybook"
import "./Bundle.stories.css"

const root = "https://nosto-shopify1.myshopify.com/"

window.Shopify = {
  routes: {
    root
  }
}

const meta: Meta = {
  title: "Components/Bundle",
  component: "nosto-bundle",
  tags: ["autodocs"],
  decorators: [
    (story, context) => {
      // Update Shopify root if provided via args
      console.log("Bundle story decorator", context.args)
      if (context.args?.root) {
        updateShopifyRoot(context.args.root)
      }
      return story()
    }
  ],
  argTypes: {
    root: {
      control: "text",
      description: "The Shopify store root URL"
    }
  },
  args: {
    root
  }
}

// Mock data for the bundle campaign
const bundleMockData = {
  "frontpage-nosto-bundle": {
    title: "Complete the Look",
    products: [
      { id: "awesome-sneakers", title: "Awesome Sneakers 1x", price: "$120.00" },
      { id: "good-ol-shoes", title: "Good Ol Shoes", price: "$110.00" },
      { id: "insane-shoes", title: "Insane Shoes", price: "$120.00" },
      { id: "old-school-kicks", title: "Old School Kicks", price: "$110.00" },
      { id: "copy-of-awesome-sneakers-1", title: "Copy of Awesome Sneakers", price: "$120.00" }
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
              <nosto-simple-card v-for="product in products" :key="product.id" :handle="product.id">
              </nosto-simple-card>
            </div>
            <div class="bundle-controls">
              <h4>{{ title }}</h4>
              <ul>
                <li v-for="product in products" :key="product.id">
                  <input
                    type="checkbox"
                    :id="'bundle-' + product.id"
                    :name="'bundle-' + product.id"
                    :value="product.id"
                    checked
                  />
                  <label :for="'bundle-' + product.id">Include {{ product.title }}</label>
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
