import type { StorybookConfig } from "@storybook/web-components-vite"
import fs from "fs"

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.ts"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {}
  },
  viteFinal: async config => {
    // Add plugin to handle CSS?inline imports as text
    config.plugins = config.plugins || []
    config.plugins.push({
      name: "css-inline",
      resolveId(id, importer) {
        if (id.endsWith(".css?inline")) {
          // Resolve the actual CSS file path
          return this.resolve(id.replace("?inline", ""), importer).then(result => {
            return result ? result.id + "?inline" : null
          })
        }
      },
      load(id) {
        if (id.endsWith("?inline")) {
          const cssPath = id.replace("?inline", "")
          const css = fs.readFileSync(cssPath, "utf-8")
          return `export default ${JSON.stringify(css)}`
        }
      }
    })

    return config
  },
  typescript: {
    reactDocgen: false
  }
}
export default config
