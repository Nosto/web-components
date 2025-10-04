import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import "./ProductCard.stories.css"

// Storybook decorator for wrapping stories with container styling
const withStoryContainer = (story: () => unknown) => html`
  <div class="story-container">
    <div class="demo-section">${story()}</div>
  </div>
`

const meta: Meta = {
  title: "Components/ProductCard",
  component: "nosto-product-card",
  decorators: [withStoryContainer],
  parameters: {
    docs: {
      description: {
        component:
          "A custom element that renders a product card using a Vue-like template. It can receive product data either through a JSON script tag or data attributes."
      }
    }
  },
  argTypes: {
    template: {
      control: "text",
      description: "The ID of the template to use for rendering the product card."
    }
  },
  tags: ["autodocs"]
}

export default meta
type Story = StoryObj

export const BasicProductCard: Story = {
  render: () => {
    return html`
      <nosto-product-card>
        <template>
          <div class="product-card">
            <img :src="product.image" :alt="product.title" class="product-image" />
            <div class="product-info">
              <h3 class="product-title">{{ product.title }}</h3>
              <div class="product-price">
                <span class="current-price" n-price>{{ product.price }}</span>
                <span class="list-price" n-list-price v-if="product.listPrice">{{ product.listPrice }}</span>
              </div>
              <button class="add-to-cart-btn">Add to Cart</button>
            </div>
          </div>
        </template>
        <script type="application/json" product-data>
          {
            "id": "wireless-headphones",
            "image": "https://picsum.photos/300/300?random=1",
            "title": "Wireless Noise-Canceling Headphones",
            "price": "$129.99",
            "listPrice": "$159.99"
          }
        </script>
      </nosto-product-card>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Basic product card with JSON data provided via script tag."
      }
    }
  }
}

export const DataAttributesCard: Story = {
  render: () => {
    return html`
      <nosto-product-card
        data-id="smart-watch"
        data-image="https://picsum.photos/300/300?random=2"
        data-title="Smart Fitness Watch"
        data-price="$299.99"
        data-description="Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS."
      >
        <template>
          <div class="product-card compact">
            <div class="product-header">
              <img :src="product.image" :alt="product.title" class="product-image-small" />
              <div class="product-details">
                <h4 class="product-title">{{ product.title }}</h4>
                <div class="product-price">{{ product.price }}</div>
              </div>
            </div>
            <p class="product-description">{{ product.description }}</p>
            <div class="product-actions">
              <button class="btn-primary">Buy Now</button>
              <button class="btn-secondary">Add to Wishlist</button>
            </div>
          </div>
        </template>
      </nosto-product-card>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Product card using data attributes to provide product information."
      }
    }
  }
}

export const GridLayout: Story = {
  render: () => {
    const products = [
      {
        id: "laptop-stand",
        image: "https://picsum.photos/300/300?random=3",
        title: "Adjustable Laptop Stand",
        category: "Electronics",
        price: "$79.99",
        listPrice: "$99.99",
        badge: "Sale",
        rating: "★★★★★",
        reviews: "127"
      },
      {
        id: "phone-case",
        image: "https://picsum.photos/300/300?random=4",
        title: "Premium Phone Case",
        category: "Accessories",
        price: "$24.99",
        rating: "★★★★☆",
        reviews: "89"
      },
      {
        id: "coffee-mug",
        image: "https://picsum.photos/300/300?random=5",
        title: "Insulated Travel Mug",
        category: "Home & Kitchen",
        price: "$19.99",
        listPrice: "$29.99",
        badge: "New",
        rating: "★★★★★",
        reviews: "203"
      },
      {
        id: "desk-lamp",
        image: "https://picsum.photos/300/300?random=6",
        title: "LED Desk Lamp",
        category: "Home & Office",
        price: "$45.99",
        rating: "★★★☆☆",
        reviews: "34"
      }
    ]

    return html`
      <div class="products-grid">
        ${products.map(
          product => html`
            <nosto-product-card>
              <template>
                <div class="product-card grid-card">
                  <div class="product-image-container">
                    <img :src="product.image" :alt="product.title" class="product-image" />
                    <div class="product-badge" v-if="product.badge">{{ product.badge }}</div>
                  </div>
                  <div class="product-content">
                    <div class="product-category">{{ product.category }}</div>
                    <h3 class="product-title">{{ product.title }}</h3>
                    <div class="product-rating">
                      <span class="stars">{{ product.rating || '★★★★☆' }}</span>
                      <span class="review-count">({{ product.reviews || '0' }} reviews)</span>
                    </div>
                    <div class="product-price">
                      <span class="current-price">{{ product.price }}</span>
                      <span class="list-price" v-if="product.listPrice">{{ product.listPrice }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <script type="application/json" product-data>
                ${JSON.stringify(product)}
              </script>
            </nosto-product-card>
          `
        )}
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Multiple product cards displayed in a responsive grid layout with enhanced product information."
      }
    }
  }
}

export const MinimalCard: Story = {
  render: () => {
    return html`
      <div class="minimal-grid">
        <nosto-product-card>
          <template>
            <div class="product-card minimal">
              <img :src="product.image" :alt="product.title" class="product-image" />
              <div class="product-name">{{ product.title }}</div>
              <div class="product-price">{{ product.price }}</div>
            </div>
          </template>
          <script type="application/json" product-data>
            {
              "id": "book",
              "image": "https://picsum.photos/200/300?random=7",
              "title": "The Design of Everyday Things",
              "price": "$16.99"
            }
          </script>
        </nosto-product-card>
        <nosto-product-card>
          <template>
            <div class="product-card minimal">
              <img :src="product.image" :alt="product.title" class="product-image" />
              <div class="product-name">{{ product.title }}</div>
              <div class="product-price">{{ product.price }}</div>
            </div>
          </template>
          <script type="application/json" product-data>
            {
              "id": "notebook",
              "image": "https://picsum.photos/200/300?random=8",
              "title": "Premium Leather Notebook",
              "price": "$34.99"
            }
          </script>
        </nosto-product-card>
        <nosto-product-card>
          <template>
            <div class="product-card minimal">
              <img :src="product.image" :alt="product.title" class="product-image" />
              <div class="product-name">{{ product.title }}</div>
              <div class="product-price">{{ product.price }}</div>
            </div>
          </template>
          <script type="application/json" product-data>
            {
              "id": "pen",
              "image": "https://picsum.photos/200/300?random=9",
              "title": "Executive Fountain Pen",
              "price": "$89.99"
            }
          </script>
        </nosto-product-card>
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story: "Minimal product card design focusing on clean aesthetics and essential product information."
      }
    }
  }
}
