import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import "./SimpleCard.stories.css"

const meta: Meta = {
  title: "Components/SimpleCard",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The SimpleCard component displays a product card using Shopify product data fetched from the product's JSON endpoint.

## Features
- Fetches product data from \`/products/{handle}.js\` endpoint
- Configurable attributes for brand, discount, rating, and alternate image
- Shadow DOM with CSS variables for styling
- Responsive design with hover effects
- Error handling for failed requests

## CSS Variables
- \`--nosto-simple-card-background\`: Card background color
- \`--nosto-simple-card-border\`: Card border
- \`--nosto-simple-card-border-radius\`: Card border radius  
- \`--nosto-simple-card-padding\`: Card padding
- \`--nosto-simple-card-shadow\`: Card shadow
- \`--nosto-simple-card-text-color\`: Text color
- \`--nosto-simple-card-title-color\`: Title color
- \`--nosto-simple-card-price-color\`: Price color
- \`--nosto-simple-card-compare-price-color\`: Compare price color
- \`--nosto-simple-card-brand-color\`: Brand color
- \`--nosto-simple-card-discount-color\`: Discount badge color
        `
      }
    }
  }
}

export default meta
type Story = StoryObj

function createCardDemo(title: string, description: string, card: unknown) {
  return html`
    <div class="demo-section">
      <h3 class="demo-title">${title}</h3>
      <p class="demo-description">${description}</p>
      <div class="card-container">${card}</div>
    </div>
  `
}

export const Default: Story = {
  render: () => html`
    <div class="story-container">
      ${createCardDemo(
        "Basic Product Card",
        "Simple product card with title, image, and price",
        html`<nosto-simple-card handle="awesome-test-product"></nosto-simple-card>`
      )}
    </div>
  `
}

export const WithBrand: Story = {
  render: () => html`
    <div class="story-container">
      ${createCardDemo(
        "With Brand",
        "Product card showing brand/vendor information",
        html`<nosto-simple-card handle="awesome-test-product" brand></nosto-simple-card>`
      )}
    </div>
  `
}

export const WithDiscount: Story = {
  render: () => html`
    <div class="story-container">
      ${createCardDemo(
        "With Discount",
        "Product card showing discount information and compare price",
        html`<nosto-simple-card handle="awesome-test-product" discount></nosto-simple-card>`
      )}
    </div>
  `
}

export const WithRating: Story = {
  render: () => html`
    <div class="story-container">
      ${createCardDemo(
        "With Rating",
        "Product card showing star rating and review count",
        html`<nosto-simple-card handle="awesome-test-product" rating></nosto-simple-card>`
      )}
    </div>
  `
}

export const WithAlternateImage: Story = {
  render: () => html`
    <div class="story-container">
      ${createCardDemo(
        "With Alternate Image",
        "Product card that shows an alternate image on hover",
        html`<nosto-simple-card handle="awesome-test-product" alternate></nosto-simple-card>`
      )}
    </div>
  `
}

export const AllFeatures: Story = {
  render: () => html`
    <div class="story-container">
      ${createCardDemo(
        "All Features",
        "Product card with all optional features enabled",
        html`<nosto-simple-card handle="awesome-test-product" brand discount rating alternate> </nosto-simple-card>`
      )}
    </div>
  `
}

export const ErrorState: Story = {
  render: () => html`
    <div class="story-container">
      ${createCardDemo(
        "Error State",
        "Product card when the product handle doesn't exist",
        html`<nosto-simple-card handle="non-existent-product"></nosto-simple-card>`
      )}
    </div>
  `
}

export const CustomStyling: Story = {
  render: () => html`
    <div class="story-container">
      <style>
        .custom-card {
          --nosto-simple-card-background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --nosto-simple-card-border: none;
          --nosto-simple-card-border-radius: 16px;
          --nosto-simple-card-padding: 24px;
          --nosto-simple-card-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          --nosto-simple-card-text-color: white;
          --nosto-simple-card-title-color: white;
          --nosto-simple-card-price-color: #ffeb3b;
          --nosto-simple-card-brand-color: #e1bee7;
          width: 300px;
        }
      </style>
      ${createCardDemo(
        "Custom Styling",
        "Product card with custom CSS variables applied",
        html`<nosto-simple-card class="custom-card" handle="awesome-test-product" brand discount rating>
        </nosto-simple-card>`
      )}
    </div>
  `
}

export const GridLayout: Story = {
  render: () => html`
    <div class="story-container">
      <h3 class="demo-title">Product Grid</h3>
      <p class="demo-description">Multiple product cards in a grid layout</p>

      <div class="product-grid">
        <nosto-simple-card handle="awesome-test-product"></nosto-simple-card>
        <nosto-simple-card handle="awesome-test-product" brand></nosto-simple-card>
        <nosto-simple-card handle="awesome-test-product" discount></nosto-simple-card>
        <nosto-simple-card handle="awesome-test-product" rating alternate></nosto-simple-card>
      </div>
    </div>
  `
}
