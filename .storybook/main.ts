import type { StorybookConfig } from "@storybook/web-components-vite"

const config: StorybookConfig = {
  stories: ["./*.stories.ts", "../src/**/*.stories.ts"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {}
  },
  typescript: {
    reactDocgen: false
  }
}
export default config
