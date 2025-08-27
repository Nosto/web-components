import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"

const meta: Meta = {
  title: "Components/NostoSkuOptions",
  component: "nosto-sku-options",
  parameters: {
    docs: {
      description: {
        component:
          "A custom element that manages SKU (Stock Keeping Unit) options in a product selection interface. Must be used within a NostoProduct component."
      }
    }
  },
  argTypes: {
    name: {
      control: "text",
      description: "Required. The identifier for this option group."
    }
  }
}

export default meta
type Story = StoryObj

const storyStyles = html`
  <style>
    .story-container {
      font-family:
        Albert Sans,
        sans-serif;
      padding: 20px;
    }

    .demo-section {
      margin-bottom: 40px;
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 20px;
    }

    .demo-title {
      font-size: 1.4rem;
      font-weight: bold;
      margin-bottom: 16px;
      color: #333;
    }

    .demo-description {
      margin-bottom: 20px;
      color: #666;
      font-size: 0.9rem;
    }

    nosto-product {
      display: block;
      max-width: 400px;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      background: white;
    }

    .product-image {
      width: 100%;
      height: 200px;
      background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      color: #999;
    }

    .product-name {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: #ff66bf;
    }

    .product-price {
      font-size: 1.1rem;
      font-weight: bold;
      margin-bottom: 16px;
      color: #333;
    }

    .sku-options-group {
      margin-bottom: 16px;
    }

    .sku-group-label {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 8px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    nosto-sku-options {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    nosto-sku-options span {
      padding: 8px 16px;
      border: 2px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.9rem;
      font-weight: 500;
      user-select: none;
    }

    nosto-sku-options span:hover {
      border-color: #ff66bf;
      background: rgba(255, 102, 191, 0.1);
    }

    nosto-sku-options span[selected] {
      background-color: #ff66bf;
      border-color: #ff66bf;
      color: white;
    }

    nosto-sku-options span[disabled] {
      opacity: 0.3;
      cursor: not-allowed;
      background: #f5f5f5;
      border-color: #ccc;
    }

    nosto-sku-options span[disabled]:hover {
      border-color: #ccc;
      background: #f5f5f5;
    }

    .btn__atc {
      width: 100%;
      padding: 12px 20px;
      border-radius: 6px;
      border: none;
      background: #ff66bf;
      color: #fff;
      cursor: pointer;
      font-weight: 600;
      font-size: 1rem;
      transition: background-color 0.2s;
      margin-top: 16px;
    }

    .btn__atc:hover {
      background: #e555a8;
    }

    .btn__atc:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .color-option {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      padding: 0 !important;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0;
    }

    .color-option.black {
      background-color: #000;
    }
    .color-option.white {
      background-color: #fff;
      border: 2px solid #ddd;
    }
    .color-option.blue {
      background-color: #007bff;
    }
    .color-option.red {
      background-color: #dc3545;
    }
    .color-option.green {
      background-color: #28a745;
    }

    .size-option {
      min-width: 40px;
      height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
  </style>
`

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
  render: () => html`
    ${storyStyles}
    <div class="story-container">
      <div class="demo-section">
        <div class="demo-title">Basic Color Options</div>
        <div class="demo-description">Simple color selection with visual feedback. One option is preselected.</div>
        <nosto-product product-id="demo-product-1" reco-id="storybook-demo">
          <div class="product-image">Product Image</div>
          <div class="product-name">Stylish T-Shirt</div>
          <div class="product-price" n-price>$29.99</div>

          <div class="sku-options-group">
            <div class="sku-group-label">Color</div>
            <nosto-sku-options name="colors">
              <span n-option n-skus="123,145" selected>Black</span>
              <span n-option n-skus="223,234,245">White</span>
              <span n-option n-skus="334,345">Blue</span>
            </nosto-sku-options>
          </div>

          <button class="btn__atc" n-atc>Add to cart</button>

          <script type="application/json" n-sku-data>
            ${JSON.stringify([
              { id: "123", price: "$29.99" },
              { id: "145", price: "$29.99" },
              { id: "223", price: "$29.99" },
              { id: "234", price: "$29.99" },
              { id: "245", price: "$29.99" },
              { id: "334", price: "$29.99" },
              { id: "345", price: "$29.99" }
            ])}
          </script>
        </nosto-product>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: "Basic color selection options with one preselected option."
      }
    }
  }
}

export const ColorAndSizeOptions: Story = {
  render: () => html`
    ${storyStyles}
    <div class="story-container">
      <div class="demo-section">
        <div class="demo-title">Color and Size Options</div>
        <div class="demo-description">
          Two option groups working together. Selecting options in one group affects availability in the other.
        </div>
        <nosto-product product-id="demo-product-2" reco-id="storybook-demo">
          <div class="product-image">Product Image</div>
          <div class="product-name">Designer Jeans</div>
          <div class="product-price" n-price>$89.99</div>

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

          <button class="btn__atc" n-atc>Add to cart</button>
        </nosto-product>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: "Two option groups (color and size) that work together to select different SKUs."
      }
    }
  }
}

export const OutOfStockHandling: Story = {
  render: () => html`
    ${storyStyles}
    <div class="story-container">
      <div class="demo-section">
        <div class="demo-title">Out of Stock Handling</div>
        <div class="demo-description">
          Demonstrates how options are disabled when they lead to out-of-stock SKUs (OOS = 145, 234).
        </div>
        <nosto-product product-id="demo-product-3" reco-id="storybook-demo">
          <div class="product-image">Product Image</div>
          <div class="product-name">Premium Hoodie</div>
          <div class="product-price" n-price>$69.99</div>

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
              <span n-option n-skus="123,223" title="Black,White,Cotton,Silk" n-price="$69.99" class="size-option"
                >L</span
              >
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

          <button class="btn__atc" n-atc>Add to cart</button>
        </nosto-product>
      </div>
    </div>
  `,
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
  render: () => html`
    ${storyStyles}
    <style>
      .color-option.black {
        background-color: #000;
      }
      .color-option.white {
        background-color: #fff;
        border: 2px solid #ddd;
      }
      .color-option.blue {
        background-color: #007bff;
      }
      .color-option.red {
        background-color: #dc3545;
      }
      .color-option.green {
        background-color: #28a745;
      }
    </style>
    <div class="story-container">
      <div class="demo-section">
        <div class="demo-title">Visual Color Options</div>
        <div class="demo-description">Color options displayed as colored circles for better visual representation.</div>
        <nosto-product product-id="demo-product-4" reco-id="storybook-demo">
          <div class="product-image">Product Image</div>
          <div class="product-name">Canvas Sneakers</div>
          <div class="product-price" n-price>$79.99</div>

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

          <button class="btn__atc" n-atc>Add to cart</button>
        </nosto-product>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: "Color options displayed as visual color swatches instead of text."
      }
    }
  }
}

export const PricingChanges: Story = {
  render: () => html`
    ${storyStyles}
    <div class="story-container">
      <div class="demo-section">
        <div class="demo-title">Dynamic Pricing</div>
        <div class="demo-description">
          Watch how the price changes when you select different options. Different sizes have different prices.
        </div>
        <nosto-product product-id="demo-product-5" reco-id="storybook-demo">
          <div class="product-image">Product Image</div>
          <div class="product-name">Premium Watch</div>
          <div class="product-price" n-price>$199.99</div>

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

          <button class="btn__atc" n-atc>Add to cart</button>
        </nosto-product>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: "Demonstrates how selecting different options can change the displayed price dynamically."
      }
    }
  }
}
