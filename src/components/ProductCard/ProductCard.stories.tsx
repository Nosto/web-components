import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import "./ProductCard.stories.css"

function generateSampleProducts() {
  return Array.from(new Array(3).keys())
    .slice(0)
    .map(index => {
      const price = (Math.random() * (index + 50)).toFixed(2)
      const listPrice = (parseFloat(price) + Math.random() * 20).toFixed(2)
      return {
        id: `product-${index + 1}`,
        title: `Sample Product ${index + 1}`,
        image: `https://picsum.photos/id/${index + 30}/400/400`,
        price: `$${price}`,
        listPrice: `$${listPrice}`,
        description: `This is a sample product description for product ${index + 1}.`
      }
    })
}

function createProductCardTemplate(id: string) {
  return html`
    <template id="${id}">
      <div class="product-card">
        <div class="product-image">
          <img :src="product.image" :alt="product.title" />
        </div>
        <div class="product-details">
          <h3 class="product-title">{{ product.title }}</h3>
          <p class="product-description">{{ product.description }}</p>
          <div class="product-pricing">
            <span class="product-price" n-price>{{ product.price }}</span>
            <span class="product-list-price" n-list-price>{{ product.listPrice }}</span>
          </div>
          <button class="add-to-cart-btn">Add to Cart</button>
        </div>
      </div>
    </template>
  `
}

function createSimpleTemplate(id: string) {
  return html`
    <template id="${id}">
      <div class="simple-card">
        <img :src="product.image" :alt="product.title" class="simple-image" />
        <div class="simple-content">
          <h4>{{ product.title }}</h4>
          <div class="simple-price" n-price>{{ product.price }}</div>
        </div>
      </div>
    </template>
  `
}

function createDetailedTemplate(id: string) {
  return html`
    <template id="${id}">
      <div class="detailed-card">
        <div class="detailed-image-container">
          <img :src="product.image" :alt="product.title" class="detailed-image" />
          <div class="image-badge">New</div>
        </div>
        <div class="detailed-content">
          <h2 class="detailed-title">{{ product.title }}</h2>
          <p class="detailed-description">{{ product.description }}</p>
          <div class="detailed-pricing">
            <span class="current-price" n-price>{{ product.price }}</span>
            <span class="original-price" n-list-price>{{ product.listPrice }}</span>
          </div>
          <div class="product-actions">
            <button class="btn-primary">Buy Now</button>
            <button class="btn-secondary">Add to Wishlist</button>
          </div>
        </div>
      </div>
    </template>
  `
}

function createProductCardSection(title: string, products: unknown[], templateId: string) {
  return html`
    <div class="story-container">
      <div class="section-title">${title}</div>
      <div class="product-cards-grid">${products}</div>
      ${templateId === "product-card-template" ? createProductCardTemplate(templateId) : ""}
      ${templateId === "simple-template" ? createSimpleTemplate(templateId) : ""}
      ${templateId === "detailed-template" ? createDetailedTemplate(templateId) : ""}
    </div>
  `
}

const meta: Meta = {
  title: "Components/ProductCard",
  component: "nosto-product-card",
  parameters: {
    docs: {
      description: {
        component: "Custom element that renders a product card using a Vue-like template with product data."
      }
    }
  },
  argTypes: {
    template: {
      control: "text",
      description: "Required. The ID of the template element to use for rendering the product card."
    }
  }
}

export default meta
type Story = StoryObj

export const BasicProductCards: Story = {
  render: () => {
    const products = generateSampleProducts()
    const templateId = "product-card-template"

    const productCards = products.map(
      product => html`
        <nosto-product-card template="${templateId}">
          <script type="application/json" product-data>
            ${JSON.stringify(product)}
          </script>
        </nosto-product-card>
      `
    )

    return createProductCardSection("Basic Product Cards", productCards, templateId)
  },
  parameters: {
    docs: {
      description: {
        story: "Basic product cards using JSON data passed through script elements with product-data attribute."
      }
    }
  }
}

export const SimpleProductCards: Story = {
  render: () => {
    const products = generateSampleProducts()
    const templateId = "simple-template"

    const productCards = products.map(
      product => html`
        <nosto-product-card template="${templateId}">
          <script type="application/json" product-data>
            ${JSON.stringify(product)}
          </script>
        </nosto-product-card>
      `
    )

    return createProductCardSection("Simple Product Cards", productCards, templateId)
  },
  parameters: {
    docs: {
      description: {
        story: "Simplified product cards with minimal styling and content."
      }
    }
  }
}

export const DetailedProductCards: Story = {
  render: () => {
    const products = generateSampleProducts().slice(0, 2) // Show fewer for detailed view
    const templateId = "detailed-template"

    const productCards = products.map(
      product => html`
        <nosto-product-card template="${templateId}">
          <script type="application/json" product-data>
            ${JSON.stringify(product)}
          </script>
        </nosto-product-card>
      `
    )

    return createProductCardSection("Detailed Product Cards", productCards, templateId)
  },
  parameters: {
    docs: {
      description: {
        story: "Detailed product cards with enhanced styling, badges, and multiple action buttons."
      }
    }
  }
}

export const DataAttributeCards: Story = {
  render: () => {
    const templateId = "product-card-template"
    const sampleProduct = generateSampleProducts()[0]

    return html`
      <div class="story-container">
        <div class="section-title">Data Attribute Example</div>
        <div class="product-cards-grid">
          <nosto-product-card
            template="${templateId}"
            data-id="${sampleProduct.id}"
            data-title="${sampleProduct.title}"
            data-image="${sampleProduct.image}"
            data-price="${sampleProduct.price}"
            data-list-price="${sampleProduct.listPrice}"
            data-description="${sampleProduct.description}"
          >
          </nosto-product-card>
        </div>
        ${createProductCardTemplate(templateId)}
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Product card using data attributes instead of JSON script element for product data."
      }
    }
  }
}

export const SingleProductCard: Story = {
  render: () => {
    const templateId = "product-card-template"
    const product = {
      id: "demo-product-card",
      title: "Premium Demo Product",
      image: "https://picsum.photos/id/35/400/400",
      price: "$99.99",
      listPrice: "$129.99",
      description: "This is a premium demo product with excellent features and quality."
    }

    return html`
      <div class="story-container">
        <div class="single-product-container">
          <nosto-product-card template="${templateId}">
            <script type="application/json" product-data>
              ${JSON.stringify(product)}
            </script>
          </nosto-product-card>
        </div>
        ${createProductCardTemplate(templateId)}
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Single product card demonstrating the basic usage with controls."
      }
    }
  }
}
