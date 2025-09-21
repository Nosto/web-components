import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import "./VariantSelector"
import type { ShopifyProduct } from "./types"

const root = "https://nosto-shopify1.myshopify.com/"
const handles = ["awesome-sneakers", "good-ol-shoes", "old-school-kicks", "insane-shoes"]

// Use the same Shopify setup as SimpleCard
window.Shopify = {
  routes: {
    root
  }
}

// Reusable decorator logic
function updateShopifyRoot(rootUrl: string) {
  window.Shopify = {
    routes: {
      root: rootUrl
    }
  }
}

// Mock Shopify product data based on the handles used in SimpleCard
const mockProducts: Record<string, ShopifyProduct> = {
  "awesome-sneakers": {
    id: 123456789,
    title: "Awesome Sneakers",
    handle: "awesome-sneakers",
    description: "The most awesome sneakers you'll ever wear.",
    published_at: "2023-01-01T00:00:00Z",
    created_at: "2023-01-01T00:00:00Z",
    vendor: "Nosto Shoes",
    type: "Footwear",
    tags: ["sneakers", "awesome"],
    price: 8999,
    price_min: 8999,
    price_max: 12999,
    available: true,
    price_varies: true,
    compare_at_price: null,
    compare_at_price_min: null,
    compare_at_price_max: null,
    compare_at_price_varies: false,
    variants: [
      {
        id: 11111,
        title: "Black / US 8",
        option1: "Black",
        option2: "US 8",
        option3: null,
        sku: "AWESOME-BLACK-8",
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        name: "Black / US 8",
        public_title: "Black / US 8",
        options: ["Black", "US 8"],
        price: 8999,
        weight: 500,
        compare_at_price: null,
        inventory_management: null,
        barcode: null,
        featured_media: null
      },
      {
        id: 22222,
        title: "Black / US 9",
        option1: "Black",
        option2: "US 9",
        option3: null,
        sku: "AWESOME-BLACK-9",
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        name: "Black / US 9",
        public_title: "Black / US 9",
        options: ["Black", "US 9"],
        price: 8999,
        weight: 500,
        compare_at_price: null,
        inventory_management: null,
        barcode: null,
        featured_media: null
      },
      {
        id: 33333,
        title: "White / US 8",
        option1: "White",
        option2: "US 8",
        option3: null,
        sku: "AWESOME-WHITE-8",
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        name: "White / US 8",
        public_title: "White / US 8",
        options: ["White", "US 8"],
        price: 9999,
        weight: 500,
        compare_at_price: null,
        inventory_management: null,
        barcode: null,
        featured_media: null
      },
      {
        id: 44444,
        title: "White / US 9",
        option1: "White",
        option2: "US 9",
        option3: null,
        sku: "AWESOME-WHITE-9",
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: false, // This variant is sold out
        name: "White / US 9",
        public_title: "White / US 9",
        options: ["White", "US 9"],
        price: 9999,
        weight: 500,
        compare_at_price: null,
        inventory_management: null,
        barcode: null,
        featured_media: null
      }
    ],
    images: [],
    featured_image: "",
    options: [
      {
        name: "Color",
        position: 1,
        values: ["Black", "White"]
      },
      {
        name: "Size",
        position: 2,
        values: ["US 8", "US 9"]
      }
    ],
    media: [],
    requires_selling_plan: false,
    selling_plan_groups: [],
    url: "/products/awesome-sneakers"
  },
  "good-ol-shoes": {
    id: 987654321,
    title: "Good Ol' Shoes",
    handle: "good-ol-shoes",
    description: "Classic shoes for every occasion.",
    published_at: "2023-01-01T00:00:00Z",
    created_at: "2023-01-01T00:00:00Z",
    vendor: "Classic Footwear",
    type: "Footwear",
    tags: ["classic", "shoes"],
    price: 6999,
    price_min: 6999,
    price_max: 6999,
    available: true,
    price_varies: false,
    compare_at_price: null,
    compare_at_price_min: null,
    compare_at_price_max: null,
    compare_at_price_varies: false,
    variants: [
      {
        id: 55555,
        title: "Brown",
        option1: "Brown",
        option2: null,
        option3: null,
        sku: "GOOD-BROWN",
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        name: "Brown",
        public_title: "Brown",
        options: ["Brown"],
        price: 6999,
        weight: 400,
        compare_at_price: null,
        inventory_management: null,
        barcode: null,
        featured_media: null
      },
      {
        id: 66666,
        title: "Black",
        option1: "Black",
        option2: null,
        option3: null,
        sku: "GOOD-BLACK",
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        name: "Black",
        public_title: "Black",
        options: ["Black"],
        price: 6999,
        weight: 400,
        compare_at_price: null,
        inventory_management: null,
        barcode: null,
        featured_media: null
      }
    ],
    images: [],
    featured_image: "",
    options: [
      {
        name: "Color",
        position: 1,
        values: ["Brown", "Black"]
      }
    ],
    media: [],
    requires_selling_plan: false,
    selling_plan_groups: [],
    url: "/products/good-ol-shoes"
  }
}

// Set up mock fetch for product data
if (typeof window !== "undefined") {
  const originalFetch = window.fetch
  window.fetch = async (url: string | Request, init?: RequestInit) => {
    const urlString = typeof url === "string" ? url : url.url

    // Check if this is a Shopify product request
    const productMatch = urlString.match(/\/products\/([^/.]+)\.js/)
    if (productMatch) {
      const handle = productMatch[1]
      const product = mockProducts[handle]
      
      if (product) {
        return new Response(JSON.stringify(product), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        })
      } else {
        return new Response(JSON.stringify({ error: "Product not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        })
      }
    }

    // Fall back to original fetch for other requests
    return originalFetch(url, init)
  }
}

const meta: Meta = {
  title: "Components/VariantSelector",
  component: "nosto-variant-selector",
  decorators: [
    (story, context) => {
      // Update Shopify root if provided via args
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
    },
    handle: {
      control: "text",
      description: "The Shopify product handle to fetch data for"
    }
  },
  args: {
    root,
    handle: handles[0]
  },
  parameters: {
    docs: {
      description: {
        component:
          "A custom element that renders variant selection controls for Shopify products. Fetches product data from Shopify and allows users to select variants through dropdown controls."
      }
    }
  }
}

export default meta
type Story = StoryObj

export const Basic: Story = {
  decorators: [story => html`<div style="max-width: 600px; margin: 20px auto;">${story()}</div>`],
  render: args => html`
    <div class="story-container">
      <style>
        .story-container {
          padding: 20px;
        }

        .product-demo {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          background: white;
        }

        .product-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }

        .product-description {
          margin-bottom: 20px;
          color: #666;
          line-height: 1.5;
        }

        .variant-info {
          margin-top: 20px;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 4px;
        }

        .variant-info h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .variant-info p {
          margin: 5px 0;
          color: #666;
        }

        .variant-selector {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .variant-option {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .variant-option label {
          font-weight: 600;
          color: #333;
        }

        .variant-option select {
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          background: white;
        }

        .variant-option select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .variant-selector-error {
          color: #dc3545;
          background: #f8d7da;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #f5c6cb;
        }

        [loading] {
          opacity: 0.6;
        }

        [loading]::after {
          content: " (Loading...)";
          color: #666;
        }
      </style>

      <div class="product-demo">
        <div class="product-title">Awesome Sneakers</div>
        <div class="product-description">
          Select your preferred color and size from the options below. The variant selector will automatically update
          when you make changes.
        </div>

        <nosto-variant-selector handle="${args.handle}"></nosto-variant-selector>

        <div class="variant-info">
          <h4>Selected Variant Info:</h4>
          <p id="variant-details">Loading...</p>
        </div>
      </div>
    </div>

    <script>
      (() => {
        const selector = document.querySelector('nosto-variant-selector')
        const detailsElement = document.getElementById('variant-details')

        function updateVariantInfo(event) {
          const { variant, product } = event.detail
          if (variant) {
            detailsElement.innerHTML = \`
              <strong>\${variant.title}</strong><br>
              SKU: \${variant.sku}<br>
              Price: $\${(variant.price / 100).toFixed(2)}<br>
              Available: \${variant.available ? 'Yes' : 'No'}
            \`
          } else {
            detailsElement.innerHTML = 'No variant selected or variant not found'
          }
        }

        selector.addEventListener('@nosto/VariantSelector/variant-selected', updateVariantInfo)
      })()
    </script>
  `,
  parameters: {
    docs: {
      description: {
        story: "Basic usage of the VariantSelector component with sneakers that have color and size options."
      }
    }
  }
}

export const SingleOption: Story = {
  args: {
    handle: "good-ol-shoes"
  },
  decorators: [story => html`<div style="max-width: 600px; margin: 20px auto;">${story()}</div>`],
  render: args => html`
    <div class="story-container">
      <div class="product-demo">
        <div class="product-title">Good Ol' Shoes</div>
        <div class="product-description">
          This classic shoe comes in two colors. Select your preferred option below.
        </div>

        <nosto-variant-selector handle="${args.handle}"></nosto-variant-selector>

        <div class="variant-info">
          <h4>Selected Variant Info:</h4>
          <p id="shoes-variant-details">Loading...</p>
        </div>
      </div>
    </div>

    <script>
      (() => {
        const selector = document.querySelector('nosto-variant-selector[handle="good-ol-shoes"]')
        const detailsElement = document.getElementById('shoes-variant-details')

        function updateVariantInfo(event) {
          const { variant } = event.detail
          if (variant) {
            detailsElement.innerHTML = \`
              <strong>\${variant.title}</strong><br>
              SKU: \${variant.sku}<br>
              Price: $\${(variant.price / 100).toFixed(2)}
            \`
          } else {
            detailsElement.innerHTML = 'No variant selected'
          }
        }

        selector.addEventListener('@nosto/VariantSelector/variant-selected', updateVariantInfo)
      })()
    </script>
  `,
  parameters: {
    docs: {
      description: {
        story: "VariantSelector with a single option (color only) demonstrating simpler use cases."
      }
    }
  }
}