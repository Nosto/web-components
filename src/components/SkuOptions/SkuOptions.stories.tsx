import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import "./SkuOptions.stories.css"

function createDemoProduct(
  productId: string,
  productName: string,
  price: string,
  skuContent: unknown,
  skuData?: unknown[]
) {
  return html`
    <nosto-product product-id="${productId}" reco-id="storybook-demo">
      <div class="product-image">Product Image</div>
      <div class="product-name">${productName}</div>
      <div class="product-price" n-price>${price}</div>
      ${skuContent}
      <button class="btn__atc" n-atc>Add to cart</button>
      ${skuData
        ? html`<script type="application/json" n-sku-data>
            ${JSON.stringify(skuData)}
          </script>`
        : ""}
    </nosto-product>
  `
}

// Helper function for creating demo section
function createDemoSection(title: string, description: string, content: unknown) {
  return html`
    <div class="story-container">
      <div class="demo-section">
        <div class="demo-title">${title}</div>
        <div class="demo-description">${description}</div>
        ${content}
      </div>
    </div>
  `
}

const meta: Meta = {
  title: "Components/SkuOptions",
  component: "nosto-sku-options",
  parameters: {
    docs: {
      description: {
        component:
          "A custom element that manages SKU (Stock Keeping Unit) options in a product selection interface. Must be used within a Product component."
      }
    }
  },
  argTypes: {
    name: {
      control: "text",
      description: "Required. The identifier for this option group."
    }
  },
  tags: ["autodocs"]
}

export default meta
type Story = StoryObj

// Mock Nosto cart function for stories
if (typeof window !== "undefined") {
  interface NostoWindow extends Window {
    Nosto?: {
      addSkuToCart: (skuId: string, productId: string, recoId: string) => void
    }
  }
  ;(window as NostoWindow).Nosto = {
    addSkuToCart: (skuId: string, productId: string, recoId: string) => {
      console.log("Add to cart clicked:", { skuId, productId, recoId })
      alert(`Added SKU ${skuId} of product ${productId} to cart`)
    }
  }
}

export const BasicColorOptions: Story = {
  render: () => {
    const skuData = [
      { id: "123", price: "$29.99" },
      { id: "145", price: "$29.99" },
      { id: "223", price: "$29.99" },
      { id: "234", price: "$29.99" },
      { id: "245", price: "$29.99" },
      { id: "334", price: "$29.99" },
      { id: "345", price: "$29.99" }
    ]

    const skuContent = html`
      <div class="sku-options-group">
        <div class="sku-group-label">Color</div>
        <nosto-sku-options name="colors">
          <span n-option n-skus="123,145" selected>Black</span>
          <span n-option n-skus="223,234,245">White</span>
          <span n-option n-skus="334,345">Blue</span>
        </nosto-sku-options>
      </div>
    `

    return createDemoSection(
      "Basic Color Options",
      "Simple color selection with visual feedback. One option is preselected.",
      createDemoProduct("demo-product-1", "Stylish T-Shirt", "$29.99", skuContent, skuData)
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Basic color selection options with one preselected option."
      }
    }
  }
}

export const ColorAndSizeOptions: Story = {
  render: () => {
    const skuContent = html`
      <div class="sku-options-group">
        <div class="sku-group-label">Color</div>
        <nosto-sku-options name="colors">
          <span n-option n-skus="123,145" selected>Black</span>
          <span n-option n-skus="223,234,245">White</span>
          <span n-option n-skus="334,345">Blue</span>
        </nosto-sku-options>
      </div>

      <div class="sku-options-group">
        <div class="sku-group-label">Size</div>
        <nosto-sku-options name="sizes">
          <span n-option n-skus="123,223" class="size-option">L</span>
          <span n-option n-skus="234,334" class="size-option">M</span>
          <span n-option n-skus="145,245,345" class="size-option">S</span>
        </nosto-sku-options>
      </div>
    `

    return createDemoSection(
      "Color and Size Options",
      "Two option groups working together. Selecting options in one group affects availability in the other.",
      createDemoProduct("demo-product-2", "Designer Jeans", "$89.99", skuContent)
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Two option groups (color and size) that work together to select different SKUs."
      }
    }
  }
}

export const OutOfStockHandling: Story = {
  render: () => {
    const skuContent = html`
      <div class="sku-options-group">
        <div class="sku-group-label">Color</div>
        <nosto-sku-options name="colors">
          <span n-option n-skus="123" n-skus-oos="145" title="L,S,Cotton,Silk,Wool">Black</span>
          <span n-option n-skus="223,245" n-skus-oos="234" title="L,M,S,Cotton,Silk,Wool">White</span>
          <span n-option n-skus="334,345" title="M,S,Cotton,Silk">Blue</span>
        </nosto-sku-options>
      </div>

      <div class="sku-options-group">
        <div class="sku-group-label">Size</div>
        <nosto-sku-options name="sizes">
          <span n-option n-skus="123,223" title="Black,White,Cotton,Silk" n-price="$69.99" class="size-option">L</span>
          <span
            n-option
            n-skus="334"
            n-skus-oos="234"
            title="White,Blue,Cotton,Silk"
            n-price="$64.99"
            class="size-option"
            >M</span
          >
          <span
            n-option
            n-skus="245,345"
            n-skus-oos="145"
            title="Black,White,Blue,Cotton,Silk,Wool"
            n-price="$59.99"
            class="size-option"
            >S</span
          >
        </nosto-sku-options>
      </div>

      <div class="sku-options-group">
        <div class="sku-group-label">Material</div>
        <nosto-sku-options name="materials">
          <span n-option n-skus="123,345" n-skus-oos="234" title="Black,White,Blue,L,M,S">Cotton</span>
          <span n-option n-skus="223,334" n-skus-oos="145" title="Black,White,Blue,L,M,S">Silk</span>
          <span n-option n-skus="245" title="White,S">Wool</span>
        </nosto-sku-options>
      </div>
    `

    return createDemoSection(
      "Out of Stock Handling",
      "Demonstrates how options are disabled when they lead to out-of-stock SKUs (OOS = 145, 234).",
      createDemoProduct("demo-product-3", "Premium Hoodie", "$69.99", skuContent)
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Three option groups (colors, sizes, materials) with out-of-stock handling. Some options become disabled based on availability."
      }
    }
  }
}

export const VisualColorOptions: Story = {
  render: () => {
    const skuContent = html`
      <div class="sku-options-group">
        <div class="sku-group-label">Color</div>
        <nosto-sku-options name="colors">
          <span n-option n-skus="100" class="color-option black" title="Black">Black</span>
          <span n-option n-skus="200" class="color-option white" title="White" selected>White</span>
          <span n-option n-skus="300" class="color-option blue" title="Blue">Blue</span>
          <span n-option n-skus="400" class="color-option red" title="Red">Red</span>
          <span n-option n-skus="500" class="color-option green" title="Green">Green</span>
        </nosto-sku-options>
      </div>
    `

    return createDemoSection(
      "Visual Color Options",
      "Color options displayed as colored circles for better visual representation.",
      createDemoProduct("demo-product-4", "Canvas Sneakers", "$79.99", skuContent)
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Color options displayed as visual color swatches instead of text."
      }
    }
  }
}

export const PricingChanges: Story = {
  render: () => {
    const skuContent = html`
      <div class="sku-options-group">
        <div class="sku-group-label">Size</div>
        <nosto-sku-options name="sizes">
          <span n-option n-skus="watch-38" n-price="$199.99" class="size-option" selected>38mm</span>
          <span n-option n-skus="watch-42" n-price="$249.99" class="size-option">42mm</span>
          <span n-option n-skus="watch-46" n-price="$299.99" class="size-option">46mm</span>
        </nosto-sku-options>
      </div>

      <div class="sku-options-group">
        <div class="sku-group-label">Band Material</div>
        <nosto-sku-options name="bands">
          <span n-option n-skus="watch-38,watch-42,watch-46" selected>Sport Band</span>
          <span n-option n-skus="watch-38-leather,watch-42-leather,watch-46-leather">Leather</span>
          <span n-option n-skus="watch-38-metal,watch-42-metal,watch-46-metal">Metal</span>
        </nosto-sku-options>
      </div>
    `

    return createDemoSection(
      "Dynamic Pricing",
      "Watch how the price changes when you select different options. Different sizes have different prices.",
      createDemoProduct("demo-product-5", "Premium Watch", "$199.99", skuContent)
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates how selecting different options can change the displayed price dynamically."
      }
    }
  }
}
