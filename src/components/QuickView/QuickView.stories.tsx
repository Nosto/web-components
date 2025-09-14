/** @jsx createElement */
import type { Meta, StoryObj } from "@storybook/web-components"
import { createElement } from "../../../test/utils/jsx"
import "./QuickView.stories.css"
// Import the component to ensure it's registered
import "./QuickView"

// Mock Shopify product data for Storybook
const mockProduct = {
  id: 123456789,
  title: "Sample T-Shirt",
  handle: "sample-t-shirt",
  description: "A comfortable cotton t-shirt perfect for everyday wear.",
  published_at: "2023-01-01T00:00:00Z",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
  vendor: "Nosto",
  type: "Clothing",
  tags: ["t-shirt", "cotton", "casual"],
  price: 2500,
  price_min: 2500,
  price_max: 3000,
  available: true,
  price_varies: true,
  compare_at_price: null,
  compare_at_price_min: null,
  compare_at_price_max: null,
  compare_at_price_varies: false,
  variants: [
    {
      id: 1,
      title: "Black / Small",
      option1: "Black",
      option2: "Small",
      option3: null,
      sku: "TSH-BLK-SM",
      requires_shipping: true,
      taxable: true,
      featured_image: {
        id: 1,
        product_id: 123456789,
        position: 1,
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
        alt: "Black t-shirt small",
        width: 800,
        height: 800,
        src: "https://picsum.photos/800/800?random=1",
        variant_ids: [1]
      },
      available: true,
      price: 2500,
      grams: 200,
      compare_at_price: null,
      position: 1,
      product_id: 123456789,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    },
    {
      id: 2,
      title: "Black / Medium",
      option1: "Black",
      option2: "Medium",
      option3: null,
      sku: "TSH-BLK-MD",
      requires_shipping: true,
      taxable: true,
      featured_image: {
        id: 2,
        product_id: 123456789,
        position: 2,
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
        alt: "Black t-shirt medium",
        width: 800,
        height: 800,
        src: "https://picsum.photos/800/800?random=2",
        variant_ids: [2]
      },
      available: true,
      price: 2500,
      grams: 200,
      compare_at_price: 3000,
      position: 2,
      product_id: 123456789,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    },
    {
      id: 3,
      title: "White / Small",
      option1: "White",
      option2: "Small",
      option3: null,
      sku: "TSH-WHT-SM",
      requires_shipping: true,
      taxable: true,
      featured_image: {
        id: 3,
        product_id: 123456789,
        position: 3,
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
        alt: "White t-shirt small",
        width: 800,
        height: 800,
        src: "https://picsum.photos/800/800?random=3",
        variant_ids: [3]
      },
      available: false,
      price: 2500,
      grams: 200,
      compare_at_price: null,
      position: 3,
      product_id: 123456789,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    },
    {
      id: 4,
      title: "White / Medium",
      option1: "White",
      option2: "Medium",
      option3: null,
      sku: "TSH-WHT-MD",
      requires_shipping: true,
      taxable: true,
      featured_image: {
        id: 4,
        product_id: 123456789,
        position: 4,
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
        alt: "White t-shirt medium",
        width: 800,
        height: 800,
        src: "https://picsum.photos/800/800?random=4",
        variant_ids: [4]
      },
      available: true,
      price: 3000,
      grams: 200,
      compare_at_price: null,
      position: 4,
      product_id: 123456789,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    }
  ],
  images: [
    {
      id: 1,
      product_id: 123456789,
      position: 1,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
      alt: "Black t-shirt",
      width: 800,
      height: 800,
      src: "https://picsum.photos/800/800?random=1",
      variant_ids: [1, 2]
    },
    {
      id: 2,
      product_id: 123456789,
      position: 2,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
      alt: "White t-shirt",
      width: 800,
      height: 800,
      src: "https://picsum.photos/800/800?random=2",
      variant_ids: [3, 4]
    }
  ],
  featured_image: "https://picsum.photos/800/800?random=1",
  options: [
    {
      id: 1,
      product_id: 123456789,
      name: "Color",
      position: 1,
      values: ["Black", "White"]
    },
    {
      id: 2,
      product_id: 123456789,
      name: "Size",
      position: 2,
      values: ["Small", "Medium"]
    }
  ],
  url: "/products/sample-t-shirt",
  media: []
}

// Mock fetch for Storybook
const originalFetch = window.fetch
function mockFetchForStorybook() {
  window.fetch = async (url: RequestInfo | URL) => {
    if (typeof url === "string" && url.includes("/products/sample-t-shirt.js")) {
      return {
        ok: true,
        json: () => Promise.resolve(mockProduct),
        text: () => Promise.resolve(JSON.stringify(mockProduct)),
        status: 200,
        statusText: "OK"
      } as Response
    }
    if (typeof url === "string" && url.includes("/cart/add.js")) {
      return {
        ok: true,
        json: () => Promise.resolve({ status: "success" }),
        text: () => Promise.resolve('{"status":"success"}'),
        status: 200,
        statusText: "OK"
      } as Response
    }
    return originalFetch(url)
  }
}

function restoreFetch() {
  window.fetch = originalFetch
}

const meta: Meta = {
  title: "Components/QuickView",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The QuickView component provides a modal dialog for product preview with swatches and add to cart functionality.

## Features

- **Product Fetching**: Automatically fetches product data from Shopify's product.js API
- **Modal Dialog**: Opens a responsive modal with product image and details
- **Swatch Selection**: Interactive swatches for product options (color, size, etc.)
- **Add to Cart**: Integrates with Shopify's cart.add.js API
- **Accessibility**: Full keyboard navigation and screen reader support
- **Focus Management**: Proper focus trapping and restoration

## Usage

The component requires only a \`handle\` attribute that corresponds to the Shopify product handle:

\`\`\`html
<nosto-quick-view handle="sample-product">
  <button>Quick View</button>
</nosto-quick-view>
\`\`\`

Clicking on any element inside the component will trigger the modal to open.
        `
      }
    }
  },
  argTypes: {
    handle: {
      control: "text",
      description: "Shopify product handle to fetch and display"
    }
  }
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: {
    handle: "sample-t-shirt"
  },
  render: args => {
    mockFetchForStorybook()
    setTimeout(restoreFetch, 5000) // Restore after 5 seconds

    return (
      <nosto-quick-view handle={args.handle}>
        <button className="quick-view-trigger">Quick View</button>
      </nosto-quick-view>
    )
  }
}

export const WithCustomTrigger: Story = {
  args: {
    handle: "sample-t-shirt"
  },
  render: args => {
    mockFetchForStorybook()
    setTimeout(restoreFetch, 5000)

    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: "20px" }}>
          <h3>Sample Product Card</h3>
          <img
            src="https://picsum.photos/200/200?random=5"
            alt="Product"
            style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "8px" }}
          />
          <p style={{ margin: "10px 0", fontWeight: "bold" }}>Sample T-Shirt</p>
          <p style={{ margin: "10px 0", color: "#666" }}>$25.00</p>
        </div>
        <nosto-quick-view handle={args.handle}>
          <button className="quick-view-trigger">👁️ Quick View</button>
        </nosto-quick-view>
      </div>
    )
  }
}

export const AccessibilityDemo: Story = {
  args: {
    handle: "sample-t-shirt"
  },
  render: args => {
    mockFetchForStorybook()
    setTimeout(restoreFetch, 5000)

    return (
      <div style={{ padding: "20px" }}>
        <h3>Accessibility Features Demo</h3>
        <p style={{ marginBottom: "20px", color: "#666" }}>
          This demo shows the accessibility features of the QuickView component:
        </p>
        <ul style={{ textAlign: "left", marginBottom: "20px", color: "#666" }}>
          <li>Tab navigation through all interactive elements</li>
          <li>Enter/Space to activate buttons and swatches</li>
          <li>Escape key to close modal</li>
          <li>Arrow keys to navigate between swatches</li>
          <li>Screen reader compatible with proper ARIA attributes</li>
          <li>Focus trap within modal</li>
          <li>Focus restoration when modal closes</li>
        </ul>
        <nosto-quick-view handle={args.handle}>
          <button className="quick-view-trigger">Open Accessible Quick View</button>
        </nosto-quick-view>
      </div>
    )
  }
}
