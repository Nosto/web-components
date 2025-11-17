import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { html } from "lit"
import { updateShopifyRoot } from "../../utils/storybook"
import { getExampleHandles } from "../../shopify/graphql/getExampleHandles"
import "./VariantSelector"

const root = "https://nosto-shopify1.myshopify.com/"

// Shared loader for fetching example handles
const exampleHandlesLoader = async (context: { args: { root?: string; products?: number } }) => {
  const { products, root: argRoot } = context.args
  return {
    handles: await getExampleHandles(argRoot || root, products || 12)
  }
}

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
  loaders: [exampleHandlesLoader],
  argTypes: {
    root: {
      control: "text",
      description: "The Shopify store root URL"
    }
  },
  args: {
    root
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
    placeholder: {
      description:
        "If true, the component will display cached content from a previous render while loading new data. Useful for preventing layout shifts",
      control: { type: "boolean" }
    },
    preselect: {
      description: "Whether to automatically preselect the options of the first available variant",
      control: { type: "boolean" }
    }
  },
  args: {
    columns: 4,
    products: 12,
    placeholder: false,
    preselect: false
  },
  render: (args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <div
        style="display: grid; grid-template-columns: repeat(${args.columns}, 1fr); gap: 1rem; padding: 1rem; max-width: 1200px;"
      >
        ${handles.map(
          handle => html`
            <nosto-simple-card handle="${handle}" alternate brand discount rating="3.8">
              <nosto-variant-selector
                handle="${handle}"
                ?placeholder=${args.placeholder}
                ?preselect=${args.preselect}
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
  render: (_args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <nosto-simple-card handle="${handles[0]}" alternate brand discount rating="4.5">
        <nosto-variant-selector handle="${handles[0]}"></nosto-variant-selector>
      </nosto-simple-card>
    `
  }
}

export const InSimpleCard_AddToCart: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (_args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <nosto-simple-card handle="${handles[0]}" alternate brand discount rating="4.5">
        <nosto-variant-selector handle="${handles[0]}"></nosto-variant-selector>
        <button n-atc>Add to cart</button>
      </nosto-simple-card>
    `
  }
}

export const WithPlaceholder: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (_args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <nosto-simple-card handle="${handles[0]}" alternate brand discount rating="4.5">
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

export const CompactMode: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (_args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <nosto-simple-card handle="${handles[0]}" alternate brand discount rating="4.5">
        <nosto-variant-selector handle="${handles[0]}" compact></nosto-variant-selector>
      </nosto-simple-card>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "When the `compact` attribute is set, the component renders a select dropdown for variant selection instead of the default option-by-option swatch UI. This provides a more compact alternative when space is limited."
      }
    }
  }
}

export const CompactMode_WithPreselect: Story = {
  decorators: [story => html`<div style="max-width: 300px; margin: 0 auto;">${story()}</div>`],
  render: (_args, { loaded }) => {
    const handles = loaded?.handles as string[]
    return html`
      <nosto-simple-card handle="${handles[0]}" alternate brand discount rating="4.5">
        <nosto-variant-selector handle="${handles[0]}" compact preselect></nosto-variant-selector>
      </nosto-simple-card>
    `
  },
  parameters: {
    docs: {
      description: {
        story:
          "Compact mode with `preselect` attribute automatically selects the first available variant in the dropdown."
      }
    }
  }
}
