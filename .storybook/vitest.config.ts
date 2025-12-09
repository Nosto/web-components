import { defineConfig } from "vitest/config"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"

// More info at: https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    storybookTest({
      storybookScript: "npm run storybook"
    })
  ],
  test: {
    browser: {
      enabled: true,
      headless: true,
      name: "chromium",
      provider: "playwright"
    },
    setupFiles: ["./.storybook/vitest.setup.ts"]
  }
})
