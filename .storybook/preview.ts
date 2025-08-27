import type { Preview } from "@storybook/web-components-vite"
import * as components from "../src/main"

// Register all custom elements globally for Storybook
Object.entries(components).forEach(([name, component]) => {
  const kebabCased = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
  if (!customElements.get(kebabCased)) {
    customElements.define(kebabCased, component)
  }
})

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      description: {
        component: "Web Components developed by Nosto for e-commerce platforms."
      }
    }
  },
  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: ["light", "dark"],
        showName: true
      }
    }
  }
} satisfies Preview
