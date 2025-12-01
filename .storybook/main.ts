import type { StorybookConfig } from "@storybook/web-components-vite"

const config: StorybookConfig = {
  stories: ["./*.stories.{ts,tsx}", "../src/**/*.stories.{ts,tsx}"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {}
  },
  typescript: {
    check: true
  }
}

export default config
