import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import { fetchProductHandles } from "@/utils/storybook/fetchProductHandles"

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
    }
  },
  args: {
    root,
    handle: handles[0],
    alternate: false,
    brand: false,
    discount: false,
    rating: 0
  }
}

export default meta
type Story = StoryObj

export const Default: Story = {
  decorators: [story => html`<div style="max-width: 1200px; margin: 0 auto;">${story()}</div>`],
  render: args => {
    const containerId = `story-${Math.random().toString(36).substr(2, 9)}`

    async function loadCards() {
      const container = document.getElementById(containerId)
      if (!container) return

      container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">Loading products...</div>'

      const fetchedHandles = await fetchProductHandles(args.root)

      const cardsHTML = fetchedHandles
        .map(
          handle => `
            <nosto-simple-card 
              handle="${handle}"
              ${args.alternate ? "alternate" : ""}
              ${args.brand ? "brand" : ""}
              ${args.discount ? "discount" : ""}
              rating="${args.rating || 0}">
            </nosto-simple-card>
          `
        )
        .join("")

      container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; padding: 1rem;">
          ${cardsHTML}
        </div>
      `
    }

    setTimeout(loadCards, 0)

    return html`<div id="${containerId}"></div>`
  }
}

export const WithAllFeatures: Story = {
  args: {
    handle: handles[0],
    alternate: true,
    brand: true,
    discount: true,
    rating: 4.2
  },
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: args => html`
    <nosto-simple-card
      handle="${args.handle}"
      ?alternate=${args.alternate}
      ?brand=${args.brand}
      ?discount=${args.discount}
      rating=${args.rating || 0}
    ></nosto-simple-card>
  `
}

export const GridOfCards: Story = {
  decorators: [story => html`<div style="max-width: 1200px; margin: 0 auto;">${story()}</div>`],
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; padding: 1rem; max-width: 1200px;">
      ${handles.map(
        handle => html`
          <nosto-simple-card handle="${handle}" alternate brand discount rating="3.8"></nosto-simple-card>
        `
      )}
    </div>
  `
}
