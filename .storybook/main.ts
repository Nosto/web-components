import type { StorybookConfig } from "@storybook/web-components-vite"

export default {
  stories: ["./*.stories.ts", "../src/**/*.stories.ts"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {}
  },
  typescript: {
    reactDocgen: false
  }
} satisfies StorybookConfig
