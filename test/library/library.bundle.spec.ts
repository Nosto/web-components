import { describe, vi } from "vitest"
import { validateLibrary } from "./library.suite"

vi.mock("https://cdn.jsdelivr.net/npm/liquidjs@latest/dist/liquid.browser.esm.js", () => import("liquidjs"))
vi.mock("https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.min.js", () => import("handlebars"))
vi.mock("https://cdn.jsdelivr.net/npm/swiper@latest/swiper.mjs", () => import("swiper"))

describe("library bundle loading", async () => {
  await validateLibrary("../../dist/main.es.bundle.js")
})
