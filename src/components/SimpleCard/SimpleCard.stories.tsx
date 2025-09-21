import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import "./SimpleCard.stories.css"

// Mock Shopify environment for Storybook
window.Shopify = {
  routes: {
    root: "/"
  }
}

// Mock fetch for Storybook to return sample product data
const originalFetch = window.fetch
window.fetch = (url: string | URL | Request, init?: RequestInit) => {
  const urlStr = typeof url === "string" ? url : url.toString()
  
  // Mock Shopify product endpoints
  if (urlStr.includes("/products/") && urlStr.endsWith(".js")) {
    const handle = urlStr.split("/products/")[1].replace(".js", "")
    
    const mockProducts: Record<string, any> = {
      "awesome-sneakers": {
        id: 123456,
        title: "Awesome Sneakers",
        handle: "awesome-sneakers",
        vendor: "Nike",
        price: 12999, // $129.99
        compare_at_price: 16999, // $169.99
        images: [
          "https://picsum.photos/400/400?random=1",
          "https://picsum.photos/400/400?random=2"
        ],
        description: "Comfortable and stylish sneakers perfect for everyday wear."
      },
      "classic-tee": {
        id: 234567,
        title: "Classic Cotton T-Shirt",
        handle: "classic-tee",
        vendor: "Uniqlo",
        price: 2999, // $29.99
        compare_at_price: null,
        images: [
          "https://picsum.photos/400/400?random=3",
          "https://picsum.photos/400/400?random=4"
        ],
        description: "Soft and comfortable cotton t-shirt in various colors."
      },
      "premium-backpack": {
        id: 345678,
        title: "Premium Travel Backpack",
        handle: "premium-backpack",
        vendor: "Patagonia",
        price: 8999, // $89.99
        compare_at_price: 9999, // $99.99
        images: [
          "https://picsum.photos/400/400?random=5",
          "https://picsum.photos/400/400?random=6"
        ],
        description: "Durable and spacious backpack for all your travel needs."
      }
    }
    
    const product = mockProducts[handle]
    if (product) {
      return Promise.resolve(new Response(JSON.stringify(product), { status: 200 }))
    } else {
      return Promise.resolve(new Response(JSON.stringify({ error: "Product not found" }), { status: 404 }))
    }
  }
  
  // Fall back to original fetch for other requests
  return originalFetch(url, init)
}

const handles = ["awesome-sneakers", "classic-tee", "premium-backpack"]

const meta: Meta = {
  title: "Components/SimpleCard",
  component: "nosto-simple-card",
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  argTypes: {
    handle: {
      control: "select",
      options: handles,
      description: "The Shopify product handle to fetch data for"
    },
    alternate: {
      control: "boolean",
      description: "Show alternate product image on hover"
    },
    brand: {
      control: "boolean",
      description: "Show brand/vendor data"
    },
    discount: {
      control: "boolean",
      description: "Show discount data"
    },
    rating: {
      control: "boolean",
      description: "Show product rating"
    }
  },
  args: {
    handle: handles[0],
    alternate: false,
    brand: false,
    discount: false,
    rating: false
  }
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: args => html`
    <nosto-simple-card
      handle="${args.handle}"
      ?alternate=${args.alternate}
      ?brand=${args.brand}
      ?discount=${args.discount}
      ?rating=${args.rating}
    ></nosto-simple-card>
  `,
  parameters: {
    docs: {
      description: {
        story: "Basic product card showing image, title, and price."
      }
    }
  }
}

export const WithBrand: Story = {
  args: {
    handle: handles[0],
    brand: true
  },
  render: args => html`
    <nosto-simple-card
      handle="${args.handle}"
      ?alternate=${args.alternate}
      ?brand=${args.brand}
      ?discount=${args.discount}
      ?rating=${args.rating}
    ></nosto-simple-card>
  `,
  parameters: {
    docs: {
      description: {
        story: "Product card with brand/vendor information displayed."
      }
    }
  }
}

export const WithDiscount: Story = {
  args: {
    handle: handles[0], // This product has a discount
    discount: true
  },
  render: args => html`
    <nosto-simple-card
      handle="${args.handle}"
      ?alternate=${args.alternate}
      ?brand=${args.brand}
      ?discount=${args.discount}
      ?rating=${args.rating}
    ></nosto-simple-card>
  `,
  parameters: {
    docs: {
      description: {
        story: "Product card showing discount percentage and original price when applicable."
      }
    }
  }
}

export const WithAlternateImage: Story = {
  args: {
    handle: handles[0],
    alternate: true
  },
  render: args => html`
    <nosto-simple-card
      handle="${args.handle}"
      ?alternate=${args.alternate}
      ?brand=${args.brand}
      ?discount=${args.discount}
      ?rating=${args.rating}
    ></nosto-simple-card>
  `,
  parameters: {
    docs: {
      description: {
        story: "Product card with alternate image that appears on hover."
      }
    }
  }
}

export const WithAllFeatures: Story = {
  args: {
    handle: handles[0],
    alternate: true,
    brand: true,
    discount: true,
    rating: true
  },
  render: args => html`
    <nosto-simple-card
      handle="${args.handle}"
      ?alternate=${args.alternate}
      ?brand=${args.brand}
      ?discount=${args.discount}
      ?rating=${args.rating}
    ></nosto-simple-card>
  `,
  parameters: {
    docs: {
      description: {
        story: "Product card with all features enabled: brand, discount, rating, and alternate image."
      }
    }
  }
}

export const ProductGrid: Story = {
  render: () => html`
    <div class="card-grid">
      <nosto-simple-card handle="awesome-sneakers" brand discount alternate></nosto-simple-card>
      <nosto-simple-card handle="classic-tee" brand rating></nosto-simple-card>
      <nosto-simple-card handle="premium-backpack" brand discount rating alternate></nosto-simple-card>
      <nosto-simple-card handle="awesome-sneakers"></nosto-simple-card>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: "Multiple product cards in a grid layout with different feature combinations."
      }
    }
  },
  decorators: [story => html`<div style="max-width: 100%; margin: 0;">${story()}</div>`]
}