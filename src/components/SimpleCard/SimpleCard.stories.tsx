import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"

interface SimpleCardArgs {
  handle: string
  alternate: boolean
  brand: boolean
  discount: boolean
  rating: boolean
}

const meta = {
  title: "Components/SimpleCard",
  component: "nosto-simple-card",
  parameters: {
    layout: "centered"
  },
  argTypes: {
    handle: {
      control: "text",
      description: "The product handle to fetch data for"
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
      description: "Show discount information when available"
    },
    rating: {
      control: "boolean",
      description: "Show rating information"
    }
  },
  args: {
    handle: "sample-product",
    alternate: false,
    brand: false,
    discount: false,
    rating: false
  }
} as Meta<SimpleCardArgs>

export default meta
type Story = StoryObj<SimpleCardArgs>

export const Default: Story = {
  render: args => html`
    <div style="width: 300px;">
      <nosto-simple-card
        handle=${args.handle}
        ?alternate=${args.alternate}
        ?brand=${args.brand}
        ?discount=${args.discount}
        ?rating=${args.rating}
      ></nosto-simple-card>
    </div>
    <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px;">
      <h4>Note:</h4>
      <p>
        This component fetches product data from <code>/products/{handle}.js</code>. 
        In this Storybook environment, the fetch will fail and show an error message 
        since there's no Shopify backend available.
      </p>
      <p>
        To see the component working properly, use it in a Shopify store environment 
        with a valid product handle.
      </p>
    </div>
  `
}

export const WithAllFeatures: Story = {
  args: {
    handle: "sample-product",
    alternate: true,
    brand: true,
    discount: true,
    rating: true
  },
  render: args => html`
    <div style="width: 300px;">
      <nosto-simple-card
        handle=${args.handle}
        ?alternate=${args.alternate}
        ?brand=${args.brand}
        ?discount=${args.discount}
        ?rating=${args.rating}
      ></nosto-simple-card>
    </div>
    <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px;">
      <p><strong>Features enabled:</strong></p>
      <ul>
        <li>✅ Alternate image on hover</li>
        <li>✅ Brand/vendor display</li>
        <li>✅ Discount pricing display</li>
        <li>✅ Rating display</li>
      </ul>
    </div>
  `
}

export const LoadingState: Story = {
  render: () => html`
    <div style="width: 300px;">
      <nosto-simple-card handle="loading-example" loading></nosto-simple-card>
    </div>
    <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 4px;">
      <p>
        <strong>Loading State:</strong> The component shows the <code>loading</code> 
        attribute while fetching product data. You can style this state using CSS:
      </p>
      <pre style="background: white; padding: 10px; border-radius: 4px; margin-top: 10px;">
nosto-simple-card[loading] {
  opacity: 0.6;
  pointer-events: none;
}</pre>
    </div>
  `
}

export const ErrorState: Story = {
  args: {
    handle: "nonexistent-product"
  },
  render: args => html`
    <div style="width: 300px;">
      <nosto-simple-card handle=${args.handle}></nosto-simple-card>
    </div>
    <div style="margin-top: 20px; padding: 15px; background: #ffebee; border-radius: 4px;">
      <p>
        <strong>Error State:</strong> When a product handle doesn't exist or the fetch fails,
        the component displays an error message. This is what you'll see in this Storybook
        environment since there's no Shopify backend.
      </p>
    </div>
  `
}