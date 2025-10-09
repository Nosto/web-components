import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import { updateShopifyRoot } from "../../utils/storybook"
import { http, HttpResponse } from "msw"
import type { ShopifyProduct } from "../SimpleCard/types"
import "./VariantSelector"

const root = "https://nosto-shopify1.myshopify.com/"
const handles = ["good-ol-shoes", "awesome-sneakers", "old-school-kicks", "insane-shoes"]

window.Shopify = {
  routes: {
    root
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
  tags: ["autodocs"]
}

export default meta
type Story = StoryObj

export const Default: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html` <nosto-variant-selector handle="${args.handle}"></nosto-variant-selector> `
}

export const InSimpleCard: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-simple-card handle="${args.handle}" alternate brand discount rating="4.5">
      <nosto-variant-selector handle="${args.handle}"></nosto-variant-selector>
    </nosto-simple-card>
  `
}

export const InSimpleCard_AddToCart: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-simple-card handle="${args.handle}" alternate brand discount rating="4.5">
      <nosto-variant-selector handle="${args.handle}"></nosto-variant-selector>
      <button n-atc>Add to cart</button>
    </nosto-simple-card>
  `
}

export const MultipleProducts: Story = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; padding: 1rem; max-width: 1200px;"
    >
      ${handles.map(
        handle => html`
          <nosto-simple-card handle="${handle}" alternate brand discount rating="3.8">
            <nosto-variant-selector handle="${handle}"></nosto-variant-selector>
          </nosto-simple-card>
        `
      )}
    </div>
  `
}

// Mock product data for demonstrating single-value options
const mockProductWithSingleValueOption: ShopifyProduct = {
  id: 123456,
  title: "Single Value Demo T-Shirt",
  handle: "single-value-demo-tshirt",
  description: "A demo product showing single-value option behavior",
  vendor: "Demo Brand",
  tags: ["demo", "single-value"],
  images: ["https://picsum.photos/400/400?random=1"],
  featured_image: "https://picsum.photos/400/400?random=1",
  price: 2499,
  compare_at_price: 2999,
  published_at: "2023-01-01T00:00:00Z",
  created_at: "2023-01-01T00:00:00Z",
  type: "Clothing",
  price_min: 2499,
  price_max: 2999,
  available: true,
  price_varies: true,
  compare_at_price_min: 2999,
  compare_at_price_max: 2999,
  compare_at_price_varies: false,
  url: "/products/single-value-demo-tshirt",
  media: [
    {
      id: 1,
      src: "https://picsum.photos/400/400?random=1",
      alt: "Product image",
      position: 1,
      aspect_ratio: 1,
      height: 400,
      width: 400,
      media_type: "image",
      preview_image: {
        aspect_ratio: 1,
        height: 400,
        width: 400,
        src: "https://picsum.photos/400/400?random=1"
      }
    }
  ],
  requires_selling_plan: false,
  selling_plan_groups: [],
  options: [
    {
      name: "Size",
      position: 1,
      values: ["Small", "Medium", "Large"] // Multi-value option (visible)
    },
    {
      name: "Material",
      position: 2,
      values: ["Cotton"] // Single-value option (hidden)
    }
  ],
  variants: [
    {
      id: 1001,
      title: "Small / Cotton",
      option1: "Small",
      option2: "Cotton",
      option3: null,
      sku: "DEMO-SM-COT",
      requires_shipping: true,
      taxable: true,
      featured_image: null,
      available: true,
      name: "Small / Cotton",
      public_title: null,
      options: ["Small", "Cotton"],
      price: 2499,
      weight: 100,
      compare_at_price: 2999,
      inventory_quantity: 10,
      inventory_management: null,
      inventory_policy: "deny",
      barcode: null,
      quantity_rule: { min: 1, max: null, increment: 1 },
      quantity_price_breaks: [],
      requires_selling_plan: false,
      selling_plan_allocations: []
    },
    {
      id: 1002,
      title: "Medium / Cotton",
      option1: "Medium",
      option2: "Cotton",
      option3: null,
      sku: "DEMO-MD-COT",
      requires_shipping: true,
      taxable: true,
      featured_image: null,
      available: true,
      name: "Medium / Cotton",
      public_title: null,
      options: ["Medium", "Cotton"],
      price: 2499,
      weight: 120,
      compare_at_price: 2999,
      inventory_quantity: 15,
      inventory_management: null,
      inventory_policy: "deny",
      barcode: null,
      quantity_rule: { min: 1, max: null, increment: 1 },
      quantity_price_breaks: [],
      requires_selling_plan: false,
      selling_plan_allocations: []
    },
    {
      id: 1003,
      title: "Large / Cotton",
      option1: "Large",
      option2: "Cotton",
      option3: null,
      sku: "DEMO-LG-COT",
      requires_shipping: true,
      taxable: true,
      featured_image: null,
      available: true,
      name: "Large / Cotton",
      public_title: null,
      options: ["Large", "Cotton"],
      price: 2999,
      weight: 140,
      compare_at_price: 2999,
      inventory_quantity: 8,
      inventory_management: null,
      inventory_policy: "deny",
      barcode: null,
      quantity_rule: { min: 1, max: null, increment: 1 },
      quantity_price_breaks: [],
      requires_selling_plan: false,
      selling_plan_allocations: []
    }
  ]
}

const mockProductAllSingleValue: ShopifyProduct = {
  ...mockProductWithSingleValueOption,
  id: 789012,
  title: "All Single Value Product",
  handle: "all-single-value-product",
  description: "Product where all options have only one value each",
  options: [
    {
      name: "Size",
      position: 1,
      values: ["One Size"] // Single value
    },
    {
      name: "Color",
      position: 2,
      values: ["Natural"] // Single value
    }
  ],
  variants: [
    {
      ...mockProductWithSingleValueOption.variants[0],
      id: 2001,
      title: "One Size / Natural",
      option1: "One Size",
      option2: "Natural",
      options: ["One Size", "Natural"],
      sku: "DEMO-OS-NAT"
    }
  ]
}

export const SingleValueOptionDemo: Story = {
  decorators: [
    story => {
      // Set up MSW handlers for mock products
      const worker = (window as { __mswWorker?: { use: (...handlers: unknown[]) => void } }).__mswWorker
      if (worker) {
        worker.use(
          http.get("*/products/single-value-demo-tshirt.js", () => {
            return HttpResponse.json(mockProductWithSingleValueOption)
          }),
          http.get("*/products/all-single-value-product.js", () => {
            return HttpResponse.json(mockProductAllSingleValue)
          })
        )
      }
      return html`<div style="max-width: 800px; margin: 0 auto; padding: 2rem;">${story()}</div>`
    }
  ],
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 3rem;">
      <div>
        <h3 style="margin-bottom: 1rem; color: #333;">
          Mixed Options: Size (visible) + Material (hidden single-value)
        </h3>
        <p style="margin-bottom: 1rem; color: #666; font-size: 0.9rem;">
          The "Material: Cotton" option is automatically selected and hidden from the UI because it only has one value.
          Only the "Size" option with multiple values is shown.
        </p>
        <nosto-simple-card handle="single-value-demo-tshirt" alternate brand>
          <nosto-variant-selector handle="single-value-demo-tshirt" preselect></nosto-variant-selector>
        </nosto-simple-card>
      </div>

      <div>
        <h3 style="margin-bottom: 1rem; color: #333;">All Single-Value Options: No UI Rendered</h3>
        <p style="margin-bottom: 1rem; color: #666; font-size: 0.9rem;">
          When all options have only one value, no variant selector UI is shown. The variant is automatically selected
          internally.
        </p>
        <nosto-simple-card handle="all-single-value-product" alternate brand>
          <nosto-variant-selector handle="all-single-value-product"></nosto-variant-selector>
          <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #666; font-style: italic;">
            ↑ No variant selector appears (all options auto-selected)
          </div>
        </nosto-simple-card>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates the behavior of single-value options in the VariantSelector component:

**Key Features:**
- Single-value options are automatically selected regardless of the \`preselect\` attribute
- Options with only one value are hidden from the UI to avoid showing redundant pills
- When all options are single-value, no variant selector UI is rendered at all
- Variant selection logic continues to work correctly with hidden options

**Use Case:**
This is useful for products where some variant options (like material, brand, or collection) 
only have one available choice, eliminating unnecessary user interactions while maintaining 
proper variant tracking.
        `
      }
    }
  }
}
