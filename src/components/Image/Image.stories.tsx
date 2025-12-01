/** @jsx createElement */
/** @jsxFrag createFragment */
import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { createElement, createFragment } from "@/utils/jsx"
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

function createImageGrid(
  images: typeof sampleImages,
  layout?: "constrained" | "fullWidth" | "fixed",
  width?: number,
  height?: number,
  aspectRatio?: number
) {
  return (
    <div class="image-grid">
      {images.map(product => (
        <div>
          <nosto-image
            src={product.imageUrl}
            layout={layout}
            width={width}
            height={height}
            aspect-ratio={aspectRatio}
          ></nosto-image>
          <div class="image-caption">{product.name}</div>
        </div>
      ))}
    </div>
  )
}

// Storybook decorator for wrapping stories with container styling
const withStoryContainer = (story: () => unknown) => (
  <div class="story-container">
    <div class="image-demo-section">{story()}</div>
  </div>
)

const meta: Meta = {
  title: "Components/Image",
  component: "nosto-image",
  decorators: [withStoryContainer],
  parameters: {
    docs: {
      description: {
        component:
          "Image is a custom element that renders responsive images with support for Shopify and BigCommerce image transformations."
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
    },
    breakpoints: {
      control: "object",
      description: "Custom widths for responsive image generation. Expects an array of numbers."
    },
    unstyled: {
      control: "boolean",
      description: "When enabled, prevents inline styles from being applied to the image element."
    },
    fetchpriority: {
      control: { type: "select" },
      options: ["high", "low", "auto"],
      description: "Provides a hint to the browser about the priority of this image relative to other images."
    },
    loading: {
      control: { type: "select" },
      options: ["lazy", "eager"],
      description: "The loading behavior of the image. Use 'lazy' for lazy loading or 'eager' for immediate loading."
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
    height: 300,
    layout: "constrained"
  },
  render: args => (
    <nosto-image src={args.src} width={args.width} height={args.height} layout={args.layout}></nosto-image>
  )
}

export const FullWidth: Story = {
  args: {
    src: "https://picsum.photos/id/30/800/600",
    height: 400,
    layout: "fullWidth"
  },
  render: args => <nosto-image src={args.src} height={args.height} layout={args.layout}></nosto-image>
}

export const Fixed: Story = {
  args: {
    src: "https://picsum.photos/id/35/800/600",
    width: 500,
    height: 300,
    layout: "fixed"
  },
  render: args => (
    <nosto-image src={args.src} width={args.width} height={args.height} layout={args.layout}></nosto-image>
  )
}

export const WidthOnly: Story = {
  args: {
    src: "https://picsum.photos/id/40/800/600",
    width: 320
  },
  render: args => <nosto-image src={args.src} width={args.width}></nosto-image>,
  parameters: {
    docs: {
      description: {
        story: "Image rendered with only src and width attributes. Height is inferred automatically."
      }
    }
  }
}

export const AspectRatioDemo: Story = {
  render: () => (
    <>
      <div class="image-demo-sub-title">Square (1:1 ratio)</div>
      {createImageGrid([sampleImages[0]], undefined, 200, undefined, 1)}

      <div class="image-demo-sub-title">Wide (16:9 ratio)</div>
      {createImageGrid([sampleImages[1]], undefined, 400, undefined, 1.77)}

      <div class="image-demo-sub-title">Portrait (3:4 ratio)</div>
      {createImageGrid([sampleImages[2]], undefined, 200, undefined, 0.75)}
    </>
  )
}

export const ConstrainedLayout: Story = {
  render: () => (
    <>
      <div class="image-demo-sub-title">Width (300) and Height (800)</div>
      {createImageGrid(sampleImages, undefined, 800, 300)}

      <div class="image-demo-sub-title">Height (300) and AspectRatio (1.33)</div>
      {createImageGrid(sampleImages, undefined, undefined, 300, 1.33)}
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: "Constrained layout showcasing different width/height and aspect ratio configurations."
      }
    }
  }
}

export const FullWidthLayout: Story = {
  render: () => (
    <>
      <div class="image-demo-sub-title">Without width and height</div>
      {createImageGrid(sampleImages, "fullWidth")}
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: "Full width layout that fills the available container width."
      }
    }
  }
}

export const FixedLayout: Story = {
  render: () => (
    <>
      <div class="image-demo-sub-title">Width (700) and Height (300)</div>
      {createImageGrid(sampleImages, "fixed", 700, 300)}
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: "Fixed layout with specific width and height dimensions."
      }
    }
  }
}

export const CustomBreakpoints: Story = {
  args: {
    src: "https://picsum.photos/id/40/800/600",
    width: 800,
    aspectRatio: 1.33,
    layout: "constrained"
  },
  render: args => {
    const element = document.createElement("nosto-image")
    element.setAttribute("src", args.src)
    element.setAttribute("width", String(args.width))
    element.setAttribute("aspect-ratio", String(args.aspectRatio))
    element.setAttribute("layout", args.layout)
    // Set custom breakpoints as JSON array
    element.setAttribute("breakpoints", "[480, 768, 1024, 1440]")

    return (
      <div>
        <div class="image-demo-sub-title">Custom Breakpoints: [480, 768, 1024, 1440]</div>
        <p>
          This image uses custom breakpoints for responsive sizing. Inspect the generated srcset to see the custom
          widths.
        </p>
        {element}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
          Demonstrates the use of custom breakpoints for responsive image generation.
          The component accepts a breakpoints property as a JSON array of numbers representing widths.
          These breakpoints are used by the unpic library to generate appropriate srcset values.
        `
      }
    }
  }
}
