import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { html } from "lit"

/**
 * This story demonstrates how to use Nosto's SimpleCard component
 * with Shopify's official Storefront Web Components.
 *
 * Shopify Storefront Web Components provide a standard way to integrate
 * Shopify product data into any website using custom HTML elements.
 */

const meta: Meta = {
  title: "Components/SimpleCard/Shopify Storefront Web Components",
  component: "nosto-simple-card",
  parameters: {
    docs: {
      description: {
        component: `
This demonstrates integration with Shopify Storefront Web Components.
The \`<shopify-store>\` component sets up the store connection, while
\`<shopify-context>\` fetches product data that can be accessed by nested components.

**Note**: This is a proof of concept showing how Nosto components could work
alongside Shopify's native web components for product data management.
        `
      }
    }
  },
  tags: ["autodocs"]
}

export default meta
type Story = StoryObj

/**
 * Basic example showing a single SimpleCard rendered within a Shopify context.
 * The shopify-context component fetches and provides product data.
 */
export const SingleCard: Story = {
  render: () => html`
    <script type="module" src="https://cdn.shopify.com/storefront/web-components.js"></script>
    <div style="max-width: 300px; margin: 0 auto;">
      <shopify-store store-domain="mock.shop" country="US" language="en">
        <shopify-context type="product" handle="hoodie">
          <template>
            <nosto-simple-card handle="hoodie">
              <button n-atc>Add to cart</button>
            </nosto-simple-card>
          </template>
        </shopify-context>
      </shopify-store>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: `
Uses \`<shopify-store>\` to connect to mock.shop and \`<shopify-context>\` to 
fetch product data for a hoodie. The Nosto SimpleCard component is rendered 
inside the context with an add-to-cart button.
        `
      }
    }
  }
}

/**
 * Grid layout showing multiple products.
 * This demonstrates how to display a collection of products in a grid.
 */
export const ProductGrid: Story = {
  render: () => html`
    <script type="module" src="https://cdn.shopify.com/storefront/web-components.js"></script>
    <shopify-store store-domain="mock.shop" country="US" language="en">
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; padding: 1rem; max-width: 1200px;">
        <shopify-context type="product" handle="hoodie">
          <template>
            <nosto-simple-card handle="hoodie"></nosto-simple-card>
          </template>
        </shopify-context>
        <shopify-context type="product" handle="backpack">
          <template>
            <nosto-simple-card handle="backpack"></nosto-simple-card>
          </template>
        </shopify-context>
        <shopify-context type="product" handle="jacket">
          <template>
            <nosto-simple-card handle="jacket"></nosto-simple-card>
          </template>
        </shopify-context>
        <shopify-context type="product" handle="shoes">
          <template>
            <nosto-simple-card handle="shoes"></nosto-simple-card>
          </template>
        </shopify-context>
        <shopify-context type="product" handle="hat">
          <template>
            <nosto-simple-card handle="hat"></nosto-simple-card>
          </template>
        </shopify-context>
        <shopify-context type="product" handle="sunglasses">
          <template>
            <nosto-simple-card handle="sunglasses"></nosto-simple-card>
          </template>
        </shopify-context>
        <shopify-context type="product" handle="watch">
          <template>
            <nosto-simple-card handle="watch"></nosto-simple-card>
          </template>
        </shopify-context>
        <shopify-context type="product" handle="belt">
          <template>
            <nosto-simple-card handle="belt"></nosto-simple-card>
          </template>
        </shopify-context>
      </div>
    </shopify-store>
  `,
  parameters: {
    docs: {
      description: {
        story: `
Displays multiple products in a responsive grid layout. Each product uses 
\`<shopify-context>\` to fetch its data and is rendered with a SimpleCard component.
        `
      }
    }
  }
}

/**
 * Card with all features enabled, showing brand, discount, and rating.
 */
export const WithAllFeatures: Story = {
  render: () => {
    // Create the card element programmatically to work around template limitations
    const container = document.createElement("div")
    container.style.maxWidth = "300px"
    container.style.margin = "0 auto"

    const script = document.createElement("script")
    script.type = "module"
    script.src = "https://cdn.shopify.com/storefront/web-components.js"
    container.appendChild(script)

    const store = document.createElement("shopify-store")
    store.setAttribute("store-domain", "mock.shop")
    store.setAttribute("country", "US")
    store.setAttribute("language", "en")

    const context = document.createElement("shopify-context")
    context.setAttribute("type", "product")
    context.setAttribute("handle", "hoodie")

    const template = document.createElement("template")
    template.innerHTML = `
      <nosto-simple-card handle="hoodie" image-mode="alternate" brand discount rating="4.5">
      </nosto-simple-card>
    `

    context.appendChild(template)
    store.appendChild(context)
    container.appendChild(store)

    return container
  },
  parameters: {
    docs: {
      description: {
        story: `
Shows a SimpleCard with all features enabled: alternate image mode (hover to see alternate image),
brand information, discount display, and a 4.5-star rating.
        `
      }
    }
  }
}

/**
 * Card with carousel image mode for browsing multiple product images.
 */
export const WithCarousel: Story = {
  render: () => {
    const container = document.createElement("div")
    container.style.maxWidth = "300px"
    container.style.margin = "0 auto"

    const script = document.createElement("script")
    script.type = "module"
    script.src = "https://cdn.shopify.com/storefront/web-components.js"
    container.appendChild(script)

    const store = document.createElement("shopify-store")
    store.setAttribute("store-domain", "mock.shop")
    store.setAttribute("country", "US")
    store.setAttribute("language", "en")

    const context = document.createElement("shopify-context")
    context.setAttribute("type", "product")
    context.setAttribute("handle", "hoodie")

    const template = document.createElement("template")
    template.innerHTML = `
      <nosto-simple-card handle="hoodie" image-mode="carousel" brand rating="4.2">
      </nosto-simple-card>
    `

    context.appendChild(template)
    store.appendChild(context)
    container.appendChild(store)

    return container
  },
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates the carousel image mode, which allows customers to browse through
multiple product images using navigation controls.
        `
      }
    }
  }
}
