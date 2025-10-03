import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"

const root = "https://nosto-shopify1.myshopify.com/"
const handles = ["awesome-sneakers", "good-ol-shoes", "old-school-kicks", "insane-shoes"]

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

const meta: Meta = {
  title: "Components/SimpleCard",
  component: "nosto-simple-card",
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
    },
    alternate: {
      control: "boolean",
      description: "Show alternate product image on hover"
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
    swatches: {
      control: "boolean",
      description: "Show color swatches"
    },
    maxSwatches: {
      control: "number",
      description: "Maximum number of swatches to show"
    },
    oosBadge: {
      control: "boolean",
      description: "Show sold out badge when product is unavailable"
    },
    saleBadge: {
      control: "boolean",
      description: "Show sale badge when product is on sale"
    },
    saleBadgeType: {
      control: "select",
      options: ["text", "percentage", "fixed"],
      description: "Sale badge type"
    },
    sizes: {
      control: "text",
      description: "Responsive image sizes attribute"
    }
  },
  args: {
    root,
    handle: handles[0],
    alternate: false,
    brand: false,
    discount: false,
    rating: 0,
    swatches: false,
    maxSwatches: undefined,
    oosBadge: false,
    saleBadge: false,
    saleBadgeType: "text",
    sizes: undefined
  }
}

export default meta
type Story = StoryObj

export const Default: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-simple-card
      handle="${args.handle}"
      ?alternate=${args.alternate}
      ?brand=${args.brand}
      ?discount=${args.discount}
      rating=${args.rating || 0}
      ?swatches=${args.swatches}
      max-swatches=${args.maxSwatches || ""}
      ?oos-badge=${args.oosBadge}
      ?sale-badge=${args.saleBadge}
      sale-badge-type=${args.saleBadgeType || "text"}
      sizes=${args.sizes || ""}
    ></nosto-simple-card>
  `
}

export const WithAllFeatures: Story = {
  args: {
    handle: handles[0],
    alternate: true,
    brand: true,
    discount: true,
    rating: 4.2,
    swatches: true,
    maxSwatches: 3,
    oosBadge: false,
    saleBadge: true,
    saleBadgeType: "percentage",
    sizes: "(max-width: 768px) 100vw, 50vw"
  },
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-simple-card
      handle="${args.handle}"
      ?alternate=${args.alternate}
      ?brand=${args.brand}
      ?discount=${args.discount}
      rating=${args.rating || 0}
      ?swatches=${args.swatches}
      max-swatches=${args.maxSwatches || ""}
      ?oos-badge=${args.oosBadge}
      ?sale-badge=${args.saleBadge}
      sale-badge-type=${args.saleBadgeType || "text"}
      sizes=${args.sizes || ""}
    ></nosto-simple-card>
  `
}

export const NewFeatures: Story = {
  args: {
    handle: handles[0],
    swatches: true,
    maxSwatches: 2,
    saleBadge: true,
    saleBadgeType: "percentage",
    sizes: "(max-width: 768px) 100vw, 33vw"
  },
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-simple-card
      handle="${args.handle}"
      ?swatches=${args.swatches}
      max-swatches=${args.maxSwatches || ""}
      ?sale-badge=${args.saleBadge}
      sale-badge-type=${args.saleBadgeType || "text"}
      sizes=${args.sizes || ""}
    ></nosto-simple-card>
  `
}

export const GridOfCards: Story = {
  decorators: [story => html`<div style="max-width: 1200px; margin: 0 auto;">${story()}</div>`],
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; padding: 1rem; max-width: 1200px;">
      ${handles.map(
        (handle, index) => html`
          <nosto-simple-card 
            handle="${handle}" 
            alternate 
            brand 
            discount 
            rating="3.8"
            swatches
            max-swatches="3"
            sale-badge
            sale-badge-type=${index % 3 === 0 ? "percentage" : index % 3 === 1 ? "fixed" : "text"}
            sizes="(max-width: 768px) 100vw, 25vw"
          ></nosto-simple-card>
        `
      )}
    </div>
  `
}
