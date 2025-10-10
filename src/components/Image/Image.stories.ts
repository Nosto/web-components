import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import { ifDefined } from "lit/directives/if-defined.js"
import "./Image.stories.css"

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

function createImageGrid(images: typeof sampleImages, width?: number, height?: number, aspectRatio?: number) {
  return html`
    <div class="image-grid">
      ${images.map(
        product => html`
            <nosto-image
              src=${product.imageUrl}
              width=${ifDefined(width)}
              height=${ifDefined(height)}
              aspect-ratio=${ifDefined(aspectRatio)}
            >
            </nosto-image>
            <div class="image-caption">${product.name}</div>
          </div>
        `
      )}
    </div>
  `
}

// Storybook decorator for wrapping stories with container styling
const withStoryContainer = (story: () => unknown) => html`
  <div class="story-container">
    <div class="image-demo-section">${story()}</div>
  </div>
`

const meta: Meta = {
  title: "Components/Image",
  component: "nosto-image",
  decorators: [withStoryContainer],
  parameters: {
    docs: {
      description: {
        component:
          "Image is a responsive custom element that automatically generates srcsets for Shopify and BigCommerce images. Uses default breakpoints [320, 640, 768, 1024, 1280, 1600] unless custom breakpoints are provided."
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

    breakpoints: {
      control: "object",
      description: "Custom widths for responsive image generation. Expects an array of numbers."
    }
  },
  tags: ["autodocs"]
}

export default meta
type Story = StoryObj

export const Constrained: Story = {
  args: {
    src: "https://picsum.photos/id/25/800/800",
    width: 400,
    height: 300
  },
  render: args => html`<nosto-image src="${args.src}" width="${args.width}" height="${args.height}"></nosto-image>`
}

export const FullWidth: Story = {
  args: {
    src: "https://picsum.photos/id/30/800/600",
    height: 400
  },
  render: args => html`<nosto-image src="${args.src}" height="${args.height}"></nosto-image>`
}

export const Fixed: Story = {
  args: {
    src: "https://picsum.photos/id/35/800/600",
    width: 500,
    height: 300
  },
  render: args => html`<nosto-image src="${args.src}" width="${args.width}" height="${args.height}"></nosto-image>`
}

export const WidthOnly: Story = {
  args: {
    src: "https://picsum.photos/id/40/800/600",
    width: 320
  },
  render: args => html`<nosto-image src="${args.src}" width="${args.width}"></nosto-image>`,
  parameters: {
    docs: {
      description: {
        story: "Image rendered with only src and width attributes. Height is inferred automatically."
      }
    }
  }
}

export const AspectRatioDemo: Story = {
  render: () => html`
    <div class="image-demo-sub-title">Square (1:1 ratio)</div>
    ${createImageGrid([sampleImages[0]], 200, undefined, 1)}

    <div class="image-demo-sub-title">Wide (16:9 ratio)</div>
    ${createImageGrid([sampleImages[1]], 400, undefined, 1.77)}

    <div class="image-demo-sub-title">Portrait (3:4 ratio)</div>
    ${createImageGrid([sampleImages[2]], 200, undefined, 0.75)}
  `
}

export const ResponsiveLayout: Story = {
  render: () => html`
    <div class="image-demo-sub-title">Width (800) and Height (300)</div>
    ${createImageGrid(sampleImages, 800, 300)}

    <div class="image-demo-sub-title">Height (300) and AspectRatio (1.33)</div>
    ${createImageGrid(sampleImages, undefined, 300, 1.33)}
  `,
  parameters: {
    docs: {
      description: {
        story: "Responsive images with different width/height and aspect ratio configurations."
      }
    }
  }
}

export const FluidLayout: Story = {
  render: () => html`
    <div class="image-demo-sub-title">Without specified dimensions</div>
    ${createImageGrid(sampleImages)}
  `,
  parameters: {
    docs: {
      description: {
        story: "Fluid responsive layout that adapts to container width using default breakpoints."
      }
    }
  }
}

export const FixedDimensions: Story = {
  render: () => html`
    <div class="image-demo-sub-title">Width (700) and Height (300)</div>
    ${createImageGrid(sampleImages, 700, 300)}
  `,
  parameters: {
    docs: {
      description: {
        story: "Images with specific width and height dimensions."
      }
    }
  }
}

export const CustomBreakpoints: Story = {
  args: {
    src: "https://picsum.photos/id/40/800/600",
    width: 800,
    aspectRatio: 1.33
  },
  render: args => {
    const element = document.createElement("nosto-image")
    element.setAttribute("src", args.src)
    element.setAttribute("width", String(args.width))
    element.setAttribute("aspect-ratio", String(args.aspectRatio))
    // Set custom breakpoints as JSON array
    element.setAttribute("breakpoints", "[480, 768, 1024, 1440]")

    return html`
      <div>
        <div class="image-demo-sub-title">Custom Breakpoints: [480, 768, 1024, 1440]</div>
        <p>
          This image uses custom breakpoints for responsive sizing. Inspect the generated srcset to see the custom
          widths.
        </p>
        ${element}
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story: `
          Demonstrates the use of custom breakpoints for responsive image generation.
          The component accepts a breakpoints property as a JSON array of numbers representing widths.
          These breakpoints are used by the Shopify and BigCommerce transformers to generate appropriate srcset values.
        `
      }
    }
  }
}
