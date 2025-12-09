import { resolve } from "path"
import { defineConfig } from "vitest/config"
import { storybookTest } from "@storybook/experimental-addon-test/vitest-plugin"

export default defineConfig({
  plugins: [
    storybookTest({
      configDir: ".storybook",
      // Manually specify story patterns to work around auto-discovery issues
      storiesPath: resolve(import.meta.dirname, "../src")
    })
  ],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "../src")
    }
  },
  test: {
    name: "storybook",
    browser: {
      enabled: true,
      headless: true,
      name: "chromium",
      provider: "playwright"
    },
    setupFiles: ["./.storybook/vitest.setup.ts"]
  }
})
