import { resolve } from "path"
import { defineConfig } from "vitest/config"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import { playwright } from "@vitest/browser-playwright"

export default defineConfig({
  plugins: [storybookTest()],
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
      provider: playwright(),
      instances: [
        {
          browser: "chromium"
        }
      ]
    },
    setupFiles: ["./.storybook/vitest.setup.ts"]
  }
})
