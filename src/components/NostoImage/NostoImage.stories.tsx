import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"

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

const storyStyles = html`
  <style>
    .story-container {
      font-family:
        Albert Sans,
        sans-serif;
      padding: 20px;
    }

    .image-demo-section {
      margin-bottom: 40px;
    }

    .image-demo-title {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 16px 0px;
      color: #333;
    }

    .image-demo-sub-title {
      font-size: 1.2rem;
      color: #666;
      margin: 20px 0 8px 0;
    }

    .image-grid {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .image-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 300px;
    }

    .image-caption {
      font-size: 0.9rem;
      color: #888;
      text-align: center;
    }
  </style>
`

export const Constrained: Story = {
  args: {
    src: "https://picsum.photos/id/25/800/800",
    width: 400,
    height: 300,
    layout: "constrained"
  },
  render: args => html`
    ${storyStyles}
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
    ${storyStyles}
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
    ${storyStyles}
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
    ${storyStyles}
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
    ${storyStyles}
    <style>
      .tabbed-container {
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
      }

      .tabbed [type="radio"] {
        display: none;
      }

      .tabs {
        display: flex;
        align-items: stretch;
        list-style: none;
        padding: 0;
        margin: 0;
        border-bottom: 1px solid #ccc;
        background: #f5f5f5;
      }

      .tab > label {
        display: block;
        margin-bottom: -1px;
        padding: 12px 15px;
        border: none;
        background: transparent;
        color: #666;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.3s;
      }

      .tab:hover label {
        color: #333;
        background: rgba(183, 33, 255, 0.1);
      }

      .tab-content {
        display: none;
        padding: 20px;
        color: #777;
      }

      .tabbed [type="radio"]:nth-of-type(1):checked ~ .tabs .tab:nth-of-type(1) label,
      .tabbed [type="radio"]:nth-of-type(2):checked ~ .tabs .tab:nth-of-type(2) label,
      .tabbed [type="radio"]:nth-of-type(3):checked ~ .tabs .tab:nth-of-type(3) label {
        border-bottom: 2px solid #b721ff;
        background: #fff;
        color: #b721ff;
        font-weight: 700;
      }

      .tabbed [type="radio"]:nth-of-type(1):checked ~ .tab-content:nth-of-type(1),
      .tabbed [type="radio"]:nth-of-type(2):checked ~ .tab-content:nth-of-type(2),
      .tabbed [type="radio"]:nth-of-type(3):checked ~ .tab-content:nth-of-type(3) {
        display: block;
      }
    </style>
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
