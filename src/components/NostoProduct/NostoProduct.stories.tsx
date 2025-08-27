import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import "./NostoProduct.stories.css"

function generateSampleProducts() {
  return Array.from(new Array(3).keys())
    .slice(0)
    .map(index => {
      const price = (Math.random() * (index + 50)).toFixed(2)
      return {
        name: `Product ${index + 1}`,
        productId: `product-${index + 1}`,
        imageUrl: `https://picsum.photos/id/${index + 20}/800/800`,
        price,
        priceCurrencyCode: "EUR"
      }
    })
}

const meta: Meta = {
  title: "Components/NostoProduct",
  component: "nosto-product",
  parameters: {
    docs: {
      description: {
        component:
          "Custom element that represents a Nosto product component with SKU selection and add-to-cart functionality."
      }
    }
  },
  argTypes: {
    productId: {
      control: "text",
      description: "Required. The ID of the product."
    },
    recoId: {
      control: "text",
      description: "Required. The recommendation slot ID."
    }
  }
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
      alert(`Added SKU ${skuId} of product ${productId} to cart (Recommendation: ${recoId})`)
    }
  }
}

export const DualSkuSelection: Story = {
  render: () => {
    const products = generateSampleProducts()

    return html`
      <div class="story-container">
        <div class="block__recommendation">
          <span class="reco-title">Dual SKU Selection</span>
          <div class="products">
            ${products.map(
              product => html`
                <nosto-product product-id="${product.productId}" reco-id="storybook-demo">
                  <div class="nosto__product-image">
                    <img src="${product.imageUrl}" alt="${product.name}" width="300" height="300" />
                  </div>
                  <div class="nosto__product-details--card">
                    <div class="nosto__product-name">${product.name}</div>
                    <div class="nosto__product-price" n-price>EUR ${product.price}</div>
                    <div class="nosto__product-skus">
                      <nosto-sku-options name="colors">
                        <span n-option n-skus="123,145" selected>Black</span>
                        <span n-option n-skus="223,234,245">White</span>
                        <span n-option n-skus="334,345">Blue</span>
                      </nosto-sku-options>
                      <nosto-sku-options name="sizes">
                        <span n-option n-skus="123,223">L</span>
                        <span n-option n-skus="234,334">M</span>
                        <span n-option n-skus="145,245,345">S</span>
                      </nosto-sku-options>
                    </div>
                    <button class="btn__atc" n-atc>Add to cart</button>
                  </div>
                  <script type="application/json" n-sku-data>
                    ${JSON.stringify([
                      { id: "123", price: "EUR 20" },
                      { id: "223", price: "EUR 20" },
                      { id: "234", price: "EUR 15" },
                      { id: "334", price: "EUR 15" },
                      { id: "145", price: "EUR 10" },
                      { id: "245", price: "EUR 10" },
                      { id: "345", price: "EUR 10" }
                    ])}
                  </script>
                </nosto-product>
              `
            )}
          </div>
        </div>
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "Product component with dual SKU selection (colors and sizes) based on the dual template from dev folder."
      }
    }
  }
}

export const TripleSkuSelection: Story = {
  render: () => {
    const products = generateSampleProducts().slice(0, 2) // Show fewer products for this complex example

    return html`
      <div class="story-container">
        <div class="block__recommendation">
          <span class="reco-title">Triple SKU Selection</span>
          <div class="products">
            ${products.map(
              product => html`
                <nosto-product product-id="${product.productId}" reco-id="storybook-demo">
                  <div class="nosto__product-image">
                    <img src="${product.imageUrl}" alt="${product.name}" width="300" height="300" />
                  </div>
                  <div class="nosto__product-details--card">
                    <div class="nosto__product-name">${product.name}</div>
                    <div class="nosto__product-price" n-price>EUR ${product.price}</div>
                    <div class="nosto__product-skus">
                      <!-- OOS = 145, 234 -->
                      <nosto-sku-options name="colors">
                        <span black n-option n-skus="123" n-skus-oos="145" title="L,S,Cotton,Silk,Wool">Black</span>
                        <span white n-option n-skus="223,245" n-skus-oos="234" title="L,M,S,Cotton,Silk,Wool"
                          >White</span
                        >
                        <span blue n-option n-skus="334,345" title="M,S,Cotton,Silk">Blue</span>
                      </nosto-sku-options>
                      <nosto-sku-options name="sizes">
                        <span l n-option n-skus="123,223" title="Black,White,Cotton,Silk" n-price="EUR 20">L</span>
                        <span m n-option n-skus="334" n-skus-oos="234" title="White,Blue,Cotton,Silk" n-price="EUR 15"
                          >M</span
                        >
                        <span
                          s
                          n-option
                          n-skus="245,345"
                          n-skus-oos="145"
                          title="Black,White,Blue,Cotton,Silk,Wool"
                          n-price="EUR 10"
                          >S</span
                        >
                      </nosto-sku-options>
                      <nosto-sku-options name="materials">
                        <span cotton n-option n-skus="123,345" n-skus-oos="234" title="Black,White,Blue,L,M,S"
                          >Cotton</span
                        >
                        <span silk n-option n-skus="223,334" n-skus-oos="145" title="Black,White,Blue,L,M,S">Silk</span>
                        <span wool n-option n-skus="245" title="White,S">Wool</span>
                      </nosto-sku-options>
                    </div>
                    <button class="btn__atc" n-atc>Add to cart</button>
                  </div>
                </nosto-product>
              `
            )}
          </div>
        </div>
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "Product component with triple SKU selection (colors, sizes, and materials) with out-of-stock handling, based on the trio template from dev folder."
      }
    }
  }
}

export const DropdownSkuSelection: Story = {
  render: () => {
    const products = generateSampleProducts()

    return html`
      <div class="story-container">
        <div class="block__recommendation">
          <span class="reco-title">Dropdown SKU Selection</span>
          <div class="products">
            ${products.map(
              product => html`
                <nosto-product product-id="${product.productId}" reco-id="storybook-demo">
                  <div class="nosto__product-image">
                    <img src="${product.imageUrl}" alt="${product.name}" width="300" height="300" />
                  </div>
                  <div class="nosto__product-details--card">
                    <div class="nosto__product-name">${product.name}</div>
                    <div class="nosto__product-price">EUR ${product.price}</div>
                    <div class="nosto__product-skus">
                      <select n-sku-selector id="select__product-${product.productId}" class="select__product">
                        <option value="sku1">XS</option>
                        <option value="sku2">S</option>
                        <option value="sku3">M</option>
                        <option value="sku4">L</option>
                      </select>
                    </div>
                    <button class="btn__atc" n-atc>Add to cart</button>
                  </div>
                </nosto-product>
              `
            )}
          </div>
        </div>
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Product component with dropdown SKU selection based on the select template from dev folder."
      }
    }
  }
}

export const SingleProduct: Story = {
  render: () => html`
    <div class="story-container">
      <nosto-product product-id="demo-product" reco-id="demo-reco">
        <div class="nosto__product-image">
          <img src="https://picsum.photos/id/25/800/800" alt="Demo Product" width="300" height="300" />
        </div>
        <div class="nosto__product-details--card">
          <div class="nosto__product-name">Demo Product</div>
          <div class="nosto__product-price" n-price>EUR 49.99</div>
          <div class="nosto__product-skus">
            <nosto-sku-options name="colors">
              <span n-option n-skus="abc123" selected>Red</span>
              <span n-option n-skus="def456">Blue</span>
              <span n-option n-skus="ghi789">Green</span>
            </nosto-sku-options>
          </div>
          <button class="btn__atc" n-atc>Add to cart</button>
        </div>
        <script type="application/json" n-sku-data>
          ${JSON.stringify([
            { id: "abc123", price: "EUR 49.99" },
            { id: "def456", price: "EUR 54.99" },
            { id: "ghi789", price: "EUR 44.99" }
          ])}
        </script>
      </nosto-product>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: "Single product component demonstrating the basic usage with controls."
      }
    }
  }
}
