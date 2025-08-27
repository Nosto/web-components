import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import "./NostoImage.stories.css"

const sampleImages = [
  {
    name: "BigCommerce product",
    imageUrl:
      "https://cdn11.bigcommerce.com/s-hm8pjhul3k/products/4055/images/23603/7-15297__04892.1719977920.1280.1280.jpg"
  },
  {
    name: "Shopify product",
    imageUrl: "https://cdn.shopify.com/s/files/1/1183/1048/products/boat-shoes.jpeg?v=1459175177"
  },
  {
    name: "Picsum placeholder",
    imageUrl: "https://picsum.photos/id/25/800/800"
  }
]

const meta: Meta = {
  title: "Components/NostoImage",
  component: "nosto-image",
  parameters: {
    docs: {
      description: {
        component:
          "NostoImage is a custom element that renders responsive images with support for Shopify and BigCommerce image transformations."
      }
    }
  },
  argTypes: {
    src: {
      control: "text",
      description: "The source URL of the image."
    },
    width: {
      control: "number",
      description: "The width of the image in pixels."
    },
    height: {
      control: "number",
      description: "The height of the image in pixels."
    },
    aspectRatio: {
      control: "number",
      description: "The aspect ratio of the image (width / height value)."
    },
    layout: {
      control: { type: "select" },
      options: ["constrained", "fullWidth", "fixed"],
      description: "The layout of the image."
    },
    crop: {
      control: { type: "select" },
      options: ["center", "left", "right", "top", "bottom"],
      description: "Shopify only. The crop of the image."
    }
  }
}

export default meta
type Story = StoryObj

export const Constrained: Story = {
  args: {
    src: "https://picsum.photos/id/25/800/800",
    width: 400,
    height: 300,
    layout: "constrained"
  },
  render: args => html`
    <div class="story-container">
      <div class="image-demo-section">
        <div class="image-demo-title">Constrained Layout</div>
        <nosto-image src="${args.src}" width="${args.width}" height="${args.height}" layout="${args.layout}">
        </nosto-image>
      </div>
    </div>
  `
}

export const FullWidth: Story = {
  args: {
    src: "https://picsum.photos/id/30/800/600",
    height: 400,
    layout: "fullWidth"
  },
  render: args => html`
    <div class="story-container">
      <div class="image-demo-section">
        <div class="image-demo-title">Full Width Layout</div>
        <nosto-image src="${args.src}" height="${args.height}" layout="${args.layout}"> </nosto-image>
      </div>
    </div>
  `
}

export const Fixed: Story = {
  args: {
    src: "https://picsum.photos/id/35/800/600",
    width: 500,
    height: 300,
    layout: "fixed"
  },
  render: args => html`
    <div class="story-container">
      <div class="image-demo-section">
        <div class="image-demo-title">Fixed Layout</div>
        <nosto-image src="${args.src}" width="${args.width}" height="${args.height}" layout="${args.layout}">
        </nosto-image>
      </div>
    </div>
  `
}

export const AspectRatioDemo: Story = {
  render: () => html`
    <div class="story-container">
      <div class="image-demo-section">
        <div class="image-demo-title">Aspect Ratio Examples</div>

        <div class="image-demo-sub-title">Square (1:1 ratio)</div>
        <div class="image-grid">
          <nosto-image src="https://picsum.photos/id/40/800/800" width="200" aspect-ratio="1"></nosto-image>
        </div>

        <div class="image-demo-sub-title">Wide (16:9 ratio)</div>
        <div class="image-grid">
          <nosto-image src="https://picsum.photos/id/45/1600/900" width="400" aspect-ratio="1.77"></nosto-image>
        </div>

        <div class="image-demo-sub-title">Portrait (3:4 ratio)</div>
        <div class="image-grid">
          <nosto-image src="https://picsum.photos/id/50/600/800" width="200" aspect-ratio="0.75"></nosto-image>
        </div>
      </div>
    </div>
  `
}

export const AllLayouts: Story = {
  render: () => html`
    <div class="story-container">
      <div class="tabbed-container">
        <div class="tabbed">
          <input type="radio" id="tab-constrained" name="image-layout-tab" checked />
          <input type="radio" id="tab-full-width" name="image-layout-tab" />
          <input type="radio" id="tab-fixed" name="image-layout-tab" />

          <ul class="tabs">
            <li class="tab"><label for="tab-constrained">Constrained Layout (default)</label></li>
            <li class="tab"><label for="tab-full-width">Full Width Layout</label></li>
            <li class="tab"><label for="tab-fixed">Fixed Layout</label></li>
          </ul>

          <div class="tab-content">
            <div class="image-demo-title">Layout: Constrained (default)</div>

            <div class="image-demo-sub-title">Width (300) and Height (800)</div>
            <div class="image-grid">
              ${sampleImages.map(
                product => html`
                  <div class="image-item">
                    <nosto-image src="${product.imageUrl}" height="300" width="800"></nosto-image>
                    <div class="image-caption">${product.name}</div>
                  </div>
                `
              )}
            </div>

            <div class="image-demo-sub-title">Height (300) and AspectRatio (1.33)</div>
            <div class="image-grid">
              ${sampleImages.map(
                product => html`
                  <div class="image-item">
                    <nosto-image src="${product.imageUrl}" height="300" aspect-ratio="1.33"> </nosto-image>
                    <div class="image-caption">${product.name}</div>
                  </div>
                `
              )}
            </div>
          </div>

          <div class="tab-content">
            <div class="image-demo-title">Layout: Full Width</div>

            <div class="image-demo-sub-title">Without width and height</div>
            <div class="image-grid">
              ${sampleImages.map(
                product => html`
                  <div class="image-item">
                    <nosto-image src="${product.imageUrl}" layout="fullWidth"></nosto-image>
                    <div class="image-caption">${product.name}</div>
                  </div>
                `
              )}
            </div>
          </div>

          <div class="tab-content">
            <div class="image-demo-title">Layout: Fixed</div>

            <div class="image-demo-sub-title">Width (700) and Height (300)</div>
            <div class="image-grid">
              ${sampleImages.map(
                product => html`
                  <div class="image-item">
                    <nosto-image src="${product.imageUrl}" height="300" width="700" layout="fixed"> </nosto-image>
                    <div class="image-caption">${product.name}</div>
                  </div>
                `
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Complete showcase of all image layouts and configurations, converted from the images template in dev folder. Use the tabs to switch between different layout modes."
      }
    }
  }
}
