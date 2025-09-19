import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import "./SimpleCard"
import "./SimpleCard.stories.css"

const meta: Meta = {
  title: "Components/SimpleCard",
  component: "nosto-simple-card",
  parameters: {
    docs: {
      description: {
        component: `
# SimpleCard

A simple custom element that renders a product card by fetching Shopify product data based on the provided handle.

## Features

- Fetches product data from Shopify's \`/products/{handle}.js\` endpoint
- Renders product information in light DOM following Shopify Dawn card structure
- Configurable display options via boolean attributes
- Supports hover effects with alternate product images
- Handles error states gracefully

## Attributes

- \`handle\` (required): The Shopify product handle to fetch data for
- \`alternate\`: Show alternate product image on hover (default: false)
- \`brand\`: Show brand/vendor information (default: false)
- \`discount\`: Show discount badges and compare-at pricing (default: false)
- \`rating\`: Show rating information (default: false)

**Note:** In Storybook, the Shopify API calls are mocked to show realistic product data.
        `
      }
    }
  },
  argTypes: {
    handle: {
      control: "text",
      description: "The Shopify product handle to fetch data for"
    },
    alternate: {
      control: "boolean",
      description: "Show alternate product image on hover"
    },
    brand: {
      control: "boolean",
      description: "Show brand/vendor information"
    },
    discount: {
      control: "boolean",
      description: "Show discount badges and compare-at pricing"
    },
    rating: {
      control: "boolean",
      description: "Show rating information"
    }
  }
}

export default meta
type Story = StoryObj

// Mock Shopify API response for Storybook
const mockShopifyResponse = {
  id: 1234567890,
  title: "Premium Cotton T-Shirt",
  handle: "premium-cotton-tshirt",
  description: "A high-quality cotton t-shirt perfect for everyday wear.",
  vendor: "Nosto Brand",
  price: 2999, // $29.99 in cents
  compare_at_price: 3999, // $39.99 in cents
  available: true,
  featured_image: "https://picsum.photos/400/500?random=1",
  images: [
    "https://picsum.photos/400/500?random=1",
    "https://picsum.photos/400/500?random=2"
  ],
  url: "/products/premium-cotton-tshirt",
  variants: [{
    id: 987654321,
    title: "Default Title",
    price: 2999,
    available: true
  }],
  options: [],
  media: [{
    alt: "Premium Cotton T-Shirt",
    src: "https://picsum.photos/400/500?random=1"
  }]
}

// Set up MSW-like mocking for Storybook
if (typeof window !== "undefined") {
  const originalFetch = window.fetch
  window.fetch = async (url, options) => {
    const urlStr = typeof url === "string" ? url : url.toString()
    
    // Mock the Shopify product.js endpoint
    if (urlStr.includes("/products/") && urlStr.endsWith(".js")) {
      return new Response(JSON.stringify(mockShopifyResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    // Fall back to original fetch for other requests
    return originalFetch(url, options)
  }
}

export const Default: Story = {
  args: {
    handle: "premium-cotton-tshirt"
  },
  render: (args) => html`
    <nosto-simple-card
      handle=${args.handle}
      ?alternate=${args.alternate}
      ?brand=${args.brand}
      ?discount=${args.discount}
      ?rating=${args.rating}
    ></nosto-simple-card>
  `
}

export const WithBrand: Story = {
  args: {
    handle: "premium-cotton-tshirt",
    brand: true
  },
  render: (args) => html`
    <nosto-simple-card
      handle=${args.handle}
      ?alternate=${args.alternate}
      ?brand=${args.brand}
      ?discount=${args.discount}
      ?rating=${args.rating}
    ></nosto-simple-card>
  `
}

export const WithDiscount: Story = {
  args: {
    handle: "premium-cotton-tshirt",
    discount: true
  },
  render: (args) => html`
    <nosto-simple-card
      handle=${args.handle}
      ?alternate=${args.alternate}
      ?brand=${args.brand}
      ?discount=${args.discount}
      ?rating=${args.rating}
    ></nosto-simple-card>
  `
}

export const WithAlternateImage: Story = {
  args: {
    handle: "premium-cotton-tshirt",
    alternate: true
  },
  render: (args) => html`
    <nosto-simple-card
      handle=${args.handle}
      ?alternate=${args.alternate}
      ?brand=${args.brand}
      ?discount=${args.discount}
      ?rating=${args.rating}
    ></nosto-simple-card>
  `
}

export const WithRating: Story = {
  args: {
    handle: "premium-cotton-tshirt",
    rating: true
  },
  render: (args) => html`
    <nosto-simple-card
      handle=${args.handle}
      ?alternate=${args.alternate}
      ?brand=${args.brand}
      ?discount=${args.discount}
      ?rating=${args.rating}
    ></nosto-simple-card>
  `
}

export const AllFeatures: Story = {
  args: {
    handle: "premium-cotton-tshirt",
    alternate: true,
    brand: true,
    discount: true,
    rating: true
  },
  render: (args) => html`
    <nosto-simple-card
      handle=${args.handle}
      ?alternate=${args.alternate}
      ?brand=${args.brand}
      ?discount=${args.discount}
      ?rating=${args.rating}
    ></nosto-simple-card>
  `
}

export const ErrorState: Story = {
  args: {
    handle: "non-existent-product"
  },
  render: (args) => html`
    <nosto-simple-card handle=${args.handle}></nosto-simple-card>
  `,
  parameters: {
    docs: {
      description: {
        story: "Shows the error state when a product cannot be found."
      }
    }
  }
}

export const Multiple: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; padding: 1rem;">
      <nosto-simple-card handle="premium-cotton-tshirt"></nosto-simple-card>
      <nosto-simple-card handle="premium-cotton-tshirt" brand></nosto-simple-card>
      <nosto-simple-card handle="premium-cotton-tshirt" discount></nosto-simple-card>
      <nosto-simple-card handle="premium-cotton-tshirt" alternate brand discount rating></nosto-simple-card>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: "Multiple SimpleCard instances showing different configurations."
      }
    }
  }
}