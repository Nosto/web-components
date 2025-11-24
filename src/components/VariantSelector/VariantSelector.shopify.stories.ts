import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { html } from "lit"
import "./VariantSelector"

/**
 * This story demonstrates how to use Nosto's VariantSelector component
 * with Shopify's official Storefront Web Components.
 *
 * Shopify Storefront Web Components provide a standard way to integrate
 * Shopify product data into any website using custom HTML elements.
 */

const meta: Meta = {
  title: "Components/VariantSelector/Shopify Storefront Web Components",
  component: "nosto-variant-selector",
  parameters: {
    docs: {
      description: {
        component: `
This demonstrates integration with Shopify Storefront Web Components.
The \`<shopify-store>\` component sets up the store connection, while
\`<shopify-context>\` fetches product data that can be accessed by nested components.

The VariantSelector component displays product options (like size, color) as
clickable pills, allowing customers to select their preferred variant.

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
 * Basic variant selector showing product options as clickable pills.
 */
export const Default: Story = {
  render: () => html`
    <script type="module" src="https://cdn.shopify.com/storefront/web-components.js"></script>
    <div style="max-width: 300px; margin: 0 auto;">
      <shopify-store store-domain="mock.shop" country="US" language="en">
        <shopify-context type="product" handle="hoodie">
          <template>
            <nosto-variant-selector handle="hoodie"></nosto-variant-selector>
          </template>
        </shopify-context>
      </shopify-store>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: `
Basic VariantSelector showing product options (e.g., Size, Color) as clickable pills.
Customers can select their preferred variant by clicking on the options.
        `
      }
    }
  }
}

/**
 * VariantSelector integrated within a SimpleCard component.
 * This is a common pattern for product cards.
 */
export const InSimpleCard: Story = {
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
      <nosto-simple-card handle="hoodie" brand discount>
        <nosto-variant-selector handle="hoodie"></nosto-variant-selector>
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
Shows a VariantSelector integrated within a SimpleCard. This pattern allows
customers to see the product image, details, and select variants all in one place.
        `
      }
    }
  }
}

/**
 * Complete product card with variant selector and add-to-cart button.
 */
export const WithAddToCart: Story = {
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
      <nosto-simple-card handle="hoodie" brand rating="4.5">
        <nosto-variant-selector handle="hoodie"></nosto-variant-selector>
        <button n-atc>Add to cart</button>
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
Complete product card with variant selection and add-to-cart functionality.
This demonstrates a fully functional product card that could be used in a
real e-commerce storefront.
        `
      }
    }
  }
}

/**
 * Compact mode displays all variants in a single dropdown.
 */
export const CompactMode: Story = {
  render: () => html`
    <script type="module" src="https://cdn.shopify.com/storefront/web-components.js"></script>
    <div style="max-width: 300px; margin: 0 auto;">
      <shopify-store store-domain="mock.shop" country="US" language="en">
        <shopify-context type="product" handle="hoodie">
          <template>
            <nosto-simple-card handle="hoodie">
              <nosto-variant-selector handle="hoodie" mode="compact"></nosto-variant-selector>
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
Uses compact mode which displays all variants in a single dropdown selector.
This is useful for products with many variants to save space.
        `
      }
    }
  }
}

/**
 * Grid of products with variant selectors.
 */
export const ProductGrid: Story = {
  render: () => html`
    <script type="module" src="https://cdn.shopify.com/storefront/web-components.js"></script>
    <shopify-store store-domain="mock.shop" country="US" language="en">
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; padding: 1rem; max-width: 1200px;">
        <shopify-context type="product" handle="hoodie">
          <template>
            <nosto-simple-card handle="hoodie">
              <nosto-variant-selector handle="hoodie"></nosto-variant-selector>
            </nosto-simple-card>
          </template>
        </shopify-context>
        <shopify-context type="product" handle="backpack">
          <template>
            <nosto-simple-card handle="backpack">
              <nosto-variant-selector handle="backpack"></nosto-variant-selector>
            </nosto-simple-card>
          </template>
        </shopify-context>
        <shopify-context type="product" handle="jacket">
          <template>
            <nosto-simple-card handle="jacket">
              <nosto-variant-selector handle="jacket"></nosto-variant-selector>
            </nosto-simple-card>
          </template>
        </shopify-context>
        <shopify-context type="product" handle="shoes">
          <template>
            <nosto-simple-card handle="shoes">
              <nosto-variant-selector handle="shoes"></nosto-variant-selector>
            </nosto-simple-card>
          </template>
        </shopify-context>
        <shopify-context type="product" handle="hat">
          <template>
            <nosto-simple-card handle="hat">
              <nosto-variant-selector handle="hat"></nosto-variant-selector>
            </nosto-simple-card>
          </template>
        </shopify-context>
        <shopify-context type="product" handle="sunglasses">
          <template>
            <nosto-simple-card handle="sunglasses">
              <nosto-variant-selector handle="sunglasses"></nosto-variant-selector>
            </nosto-simple-card>
          </template>
        </shopify-context>
      </div>
    </shopify-store>
  `,
  parameters: {
    docs: {
      description: {
        story: `
Displays multiple products in a grid layout, each with its own variant selector.
This pattern is commonly used on collection pages.
        `
      }
    }
  }
}

/**
 * VariantSelector with maxValues to limit displayed options.
 */
export const WithMaxValues: Story = {
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
      <nosto-simple-card handle="hoodie">
        <nosto-variant-selector handle="hoodie" max-values="3"></nosto-variant-selector>
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
Limits the number of option values displayed per option. When there are more values
than the specified limit, an ellipsis (…) is shown. This is useful for keeping
the UI compact when products have many option values.
        `
      }
    }
  }
}
