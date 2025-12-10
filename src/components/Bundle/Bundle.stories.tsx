/** @jsx createElement */
import { createElement } from "@/utils/jsx"
import type { Meta, StoryObj } from "@storybook/web-components-vite"
import type { JSONProduct } from "@nosto/nosto-js/client"
import { exampleProductsLoader } from "@/storybook/loader"
import "./Bundle"
import "./Bundle.stories.css"
import { setShopifyShop } from "@/shopify/getShopifyUrl"

const shopifyShop = "nosto-shopify1.myshopify.com"
setShopifyShop(shopifyShop)

const meta: Meta = {
  title: "Components/Bundle",
  component: "nosto-bundle",
  tags: ["autodocs"],
  decorators: [
    (story, context) => {
      // Update Shopify shop hostname if provided via args
      if (context.args?.shopifyShop) {
        setShopifyShop(context.args.shopifyShop)
      }
      return story()
    }
  ],
  loaders: [exampleProductsLoader],
  argTypes: {
    shopifyShop: {
      control: "text",
      description: "The Shopify store hostname"
    },
    products: {
      description: "Number of products to display in the bundle",
      control: { type: "range", min: 2, max: 8, step: 1 },
      table: {
        category: "Layout options"
      }
    }
  },
  args: {
    shopifyShop,
    products: 4
  }
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: (args, { loaded }) => {
    const productsWithTitles = ((loaded?.products as Array<{ handle: string; title: string }>) || []).slice(
      0,
      args.products
    )

    return (
      // @ts-expect-error - Intentionally passing partial JSONProduct objects with only handle and title
      <nosto-bundle products={productsWithTitles as JSONProduct[]}>
        <div class="bundle-grid">
          {productsWithTitles.map(product => (
            <nosto-simple-card handle={product.handle}>
              <nosto-variant-selector handle={product.handle} mode="compact"></nosto-variant-selector>
            </nosto-simple-card>
          ))}
        </div>
        <div class="bundle-controls">
          <h4>Complete the Look</h4>
          <ul>
            {productsWithTitles.map(product => (
              <li>
                (
                {product.handle !== "awesome-sneakers" ? (
                  <input type="checkbox" id={`bundle-${product.handle}`} value={product.handle} checked />
                ) : (
                  <input type="checkbox" id={`bundle-${product.handle}`} value={product.handle} />
                )}
                )<label for={`bundle-${product.handle}`}>Include {product.title}</label>
              </li>
            ))}
          </ul>
          <button n-atc>Add Bundle to Cart</button>
          <span n-summary-price></span>
        </div>
      </nosto-bundle>
    )
  }
}

export const CheckboxCard: Story = {
  render: (args, { loaded }) => {
    const productsWithTitles = ((loaded?.products as Array<{ handle: string; title: string }>) || []).slice(
      0,
      args.products
    )

    return (
      // @ts-expect-error - Intentionally passing partial JSONProduct objects with only handle and title
      <nosto-bundle products={productsWithTitles as JSONProduct[]}>
        <div class="bundle-grid">
          {productsWithTitles.map(product => (
            <nosto-simple-card handle={product.handle}>
              <nosto-variant-selector handle={product.handle} mode="compact"></nosto-variant-selector>
              <input type="checkbox" value={product.handle} checked />
            </nosto-simple-card>
          ))}
        </div>
        <div class="bundle-summary">
          <button n-atc>Add Bundle to Cart</button>
          <span n-summary-price></span>
        </div>
      </nosto-bundle>
    )
  }
}
