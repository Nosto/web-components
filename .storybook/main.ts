import type { StorybookConfig } from "@storybook/web-components-vite"

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-controls", "@storybook/addon-actions"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {}
  },
  typescript: {
    reactDocgen: false
  }
}
export default config
