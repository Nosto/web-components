import type { Preview } from "@storybook/web-components-vite"
import "../src/main"

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
        component: "Custom elements developed by Nosto for e-commerce platforms."
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
