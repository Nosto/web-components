import { describe } from "vitest"
import { validateLibrary } from "./library.suite"

describe("library loading", async () => {
  await validateLibrary("../../dist/main.es.js")
})
