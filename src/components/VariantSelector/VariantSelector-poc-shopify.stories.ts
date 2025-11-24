import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { html } from "lit"
import { exampleHandlesLoader, updateShopifyShop } from "@/storybook/loader"

const shopifyShop = "nosto-shopify1.myshopify.com"
updateShopifyShop(shopifyShop)

const meta: Meta = {
  title: "POC/VariantSelector with Shopify Web Components",
  decorators: [
    (story, context) => {
      // Update Shopify root if provided via args
      if (context.args?.root) {
        updateShopifyShop(context.args.root)
      }
      return story()
    }
  ],
  loaders: [exampleHandlesLoader],
  argTypes: {
    root: {
      control: "text",
      description: "The Shopify store root URL"
    }
  },
  args: {
    root: shopifyShop
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
    return html`
      <script type="module" src="https://cdn.shopify.com/storefront/web-components.js"></script>
      <shopify-store store-domain="${args.root}"></shopify-store>

      <div
        style="display: grid; grid-template-columns: repeat(${args.columns}, 1fr); gap: 0.5rem; padding: 0.1rem; max-width: 1200px;"
      >
        ${handles.slice(0, args.products).map(
          handle => html`
            <shopify-context type="product" handle="${handle}">
              <template>
                <div class="product-card" style="border: 1px solid #e0e0e0; padding: 1rem; border-radius: 8px;">
                  <shopify-media
                    query="product.selectedOrFirstAvailableVariant.image"
                    style="width: 100%; height: auto;"
                  ></shopify-media>
                  <h3 style="font-size: 0.9rem; margin: 0.5rem 0;">
                    <shopify-data query="product.title"></shopify-data>
                  </h3>
                  <shopify-variant-selector
                    style="margin: 0.5rem 0; display: block; font-size: 0.85rem;"
                  ></shopify-variant-selector>
                  <shopify-money
                    query="product.selectedOrFirstAvailableVariant.price"
                    style="font-weight: bold; color: #333; display: block; margin: 0.5rem 0;"
                  ></shopify-money>
                </div>
              </template>
            </shopify-context>
          `
        )}
      </div>
    `
  }
}

export const SingleProduct: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <script type="module" src="https://cdn.shopify.com/storefront/web-components.js"></script>
      <shopify-store store-domain="${args.root}"></shopify-store>

      <shopify-context type="product" handle="${handles[0]}">
        <template>
          <div style="border: 1px solid #e0e0e0; padding: 1rem; border-radius: 8px;">
            <shopify-variant-selector></shopify-variant-selector>
          </div>
        </template>
      </shopify-context>
    `
  }
}

export const InProductCard: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <script type="module" src="https://cdn.shopify.com/storefront/web-components.js"></script>
      <shopify-store store-domain="${args.root}"></shopify-store>

      <shopify-context type="product" handle="${handles[0]}">
        <template>
          <div class="product-card" style="border: 1px solid #e0e0e0; padding: 1rem; border-radius: 8px;">
            <shopify-media
              query="product.selectedOrFirstAvailableVariant.image"
              style="width: 100%; height: auto;"
            ></shopify-media>
            <h3 style="font-size: 1.2rem; margin: 0.5rem 0;">
              <shopify-data query="product.title"></shopify-data>
            </h3>
            <shopify-variant-selector style="margin: 1rem 0; display: block;"></shopify-variant-selector>
            <shopify-money
              query="product.selectedOrFirstAvailableVariant.price"
              style="font-weight: bold; font-size: 1.1rem; color: #333; display: block; margin: 0.5rem 0;"
            ></shopify-money>
          </div>
        </template>
      </shopify-context>
    `
  }
}

export const InProductCard_AddToCart: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <script type="module" src="https://cdn.shopify.com/storefront/web-components.js"></script>
      <shopify-store store-domain="${args.root}"></shopify-store>

      <shopify-context type="product" handle="${handles[0]}">
        <template>
          <div class="product-card" style="border: 1px solid #e0e0e0; padding: 1rem; border-radius: 8px;">
            <shopify-media
              query="product.selectedOrFirstAvailableVariant.image"
              style="width: 100%; height: auto;"
            ></shopify-media>
            <h3 style="font-size: 1.2rem; margin: 0.5rem 0;">
              <shopify-data query="product.title"></shopify-data>
            </h3>
            <shopify-variant-selector style="margin: 1rem 0; display: block;"></shopify-variant-selector>
            <shopify-money
              query="product.selectedOrFirstAvailableVariant.price"
              style="font-weight: bold; font-size: 1.1rem; color: #333; display: block; margin: 0.5rem 0;"
            ></shopify-money>
            <button
              style="margin-top: 1rem; padding: 0.5rem 1rem; background: #000; color: #fff; border: none; border-radius: 4px; cursor: pointer; width: 100%;"
            >
              Add to cart
            </button>
          </div>
        </template>
      </shopify-context>
    `
  }
}

export const MultipleProducts: Story = {
  argTypes: {
    columns: {
      description: "Number of columns to display in the grid",
      control: { type: "range", min: 1, max: 8, step: 1 }
    }
  },
  args: {
    columns: 3
  },
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <script type="module" src="https://cdn.shopify.com/storefront/web-components.js"></script>
      <shopify-store store-domain="${args.root}"></shopify-store>

      <div
        style="display: grid; grid-template-columns: repeat(${args.columns}, 1fr); gap: 1rem; padding: 0.1rem; max-width: 1200px;"
      >
        ${handles.slice(0, 6).map(
          handle => html`
            <shopify-context type="product" handle="${handle}">
              <template>
                <div class="product-card" style="border: 1px solid #e0e0e0; padding: 1rem; border-radius: 8px;">
                  <shopify-media
                    query="product.selectedOrFirstAvailableVariant.image"
                    style="width: 100%; height: auto;"
                  ></shopify-media>
                  <h3 style="font-size: 1rem; margin: 0.5rem 0;">
                    <shopify-data query="product.title"></shopify-data>
                  </h3>
                  <shopify-variant-selector
                    style="margin: 0.5rem 0; display: block; font-size: 0.9rem;"
                  ></shopify-variant-selector>
                  <shopify-money
                    query="product.selectedOrFirstAvailableVariant.price"
                    style="font-weight: bold; color: #333; display: block; margin: 0.5rem 0;"
                  ></shopify-money>
                </div>
              </template>
            </shopify-context>
          `
        )}
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "Display multiple products with variant selectors in a grid layout. Each product card shows the selected variant's image and price."
      }
    }
  }
}

export const WithShopPayButton: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <script type="module" src="https://cdn.shopify.com/storefront/web-components.js"></script>
      <script
        src="https://cdn.shopify.com/shopifycloud/shop-js/modules/v2/loader.pay-button.esm.js"
        type="module"
      ></script>
      <shopify-store store-domain="${args.root}"></shopify-store>

      <shopify-context type="product" handle="${handles[0]}">
        <template>
          <div class="product-card" style="border: 1px solid #e0e0e0; padding: 1rem; border-radius: 8px;">
            <shopify-media
              query="product.selectedOrFirstAvailableVariant.image"
              style="width: 100%; height: auto;"
            ></shopify-media>
            <h3 style="font-size: 1.2rem; margin: 0.5rem 0;">
              <shopify-data query="product.title"></shopify-data>
            </h3>
            <shopify-variant-selector style="margin: 1rem 0; display: block;"></shopify-variant-selector>
            <shopify-money
              query="product.selectedOrFirstAvailableVariant.price"
              style="font-weight: bold; font-size: 1.1rem; color: #333; display: block; margin: 0.5rem 0;"
            ></shopify-money>
            <button
              style="margin-top: 1rem; padding: 0.5rem 1rem; background: #000; color: #fff; border: none; border-radius: 4px; cursor: pointer; width: 100%; margin-bottom: 0.5rem;"
            >
              Add to cart
            </button>
            <shop-pay-button store-url="https://${args.root}"></shop-pay-button>
          </div>
        </template>
      </shopify-context>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example with Shop Pay button integration for accelerated checkout. Note: Shop Pay button requires proper Shopify store configuration and may not work in all environments."
      }
    }
  }
}
