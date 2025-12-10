/** @jsx h */
/** @jsxFrag Fragment */
import type { Meta, StoryObj } from "@storybook/web-components-vite"
import { h, Fragment } from "jsx-dom"

const meta: Meta = {
  title: "Overview",
  parameters: {
    docs: {
      page: null // Use custom page
    },
    layout: "fullscreen",
    options: {
      showPanel: false
    }
  }
}

export default meta
type Story = StoryObj

export const Overview: Story = {
  render: () => (
    <>
      <style>
        {`.overview-page {
        font-family: sans-serif;
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }`}
      </style>

      <div class="overview-page">
        <h1>Nosto Web Components</h1>

        <div class="category-section">
          <h2 class="category-title">Store Level Templating</h2>
          <p class="category-description">Components for store-wide functionality and page-level integrations</p>
        </div>

        <div class="category-section">
          <h2 class="category-title">Campaign Level Templating</h2>
          <p class="category-description">Components for product-level functionality and campaign content</p>
        </div>
      </div>
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: "Overview of Nosto Web Components categories."
      }
    }
  }
}
