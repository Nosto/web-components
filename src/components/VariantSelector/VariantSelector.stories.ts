import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { html } from "lit"
import { ifDefined } from "lit/directives/if-defined.js"
import { updateShopifyRoot, exampleHandlesLoader } from "../../utils/storybook"
import "./VariantSelector"

const root = "https://nosto-shopify1.myshopify.com/"

window.Shopify = {
  routes: {
    root
  }
}

const meta: Meta = {
  title: "Components/VariantSelector",
  component: "nosto-variant-selector",
  decorators: [
    (story, context) => {
      // Update Shopify root if provided via args
      if (context.args?.root) {
        updateShopifyRoot(context.args.root)
      }
      return story()
    }
  ],
  loaders: [context => exampleHandlesLoader(context, root)],
  argTypes: {
    root: {
      control: "text",
      description: "The Shopify store root URL"
    },
    imageMode: {
      control: "select",
      options: ["", "alternate", "carousel"],
      description:
        'Image display mode. Use "alternate" for hover image swap or "carousel" for image carousel with navigation'
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
      control: "number",
      description: "Product rating (0-5 stars)"
    },
    sizes: {
      control: "text",
      description: "The sizes attribute for responsive images"
    }
  },
  args: {
    root,
    imageMode: "",
    brand: false,
    discount: false,
    rating: 0,
    sizes: ""
  },
  tags: ["autodocs"]
}

export default meta
type Story = StoryObj

export const Default: Story = {
  argTypes: {
    columns: {
      description: "Number of columns to display in the grid",
      control: { type: "range", min: 1, max: 8, step: 1 },
      table: {
        category: "Layout options"
      }
    },
    products: {
      description: "Number of products to display in the grid",
      control: { type: "range", min: 1, max: 20, step: 1 },
      table: {
        category: "Layout options"
      }
    },
    mode: {
      description: "Display mode for the variant selector",
      control: { type: "select" },
      options: ["options", "compact"]
    },
    placeholder: {
      description:
        "If true, the component will display cached content from a previous render while loading new data. Useful for preventing layout shifts",
      control: { type: "boolean" }
    },
    preselect: {
      description: "Whether to automatically preselect the options of the first available variant",
      control: { type: "boolean" }
    },
    maxValues: {
      description: "Maximum number of option values to display per option",
      control: { type: "number", min: 1, max: 10, step: 1 }
    }
  },
  args: {
    columns: 4,
    products: 12,
    mode: "compact",
    placeholder: false,
    preselect: false,
    maxValues: 5
  },
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <div
        style="display: grid; grid-template-columns: repeat(${args.columns}, 1fr); gap: 0.5rem; padding: 0.1rem; max-width: 1200px;"
      >
        ${handles.map(
          handle => html`
            <nosto-simple-card
              handle="${handle}"
              image-mode=${ifDefined(args.imageMode)}
              ?brand=${args.brand}
              ?discount=${args.discount}
              rating=${args.rating || 0}
              sizes="${args.sizes || ""}"
            >
              <nosto-variant-selector
                handle="${handle}"
                mode="${args.mode}"
                ?placeholder=${args.placeholder}
                ?preselect=${args.preselect}
                max-values="${args.maxValues}"
              ></nosto-variant-selector>
            </nosto-simple-card>
          `
        )}
      </div>
    `
  }
}

export const SingleProduct: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (_args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html` <nosto-variant-selector handle="${handles[0]}"></nosto-variant-selector> `
  }
}

export const InSimpleCard: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <nosto-simple-card
        handle="${handles[0]}"
        image-mode=${ifDefined(args.imageMode)}
        ?brand=${args.brand}
        ?discount=${args.discount}
        rating=${args.rating || 0}
        sizes="${args.sizes || ""}"
      >
        <nosto-variant-selector handle="${handles[0]}"></nosto-variant-selector>
      </nosto-simple-card>
    `
  }
}

export const InSimpleCard_AddToCart: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <nosto-simple-card
        handle="${handles[0]}"
        image-mode=${ifDefined(args.imageMode)}
        ?brand=${args.brand}
        ?discount=${args.discount}
        rating=${args.rating || 0}
        sizes="${args.sizes || ""}"
      >
        <nosto-variant-selector handle="${handles[0]}"></nosto-variant-selector>
        <button n-atc>Add to cart</button>
      </nosto-simple-card>
    `
  }
}

export const WithPlaceholder: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <nosto-simple-card
        handle="${handles[0]}"
        image-mode=${ifDefined(args.imageMode)}
        ?brand=${args.brand}
        ?discount=${args.discount}
        rating=${args.rating || 0}
        sizes="${args.sizes || ""}"
      >
        <nosto-variant-selector handle="${handles[0]}" placeholder></nosto-variant-selector>
      </nosto-simple-card>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "When the `placeholder` attribute is set, the component will display cached content from a previous render while loading new data. This is useful for preventing layout shifts and providing a better user experience."
      }
    }
  }
}

export const WithMaxValues: Story = {
  argTypes: {
    maxValues: {
      description: "Maximum number of option values to display per option",
      control: { type: "number", min: 1, max: 10, step: 1 }
    }
  },
  args: {
    maxValues: 3
  },
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; padding: 0.1rem; max-width: 1200px;">
        ${handles.slice(0, 6).map(
          handle => html`
            <nosto-simple-card
              handle="${handle}"
              image-mode=${ifDefined(args.imageMode)}
              ?brand=${args.brand}
              ?discount=${args.brand}
              rating=${args.rating || 0}
              sizes="${args.sizes || ""}"
            >
              <nosto-variant-selector handle="${handle}" max-values="${args.maxValues}"></nosto-variant-selector>
            </nosto-simple-card>
          `
        )}
      </div>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "When the `maxValues` attribute is set, the component limits the number of option values displayed per option. An ellipsis (…) is shown when there are more values available than the specified limit. This is useful for products with many option values to keep the UI compact."
      }
    }
  }
}

export const CompactMode: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <nosto-simple-card
        handle="${handles[0]}"
        image-mode=${ifDefined(args.imageMode)}
        ?brand=${args.brand}
        ?discount=${args.discount}
        rating=${args.rating || 0}
        sizes="${args.sizes || ""}"
      >
        <nosto-variant-selector handle="${handles[0]}" mode="compact"></nosto-variant-selector>
      </nosto-simple-card>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "When the `mode` attribute is set to `compact`, the component renders a single dropdown for all variants with unavailable variants disabled. This provides a more compact UI for products with many variants."
      }
    }
  }
}
