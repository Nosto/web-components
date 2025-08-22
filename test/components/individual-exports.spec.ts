import { describe, it, expect } from "vitest"

const components = [
  "NostoCampaign",
  "NostoControl",
  "NostoDynamicCard",
  "NostoImage",
  "NostoProduct",
  "NostoProductCard",
  "NostoSection",
  "NostoSkuOptions"
]

describe("Individual component exports", () => {
  it.each(components)("should export %s from direct component path", async componentName => {
    const module = await import(`../../src/components/${componentName}/${componentName}`)
    const component = module[componentName]
    expect(component).toBeDefined()
    expect(component.name).toBe(componentName)
  })
})
