import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import { updateShopifyRoot } from "../../utils/storybook"

const root = "https://nosto-shopify1.myshopify.com/"
const testHandles = ["good-ol-shoes", "awesome-sneakers", "old-school-kicks"]

window.Shopify = {
  routes: {
    root
  }
}

// Storybook decorator for wrapping stories with container styling
const withStoryContainer = (story: () => unknown) => html`
  <div class="story-container">
    <div class="demo-section">${story()}</div>
  </div>
`

const meta: Meta = {
  title: "Components/DynamicCard",
  component: "nosto-dynamic-card",
  decorators: [
    withStoryContainer,
    (story, context) => {
      // Update Shopify root if provided via args
      if (context.args?.root) {
        updateShopifyRoot(context.args.root)
      }
      return story()
    }
  ],
  parameters: {
    docs: {
      description: {
        component:
          "A custom element that renders a product by fetching the markup from Shopify based on the provided handle and template. This component is designed to be used in a Shopify environment and fetches product data dynamically."
      }
    }
  },
  argTypes: {
    root: {
      control: "text",
      description: "The Shopify store root URL"
    },
    handle: {
      control: "text",
      description: "The product handle to fetch data for. Required."
    },
    section: {
      control: "text",
      description: "The section to use for rendering the product. section or template is required."
    },
    template: {
      control: "text",
      description: "The template to use for rendering the product. section or template is required."
    },
    variantId: {
      control: "text",
      description: "The variant ID to fetch specific variant data. Optional."
    },
    placeholder: {
      control: "boolean",
      description: "If true, the component will display placeholder content while loading. Defaults to false."
    },
    lazy: {
      control: "boolean",
      description: "If true, the component will only fetch data when it comes into view. Defaults to false."
    }
  },
  args: {
    root,
    handle: testHandles[0],
    template: "product-card",
    placeholder: false,
    lazy: false
  },
  tags: ["autodocs"]
}

export default meta
type Story = StoryObj

export const WithTemplate: Story = {
  render: args => html`
    <nosto-dynamic-card
      handle="${args.handle}"
      template="${args.template}"
      ?placeholder=${args.placeholder}
      ?lazy=${args.lazy}
    >
      Loading product...
    </nosto-dynamic-card>
  `,
  parameters: {
    docs: {
      description: {
        story: "Basic usage with a Shopify template to render product markup dynamically."
      }
    }
  }
}

export const WithSection: Story = {
  args: {
    handle: testHandles[1],
    section: "product-recommendations"
  },
  render: args => html`
    <nosto-dynamic-card
      handle="${args.handle}"
      section="${args.section}"
      ?placeholder=${args.placeholder}
      ?lazy=${args.lazy}
    >
      Loading product section...
    </nosto-dynamic-card>
  `,
  parameters: {
    docs: {
      description: {
        story: "Usage with Shopify section rendering for more complex layouts."
      }
    }
  }
}

export const WithPlaceholder: Story = {
  args: {
    handle: testHandles[2],
    template: "product-card",
    placeholder: true
  },
  render: args => html`
    <nosto-dynamic-card
      handle="${args.handle}"
      template="${args.template}"
      ?placeholder=${args.placeholder}
      ?lazy=${args.lazy}
    >
      <div style="padding: 1rem; background: #f5f5f5; border-radius: 4px;">
        <div style="height: 200px; background: #ddd; margin-bottom: 1rem;"></div>
        <div style="height: 1rem; background: #ddd; margin-bottom: 0.5rem;"></div>
        <div style="height: 1rem; background: #ddd; width: 60%;"></div>
      </div>
    </nosto-dynamic-card>
  `,
  parameters: {
    docs: {
      description: {
        story: "Demonstrates placeholder content shown while the component loads the dynamic markup."
      }
    }
  }
}

export const WithVariant: Story = {
  args: {
    handle: testHandles[0],
    template: "product-card",
    variantId: "40834165293180"
  },
  render: args => html`
    <nosto-dynamic-card
      handle="${args.handle}"
      template="${args.template}"
      variant-id="${args.variantId}"
      ?placeholder=${args.placeholder}
      ?lazy=${args.lazy}
    >
      Loading specific variant...
    </nosto-dynamic-card>
  `,
  parameters: {
    docs: {
      description: {
        story: "Load a specific product variant by providing the variant ID."
      }
    }
  }
}

export const LazyLoading: Story = {
  args: {
    handle: testHandles[1],
    template: "product-card",
    lazy: true,
    placeholder: true
  },
  render: args => html`
    <div style="height: 100vh; padding-top: 80vh;">
      <p>Scroll down to see the lazy-loaded dynamic card...</p>
      <nosto-dynamic-card
        handle="${args.handle}"
        template="${args.template}"
        ?placeholder=${args.placeholder}
        ?lazy=${args.lazy}
      >
        <div style="padding: 1rem; background: #f0f8ff; border: 2px dashed #007acc; border-radius: 4px;">
          📦 This dynamic card will load when it comes into view
        </div>
      </nosto-dynamic-card>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates lazy loading behavior - the component only fetches data when it becomes visible in the viewport."
      }
    }
  }
}
