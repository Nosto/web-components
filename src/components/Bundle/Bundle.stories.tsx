/** @jsx createElement */
import { createElement } from "@/utils/jsx"
import type { Meta, StoryObj } from "@storybook/web-components-vite"
import type { JSONProduct } from "@nosto/nosto-js/client"
import { exampleHandlesLoader, updateShopifyShop } from "@/storybook/loader"
import "./Bundle"
import "./Bundle.stories.css"

const shopifyShop = "nosto-shopify1.myshopify.com"
updateShopifyShop(shopifyShop)

const meta: Meta = {
  title: "Components/Bundle",
  component: "nosto-bundle",
  tags: ["autodocs"],
  decorators: [
    (story, context) => {
      // Update Shopify shop hostname if provided via args
      if (context.args?.shopifyShop) {
        updateShopifyShop(context.args.shopifyShop)
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
    const handles = loaded?.handles as string[]
    const products: JSONProduct[] = handles.slice(0, args.products).map(handle => ({ handle }) as JSONProduct)

    return (
      <nosto-bundle products={products}>
        <div class="bundle-grid">
          {products.map(product => (
            <nosto-simple-card handle={product.handle}></nosto-simple-card>
          ))}
        </div>
        <div class="bundle-controls">
          <h4>Complete the Look</h4>
          <ul>
            {products.map(product => (
              <li>
                <input type="checkbox" value={product.handle} checked />
                <label for={`bundle-${product.handle}`}>Include product</label>
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
    const handles = loaded?.handles as string[]
    const products: JSONProduct[] = handles.slice(0, args.products).map(handle => ({ handle }) as JSONProduct)

    return (
      <nosto-bundle products={products}>
        <div class="bundle-grid">
          {products.map(product => (
            <nosto-simple-card handle={product.handle}>
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
