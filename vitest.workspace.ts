import { defineWorkspace } from "vitest/config"

// More info at: https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
export default defineWorkspace([
  // This is the configuration for your app
  "vite.config.ts",
  // This is the configuration for your Storybook tests
  ".storybook/vitest.config.ts"
])
