import { describe, it, expect, beforeEach, vi } from "vitest"
import { NostoProduct } from "@/components/NostoProduct/NostoProduct"
import { NostoCampaign } from "@/components/NostoCampaign/NostoCampaign"
import { NostoProductCard } from "@/components/NostoProductCard/NostoProductCard"
import { NostoSkuOptions } from "@/components/NostoSkuOptions/NostoSkuOptions"
import { NostoControl } from "@/components/NostoControl/NostoControl"
import { mockNostojs } from "@nosto/nosto-js/testing"

describe("Component Reactivity", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
    vi.resetAllMocks()
    mockNostojs({
      getSearchSessionParams: () => Promise.resolve({ segments: [] }),
      createRecommendationRequest: vi.fn().mockReturnValue({
        includeTagging: vi.fn().mockReturnThis(),
        disableCampaignInjection: vi.fn().mockReturnThis(),
        setElements: vi.fn().mockReturnThis(),
        setResponseMode: vi.fn().mockReturnThis(),
        setProducts: vi.fn().mockReturnThis(),
        load: vi.fn().mockResolvedValue({ recommendations: {} })
      }),
      placements: {
        injectCampaigns: vi.fn().mockResolvedValue(undefined)
      },
      attributeProductClicksInCampaign: vi.fn()
    })
  })

  describe("NostoProduct", () => {
    it("is reactive to attribute changes", () => {
      const element = new NostoProduct()
      element.productId = "123"
      element.recoId = "test-reco"

      const spy = vi.spyOn(element, "connectedCallback")
      document.body.appendChild(element)

      // Simulate attribute change
      element.setAttribute("product-id", "456")
      element.attributeChangedCallback()

      expect(spy).toHaveBeenCalled()
    })

    it("has observe flag enabled", () => {
      const element = new NostoProduct()
      const constructor = element.constructor as typeof HTMLElement & { observedAttributes?: string[] }
      expect(constructor.observedAttributes).toBeDefined()
      expect(constructor.observedAttributes).toContain("product-id")
      expect(constructor.observedAttributes).toContain("reco-id")
      expect(constructor.observedAttributes).toContain("sku-selected")
    })
  })

  describe("NostoCampaign", () => {
    it("is reactive to attribute changes", () => {
      const element = new NostoCampaign()
      element.placement = "test-placement"

      const spy = vi.spyOn(element, "connectedCallback")
      document.body.appendChild(element)

      // Simulate attribute change
      element.setAttribute("placement", "new-placement")
      element.attributeChangedCallback()

      expect(spy).toHaveBeenCalled()
    })

    it("has observe flag enabled", () => {
      const element = new NostoCampaign()
      const constructor = element.constructor as typeof HTMLElement & { observedAttributes?: string[] }
      expect(constructor.observedAttributes).toBeDefined()
      expect(constructor.observedAttributes).toContain("placement")
      expect(constructor.observedAttributes).toContain("product-id")
      expect(constructor.observedAttributes).toContain("variant-id")
      expect(constructor.observedAttributes).toContain("template")
      expect(constructor.observedAttributes).toContain("init")
    })
  })

  describe("NostoProductCard", () => {
    it("is reactive to attribute changes", () => {
      const element = new NostoProductCard()
      element.template = "test-template"

      // Create a mock template
      const template = document.createElement("template")
      template.id = "test-template"
      template.innerHTML = "<div>Test</div>"
      document.head.appendChild(template)

      const spy = vi.spyOn(element, "connectedCallback")
      document.body.appendChild(element)

      // Simulate attribute change
      element.setAttribute("template", "new-template")
      element.attributeChangedCallback()

      expect(spy).toHaveBeenCalled()
    })

    it("has observe flag enabled", () => {
      const element = new NostoProductCard()
      const constructor = element.constructor as typeof HTMLElement & { observedAttributes?: string[] }
      expect(constructor.observedAttributes).toBeDefined()
      expect(constructor.observedAttributes).toContain("template")
    })
  })

  describe("NostoSkuOptions", () => {
    it("is reactive to attribute changes", () => {
      const element = new NostoSkuOptions()
      element.name = "color"

      const spy = vi.spyOn(element, "connectedCallback")
      document.body.appendChild(element)

      // Simulate attribute change
      element.setAttribute("name", "size")
      element.attributeChangedCallback()

      expect(spy).toHaveBeenCalled()
    })

    it("has observe flag enabled", () => {
      const element = new NostoSkuOptions()
      const constructor = element.constructor as typeof HTMLElement & { observedAttributes?: string[] }
      expect(constructor.observedAttributes).toBeDefined()
      expect(constructor.observedAttributes).toContain("name")
    })
  })

  describe("NostoControl", () => {
    it("is reactive to attribute changes", () => {
      const element = new NostoControl()

      const spy = vi.spyOn(element, "connectedCallback")
      document.body.appendChild(element)

      // Simulate attribute change (even though no attributes are declared)
      element.attributeChangedCallback()

      expect(spy).toHaveBeenCalled()
    })

    it("has observe flag enabled but no observedAttributes since no attributes are declared", () => {
      const element = new NostoControl()
      const constructor = element.constructor as typeof HTMLElement & { observedAttributes?: string[] }
      // NostoControl has no declared attributes, so observedAttributes will be undefined
      // This is expected behavior since the decorator only sets observedAttributes when attributes exist
      expect(constructor.observedAttributes).toBeUndefined()
    })
  })
})
