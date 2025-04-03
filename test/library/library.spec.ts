import { describe } from "vitest"
import { validateLibrary } from "./library.suite"

describe("ESM library", async () => {
  await validateLibrary("../../dist/main.es.js")
})
