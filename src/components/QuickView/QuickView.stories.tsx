import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
// Import is needed for TypeScript declaration merging
import "./QuickView"

// Mock Shopify product data for storybook
const mockProductData = {
  id: 123456789,
  title: "Selling Plans Ski Wax",
  handle: "selling-plans-ski-wax",
  description: "Premium ski wax for all snow conditions",
  published_at: "2023-01-01T00:00:00Z",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
  vendor: "Ski Co",
  product_type: "Ski Equipment",
  tags: ["ski", "wax", "winter"],
  price: 2495, // $24.95 in cents
  price_min: 2495,
  price_max: 2995,
  available: true,
  price_varies: true,
  compare_at_price: null,
  compare_at_price_min: 0,
  compare_at_price_max: 0,
  compare_at_price_varies: false,
  variants: [
    {
      id: 987654321,
      title: "Selling Plans Ski Wax",
      option1: "Selling Plans Ski Wax",
      option2: null,
      option3: null,
      sku: "SKI-WAX-001",
      requires_shipping: true,
      taxable: true,
      featured_image: null,
      available: true,
      price: 2495,
      grams: 200,
      compare_at_price: null,
      position: 1,
      product_id: 123456789,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    },
    {
      id: 987654322,
      title: "Special Selling Plans Ski Wax",
      option1: "Special Selling Plans Ski Wax",
      option2: null,
      option3: null,
      sku: "SKI-WAX-002",
      requires_shipping: true,
      taxable: true,
      featured_image: null,
      available: true,
      price: 2995,
      grams: 200,
      compare_at_price: 3495,
      position: 2,
      product_id: 123456789,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    },
    {
      id: 987654323,
      title: "Sample Selling Plans Ski Wax",
      option1: "Sample Selling Plans Ski Wax",
      option2: null,
      option3: null,
      sku: "SKI-WAX-003",
      requires_shipping: true,
      taxable: true,
      featured_image: null,
      available: true,
      price: 2695,
      grams: 200,
      compare_at_price: null,
      position: 3,
      product_id: 123456789,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    }
  ],
  images: ["https://picsum.photos/400/400?random=1", "https://picsum.photos/400/400?random=2"],
  featured_image: "https://picsum.photos/400/400?random=1",
  options: [
    {
      name: "Title",
      position: 1,
      values: ["Selling Plans Ski Wax", "Special Selling Plans Ski Wax", "Sample Selling Plans Ski Wax"]
    }
  ],
  url: "/products/selling-plans-ski-wax"
}

// Mock the product endpoint
const mockFetch = (url: string) => {
  if (url.includes("/products/selling-plans-ski-wax.js")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProductData)
    } as Response)
  }
  return fetch(url)
}

// Replace global fetch for the story
window.fetch = mockFetch as typeof fetch

// Mock Nosto addSkuToCart
window.Nosto = {
  addSkuToCart: (productInfo: { productId: string; skuId: string }, recoId: string, quantity: number) => {
    console.log("Mock addSkuToCart called:", { productInfo, recoId, quantity })
    return Promise.resolve()
  }
}

// Mock Shopify cart API
window.fetch = ((url: string, options?: RequestInit) => {
  if (url === "/cart/add.js") {
    console.log("Mock cart add called with:", options?.body)
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 987654321,
          quantity: 1,
          variant_id: 987654321,
          product_id: 123456789,
          title: "Selling Plans Ski Wax"
        })
    } as Response)
  }
  return mockFetch(url)
}) as typeof fetch

const meta: Meta = {
  title: "Components/QuickView",
  component: "nosto-quick-view",
  parameters: {
    docs: {
      description: {
        component: `
The QuickView component displays a modal dialog for product preview. It fetches product data from Shopify's public API and allows users to:

- View product image and details
- Select product options using swatch pickers
- Adjust quantity 
- Add products to cart

## Features

- **Accessibility**: Full keyboard navigation, focus trap, ARIA roles
- **Shopify Integration**: Fetches from \`/products/<handle>.js\` API
- **Cart Integration**: Uses Shopify's AJAX cart API
- **Responsive**: Works on mobile and desktop
- **Error Handling**: Graceful loading and error states

## Usage

\`\`\`html
<nosto-quick-view handle="product-handle"></nosto-quick-view>
\`\`\`

Open the modal programmatically:
\`\`\`javascript
document.querySelector('nosto-quick-view').openQuickView()
\`\`\`
        `
      }
    }
  },
  argTypes: {
    handle: {
      control: "text",
      description: "Product handle (required)"
    },
    open: {
      control: "boolean",
      description: "Whether the modal is open"
    },
    productId: {
      control: "text",
      description: "Nosto product ID for tracking"
    },
    recoId: {
      control: "text",
      description: "Nosto recommendation ID for tracking"
    }
  }
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: {
    handle: "selling-plans-ski-wax",
    productId: "nosto-123",
    recoId: "frontpage"
  },
  render: args => html`
    <div>
      <button onclick="document.querySelector('nosto-quick-view').openQuickView()">Open Quick View</button>
      <nosto-quick-view
        handle="${args.handle}"
        product-id="${args.productId || ""}"
        reco-id="${args.recoId || ""}"
      ></nosto-quick-view>
    </div>
  `
}

export const OpenByDefault: Story = {
  args: {
    handle: "selling-plans-ski-wax",
    open: true,
    productId: "nosto-123",
    recoId: "frontpage"
  },
  render: args => html`
    <nosto-quick-view
      handle="${args.handle}"
      product-id="${args.productId || ""}"
      reco-id="${args.recoId || ""}"
      ?open="${args.open}"
    ></nosto-quick-view>
  `
}

export const LoadingState: Story = {
  args: {
    handle: "loading-product",
    open: true
  },
  render: args => {
    // Mock slow loading
    window.fetch = ((url: string) => {
      if (url.includes("/products/loading-product.js")) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve(mockProductData)
            } as Response)
          }, 3000) // 3 second delay
        })
      }
      return mockFetch(url)
    }) as typeof fetch

    return html` <nosto-quick-view handle="${args.handle}" ?open="${args.open}"></nosto-quick-view> `
  }
}

export const ErrorState: Story = {
  args: {
    handle: "non-existent-product",
    open: true
  },
  render: args => {
    // Mock error response
    window.fetch = ((url: string) => {
      if (url.includes("/products/non-existent-product.js")) {
        return Promise.resolve({
          ok: false,
          status: 404,
          statusText: "Not Found"
        } as Response)
      }
      return mockFetch(url)
    }) as typeof fetch

    return html` <nosto-quick-view handle="${args.handle}" ?open="${args.open}"></nosto-quick-view> `
  }
}

export const WithMultipleOptions: Story = {
  args: {
    handle: "multi-option-product",
    open: true
  },
  render: args => {
    const multiOptionProduct = {
      ...mockProductData,
      handle: "multi-option-product",
      title: "Multi-Option Ski Wax",
      variants: [
        {
          id: 111111111,
          title: "Red / Small",
          option1: "Red",
          option2: "Small",
          option3: null,
          sku: "SKI-RED-S",
          requires_shipping: true,
          taxable: true,
          featured_image: null,
          available: true,
          price: 2495,
          grams: 200,
          compare_at_price: null,
          position: 1,
          product_id: 123456789,
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z"
        },
        {
          id: 111111112,
          title: "Red / Large",
          option1: "Red",
          option2: "Large",
          option3: null,
          sku: "SKI-RED-L",
          requires_shipping: true,
          taxable: true,
          featured_image: null,
          available: true,
          price: 2995,
          grams: 300,
          compare_at_price: 3495,
          position: 2,
          product_id: 123456789,
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z"
        },
        {
          id: 111111113,
          title: "Blue / Small",
          option1: "Blue",
          option2: "Small",
          option3: null,
          sku: "SKI-BLUE-S",
          requires_shipping: true,
          taxable: true,
          featured_image: null,
          available: true,
          price: 2495,
          grams: 200,
          compare_at_price: null,
          position: 3,
          product_id: 123456789,
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z"
        },
        {
          id: 111111114,
          title: "Blue / Large",
          option1: "Blue",
          option2: "Large",
          option3: null,
          sku: "SKI-BLUE-L",
          requires_shipping: true,
          taxable: true,
          featured_image: null,
          available: false, // Sold out
          price: 2995,
          grams: 300,
          compare_at_price: null,
          position: 4,
          product_id: 123456789,
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z"
        }
      ],
      options: [
        {
          name: "Color",
          position: 1,
          values: ["Red", "Blue"]
        },
        {
          name: "Size",
          position: 2,
          values: ["Small", "Large"]
        }
      ]
    }

    window.fetch = ((url: string) => {
      if (url.includes("/products/multi-option-product.js")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(multiOptionProduct)
        } as Response)
      }
      return mockFetch(url)
    }) as typeof fetch

    return html` <nosto-quick-view handle="${args.handle}" ?open="${args.open}"></nosto-quick-view> `
  }
}

export const Interactive: Story = {
  args: {
    handle: "selling-plans-ski-wax"
  },
  render: args => html`
    <div style="padding: 20px; font-family: system-ui;">
      <h3>Interactive QuickView Demo</h3>
      <p>Click the buttons below to test different scenarios:</p>

      <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
        <button
          onclick="document.querySelector('#qv1').openQuickView()"
          style="padding: 10px 16px; background: #000; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          Open Quick View
        </button>

        <button
          onclick="document.querySelector('#qv1').closeQuickView()"
          style="padding: 10px 16px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          Close Quick View
        </button>

        <button
          onclick="alert('Current state: ' + (document.querySelector('#qv1').open ? 'Open' : 'Closed'))"
          style="padding: 10px 16px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          Check State
        </button>
      </div>

      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h4>Event Log:</h4>
        <div id="event-log" style="font-family: monospace; font-size: 12px; max-height: 200px; overflow-y: auto;"></div>
      </div>

      <nosto-quick-view
        id="qv1"
        handle="${args.handle}"
        product-id="nosto-123"
        reco-id="storybook-demo"
      ></nosto-quick-view>

      <script>
        const quickView = document.querySelector("#qv1")
        const eventLog = document.querySelector("#event-log")

        const logEvent = (eventName, detail) => {
          const timestamp = new Date().toLocaleTimeString()
          eventLog.innerHTML += \`<div>[\${timestamp}] \${eventName}: \${JSON.stringify(detail)}</div>\`
          eventLog.scrollTop = eventLog.scrollHeight
        }

        quickView.addEventListener("@nosto/QuickView/open", e => {
          logEvent("Modal Opened", e.detail)
        })

        quickView.addEventListener("@nosto/QuickView/close", e => {
          logEvent("Modal Closed", e.detail)
        })

        quickView.addEventListener("@nosto/QuickView/loaded", e => {
          logEvent("Product Loaded", { handle: e.detail.product.handle })
        })

        quickView.addEventListener("@nosto/QuickView/addToCart", e => {
          logEvent("Added to Cart", {
            variant: e.detail.variant.id,
            quantity: e.detail.quantity
          })
        })

        quickView.addEventListener("@nosto/QuickView/error", e => {
          logEvent("Error", e.detail)
        })
      </script>
    </div>
  `
}
