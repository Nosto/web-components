import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { updateShopifyRoot } from "../../utils/storybook"

const root = "https://nosto-shopify1.myshopify.com/"

window.Shopify = {
  routes: {
    root
  }
}

// Mock Nosto recommendations for storybook
function mockSectionCampaignRecs(_placement: string) {
  const mockData = {
    products: [
      {
        product_id: "1",
        name: "Awesome Product 1",
        handle: "good-ol-shoes",
        url: `${root}products/good-ol-shoes`,
        price: 99.99,
        image_url: "https://picsum.photos/400/400?random=1"
      },
      {
        product_id: "2",
        name: "Great Product 2",
        handle: "awesome-sneakers",
        url: `${root}products/awesome-sneakers`,
        price: 149.99,
        image_url: "https://picsum.photos/400/400?random=2"
      }
    ],
    title: "Recommended for You"
  }

  const mockBuilder = {
    disableCampaignInjection: () => mockBuilder,
    setElements: () => mockBuilder,
    setResponseMode: () => mockBuilder,
    setProducts: () => mockBuilder,
    load: async () => mockData
  }

  mockNostojs({
    // @ts-expect-error type mismatch for mocking purposes
    createRecommendationRequest: () => mockBuilder,
    attributeProductClicksInCampaign: () => {},
    placements: {
      injectCampaigns: () => Promise.resolve({ filledElements: [], unFilledElements: [] })
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
  title: "Components/SectionCampaign",
  component: "nosto-section-campaign",
  decorators: [
    withStoryContainer,
    (story, context) => {
      // Update Shopify root if provided via args
      if (context.args?.root) {
        updateShopifyRoot(context.args.root)
      }
      return story()
    }
  ],
  parameters: {
    docs: {
      description: {
        component:
          "A custom element that fetches Nosto placement results and renders them using Shopify section templates. This component integrates with Shopify's Section Rendering API to dynamically render campaign content."
      }
    }
  },
  argTypes: {
    root: {
      control: "text",
      description: "The Shopify store root URL"
    },
    placement: {
      control: "text",
      description: "The placement identifier for the campaign"
    },
    section: {
      control: "text",
      description: "The section to be used for Section Rendering API based rendering"
    }
  },
  args: {
    root,
    placement: "front-page",
    section: "product-recommendations"
  },
  tags: ["autodocs"]
}

export default meta
type Story = StoryObj

export const FrontPageRecommendations: Story = {
  render: args => {
    // Mock recommendations for the front page placement
    mockSectionCampaignRecs(args.placement)

    return html`
      <nosto-section-campaign placement="${args.placement}" section="${args.section}"></nosto-section-campaign>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Basic usage displaying product recommendations on the front page using a Shopify section template."
      }
    }
  }
}

export const ProductPageCrossSell: Story = {
  args: {
    placement: "product-page-cross-sell",
    section: "related-products-section"
  },
  render: args => {
    // Mock cross-sell recommendations
    mockSectionCampaignRecs(args.placement)

    return html`
      <nosto-section-campaign placement="${args.placement}" section="${args.section}"></nosto-section-campaign>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Cross-sell recommendations on product pages using a related products section template."
      }
    }
  }
}

export const CategoryPageRecommendations: Story = {
  args: {
    placement: "category-page",
    section: "category-recommendations"
  },
  render: args => {
    // Mock category page recommendations
    mockSectionCampaignRecs(args.placement)

    return html`
      <nosto-section-campaign placement="${args.placement}" section="${args.section}"></nosto-section-campaign>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Category-specific recommendations using a custom category section template."
      }
    }
  }
}

export const CartPageUpSell: Story = {
  args: {
    placement: "cart-page-upsell",
    section: "cart-upsell-section"
  },
  render: args => {
    // Mock cart upsell recommendations
    mockSectionCampaignRecs(args.placement)

    return html`
      <nosto-section-campaign placement="${args.placement}" section="${args.section}"></nosto-section-campaign>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Upsell recommendations on the cart page to increase order value."
      }
    }
  }
}

export const CustomPlacement: Story = {
  args: {
    placement: "custom-placement-id",
    section: "custom-recommendation-section"
  },
  render: args => {
    // Mock custom placement recommendations
    mockSectionCampaignRecs(args.placement)

    return html`
      <nosto-section-campaign placement="${args.placement}" section="${args.section}"></nosto-section-campaign>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Example of a custom placement with a custom section template for specialized use cases."
      }
    }
  }
}
