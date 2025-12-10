/** @jsx h */
import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { h } from "jsx-dom"
import { exampleHandlesLoader } from "@/storybook/loader"
import { setShopifyShop } from "@/shopify/getShopifyUrl"

const shopifyShop = "nosto-shopify1.myshopify.com"
setShopifyShop(shopifyShop)

const meta: Meta = {
  title: "Components/SimpleCard",
  component: "nosto-simple-card",
  decorators: [
    (story, context) => {
      // Update Shopify shop hostname if provided via args
      if (context.args?.shopifyShop) {
        setShopifyShop(context.args.shopifyShop)
      }
      return story()
    }
  ],
  loaders: [exampleHandlesLoader],
  argTypes: {
    shopifyShop: {
      control: "text",
      description: "The Shopify store hostname"
    },
    imageMode: {
      control: "select",
      options: ["", "alternate", "carousel"],
      description:
        'Image display mode. Use "alternate" for hover image swap or "carousel" for image carousel with navigation'
    },
    brand: {
      control: "boolean",
      description: "Show brand/vendor data"
    },
    discount: {
      control: "boolean",
      description: "Show discount data"
    },
    rating: {
      control: "number",
      description: "Product rating (0-5 stars)"
    },
    imageSizes: {
      control: "text",
      description: "The sizes attribute for responsive images"
    }
  },
  args: {
    shopifyShop,
    imageMode: "",
    brand: false,
    discount: false,
    rating: 0,
    imageSizes: ""
  },
  tags: ["autodocs"]
}

export default meta
type Story = StoryObj

export const Default: Story = {
  argTypes: {
    columns: {
      description: "Number of columns to display in the grid",
      control: { type: "range", min: 1, max: 8, step: 1 },
      table: {
        category: "Layout options"
      }
    },
    products: {
      description: "Number of products to display in the grid",
      control: { type: "range", min: 1, max: 20, step: 1 },
      table: {
        category: "Layout options"
      }
    }
  },
  args: {
    columns: 4,
    products: 12
  },
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return (
      <div
        style={`display: grid; grid-template-columns: repeat(${args.columns}, 1fr); gap: 0.5rem; padding: 1rem; max-width: 1200px;`}
      >
        {handles.map(handle => (
          <nosto-simple-card
            handle={handle}
            image-mode={args.imageMode || undefined}
            brand={args.brand}
            discount={args.discount}
            rating={args.rating || 0}
            image-sizes={args.imageSizes || ""}
          ></nosto-simple-card>
        ))}
      </div>
    )
  },
  decorators: [story => <div style="max-width: 1200px; margin: 0 auto;">{story()}</div>]
}

export const SingleCard: Story = {
  decorators: [story => <div style="max-width: 300px; margin: 0 auto;">{story()}</div>],
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return (
      <nosto-simple-card
        handle={handles[0]}
        image-mode={args.imageMode || undefined}
        brand={args.brand}
        discount={args.discount}
        rating={args.rating || 0}
        image-sizes={args.imageSizes || ""}
      >
        <button n-atc>Add to cart</button>
      </nosto-simple-card>
    )
  }
}

export const WithVariantSelector: Story = {
  decorators: [story => <div style="max-width: 300px; margin: 0 auto;">{story()}</div>],
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return (
      <nosto-simple-card
        handle={handles[0]}
        image-mode={args.imageMode || undefined}
        brand={args.brand}
        discount={args.discount}
        rating={args.rating || 0}
      >
        <nosto-variant-selector handle={handles[0]}></nosto-variant-selector>
        <button n-atc>Add to cart</button>
      </nosto-simple-card>
    )
  }
}

export const WithAllFeatures: Story = {
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return (
      <nosto-simple-card
        handle={handles[0]}
        image-mode={args.imageMode || undefined}
        brand={args.brand}
        discount={args.discount}
        rating={args.rating || 0}
        image-sizes={args.imageSizes || ""}
      ></nosto-simple-card>
    )
  },
  args: {
    imageMode: "alternate",
    brand: true,
    discount: true,
    rating: 4.2
  },
  decorators: [story => <div style="max-width: 300px; margin: 0 auto;">{story()}</div>]
}

export const WithCarousel: Story = {
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return (
      <nosto-simple-card
        handle={handles[0]}
        image-mode={args.imageMode || undefined}
        brand={args.brand}
        discount={args.discount}
        rating={args.rating || 0}
        image-sizes={args.imageSizes || ""}
      ></nosto-simple-card>
    )
  },
  args: {
    imageMode: "carousel",
    brand: true,
    discount: true,
    rating: 4.2
  },
  decorators: [story => <div style="max-width: 300px; margin: 0 auto;">{story()}</div>]
}

export const Mocked: Story = {
  render: args => <nosto-simple-card handle="mock" mock={args.mock}></nosto-simple-card>,
  args: {
    mock: true
  },
  decorators: [story => <div style="max-width: 300px; margin: 0 auto;">{story()}</div>]
}
