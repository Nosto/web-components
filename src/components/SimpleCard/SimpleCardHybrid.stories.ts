/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"

// Import to ensure component is defined
import "@/components/SimpleCard/SimpleCardHybrid"

const meta = {
  title: "POC/SimpleCard Hybrid",
  component: "nosto-simple-card-hybrid",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Hybrids version of SimpleCard component as proof of concept"
      }
    }
  },
  argTypes: {
    handle: {
      control: "text",
      description: "Product handle to fetch from Shopify"
    },
    brand: {
      control: "boolean",
      description: "Show brand/vendor information"
    },
    discount: {
      control: "boolean",
      description: "Show discount information"
    },
    alternate: {
      control: "boolean",
      description: "Show alternate image on hover"
    },
    rating: {
      control: { type: "number", min: 0, max: 5, step: 0.1 },
      description: "Product rating (0-5)"
    }
  }
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    handle: "test-product",
    brand: false,
    discount: false,
    alternate: false,
    rating: 0
  } as any,
  render: (args: any) => html`
    <div style="max-width: 300px; margin: 20px;">
      <h3>Hybrids SimpleCard</h3>
      <nosto-simple-card-hybrid
        handle="${args.handle}"
        ?brand="${args.brand}"
        ?discount="${args.discount}"
        ?alternate="${args.alternate}"
        rating="${args.rating || ""}"
      ></nosto-simple-card-hybrid>
    </div>
  `
}

export const WithBrandAndDiscount: Story = {
  args: {
    handle: "test-product",
    brand: true,
    discount: true,
    alternate: true,
    rating: 4.5
  } as any,
  render: (args: any) => html`
    <div style="max-width: 300px; margin: 20px;">
      <h3>Hybrids SimpleCard with Features</h3>
      <nosto-simple-card-hybrid
        handle="${args.handle}"
        ?brand="${args.brand}"
        ?discount="${args.discount}"
        ?alternate="${args.alternate}"
        rating="${args.rating}"
      ></nosto-simple-card-hybrid>
    </div>
  `
}

export const Comparison: Story = {
  render: () => html`
    <div style="display: flex; gap: 20px; margin: 20px;">
      <div style="max-width: 300px;">
        <h3>Original SimpleCard</h3>
        <nosto-simple-card handle="test-product" brand discount alternate></nosto-simple-card>
      </div>
      <div style="max-width: 300px;">
        <h3>Hybrids SimpleCard</h3>
        <nosto-simple-card-hybrid
          handle="test-product"
          brand
          discount
          alternate
          rating="4.5"
        ></nosto-simple-card-hybrid>
      </div>
    </div>
  `
}
