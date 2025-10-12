import { describe, it, expect, beforeAll } from "vitest"
import { Liquid } from "liquidjs"
import { readFileSync } from "fs"
import { join } from "path"
import type { Settings } from "../../../src/components/Campaign/liquid/types"

describe("Campaign Liquid Template", () => {
  let liquid: Liquid
  let template: string

  beforeAll(() => {
    liquid = new Liquid()
    // Load the template file
    template = readFileSync(
      join(process.cwd(), "src/components/Campaign/liquid/campaign-template.liquid"),
      "utf-8"
    )
  })

  const sampleProducts = [
    {
      handle: "product-1",
      title: "Test Product 1",
      variant_id: "123"
    },
    {
      handle: "product-2", 
      title: "Test Product 2",
      variant_id: "456"
    }
  ]

  describe("Grid Layout with Simple Mode", () => {
    it("should render simple cards in grid layout", async () => {
      const settings: Settings = {
        campaignPlacement: "test-placement",
        mode: "simple",
        layout: "grid",
        gridSize: 2,
        simpleAlternate: true,
        simpleBrand: true,
        simpleDiscount: true,
        simpleRating: true,
        simpleSizes: "300px",
        variantSelector: true,
        variantSelectorPreselect: true
      }

      const context = {
        settings,
        products: sampleProducts
      }

      const result = await liquid.parseAndRender(template, context)
      
      expect(result).toContain('<nosto-campaign')
      expect(result).toContain('placement="test-placement"')
      expect(result).toContain('campaign-grid-2')
      expect(result).toContain('nosto-simple-card')
      expect(result).toContain(':handle="product.handle"')
      expect(result).toContain('alternate')
      expect(result).toContain('brand')
      expect(result).toContain('discount')
      expect(result).toContain('rating')
      expect(result).toContain('sizes="300px"')
      expect(result).toContain('nosto-variant-selector')
      expect(result).toContain('preselect')
    })

    it("should render grid layout without variant selector when disabled", async () => {
      const settings: Settings = {
        campaignPlacement: "test-placement",
        mode: "simple",
        layout: "grid",
        variantSelector: false
      }

      const context = {
        settings,
        products: sampleProducts
      }

      const result = await liquid.parseAndRender(template, context)
      
      expect(result).toContain('nosto-simple-card')
      expect(result).not.toContain('nosto-variant-selector')
    })
  })

  describe("Grid Layout with Dynamic Mode", () => {
    it("should render dynamic cards in grid layout", async () => {
      const settings: Settings = {
        campaignPlacement: "test-placement",
        mode: "dynamic",
        layout: "grid",
        gridSize: 3,
        dynamicTemplate: "product-card",
        dynamicSection: "recommendations"
      }

      const context = {
        settings,
        products: sampleProducts
      }

      const result = await liquid.parseAndRender(template, context)
      
      expect(result).toContain('<nosto-campaign')
      expect(result).toContain('placement="test-placement"')
      expect(result).toContain('campaign-grid-3')
      expect(result).toContain('nosto-dynamic-card')
      expect(result).toContain(':handle="product.handle"')
      expect(result).toContain('template="product-card"')
      expect(result).toContain('section="recommendations"')
    })
  })

  describe("Carousel Layout with Simple Mode", () => {
    it("should render simple cards in carousel layout", async () => {
      const settings: Settings = {
        campaignPlacement: "test-placement",
        mode: "simple",
        layout: "carousel",
        simpleAlternate: true,
        variantSelector: true
      }

      const context = {
        settings,
        products: sampleProducts
      }

      const result = await liquid.parseAndRender(template, context)
      
      expect(result).toContain('<nosto-campaign')
      expect(result).toContain('swiper-container')
      expect(result).toContain('campaign-carousel')
      expect(result).toContain('swiper-slide')
      expect(result).toContain('nosto-simple-card')
      expect(result).toContain('swiper-pagination')
      expect(result).toContain('swiper-button-next')
      expect(result).toContain('swiper-button-prev')
    })
  })

  describe("Carousel Layout with Dynamic Mode", () => {
    it("should render dynamic cards in carousel layout", async () => {
      const settings: Settings = {
        campaignPlacement: "test-placement",
        mode: "dynamic",
        layout: "carousel",
        dynamicTemplate: "carousel-card"
      }

      const context = {
        settings,
        products: sampleProducts
      }

      const result = await liquid.parseAndRender(template, context)
      
      expect(result).toContain('<nosto-campaign')
      expect(result).toContain('swiper-container')
      expect(result).toContain('campaign-carousel')
      expect(result).toContain('swiper-slide')
      expect(result).toContain('nosto-dynamic-card')
      expect(result).toContain('template="carousel-card"')
    })
  })

  describe("Section Mode", () => {
    it("should render section campaign without wrapper", async () => {
      const settings: Settings = {
        campaignPlacement: "test-placement",
        mode: "section",
        layout: "grid", // Layout is ignored in section mode
        sectionCampaignSection: "product-grid"
      }

      const context = {
        settings,
        products: sampleProducts
      }

      const result = await liquid.parseAndRender(template, context)
      
      expect(result).toContain('nosto-section-campaign')
      expect(result).toContain('placement="test-placement"')
      expect(result).toContain('section="product-grid"')
      expect(result).not.toContain('<nosto-campaign') // Section mode doesn't use campaign wrapper
      expect(result).not.toContain('nosto-simple-card')
      expect(result).not.toContain('nosto-dynamic-card')
    })
  })

  describe("Grid Size Control", () => {
    it("should apply correct grid size class", async () => {
      const testCases = [
        { gridSize: 1, expectedClass: "campaign-grid-1" },
        { gridSize: 2, expectedClass: "campaign-grid-2" },
        { gridSize: 3, expectedClass: "campaign-grid-3" },
        { gridSize: 4, expectedClass: "campaign-grid-4" },
        { gridSize: 5, expectedClass: "campaign-grid-5" },
        { gridSize: 6, expectedClass: "campaign-grid-6" }
      ]

      for (const testCase of testCases) {
        const settings: Settings = {
          campaignPlacement: "test-placement",
          mode: "simple",
          layout: "grid",
          gridSize: testCase.gridSize
        }

        const context = {
          settings,
          products: sampleProducts
        }

        const result = await liquid.parseAndRender(template, context)
        expect(result).toContain(testCase.expectedClass)
      }
    })

    it("should use default grid class when no gridSize specified", async () => {
      const settings: Settings = {
        campaignPlacement: "test-placement",
        mode: "simple",
        layout: "grid"
        // No gridSize specified
      }

      const context = {
        settings,
        products: sampleProducts
      }

      const result = await liquid.parseAndRender(template, context)
      
      expect(result).toContain('class="campaign-grid"')
      // Check that the div doesn't have numbered grid classes, only the base class
      expect(result).toMatch(/<div class="campaign-grid"[^>]*>/)
      expect(result).not.toMatch(/<div class="campaign-grid campaign-grid-\d+"[^>]*>/)
    })
  })

  describe("Conditional Attributes", () => {
    it("should include campaign attributes when settings are provided", async () => {
      const settings: Settings = {
        campaignPlacement: "test-placement",
        campaignLazy: true,
        campaignCartSynced: true,
        mode: "simple",
        layout: "grid"
      }

      const context = {
        settings,
        products: sampleProducts
      }

      const result = await liquid.parseAndRender(template, context)
      
      expect(result).toContain('placement="test-placement"')
      expect(result).toContain('lazy')
      expect(result).toContain('cart-synced')
    })

    it("should exclude optional attributes when not provided", async () => {
      const settings: Settings = {
        campaignPlacement: "test-placement",
        mode: "simple",
        layout: "grid"
        // No optional attributes
      }

      const context = {
        settings,
        products: sampleProducts
      }

      const result = await liquid.parseAndRender(template, context)
      
      expect(result).toContain('placement="test-placement"')
      expect(result).not.toContain('lazy')
      expect(result).not.toContain('cart-synced')
      expect(result).not.toContain('alternate')
      expect(result).not.toContain('brand')
      expect(result).not.toContain('discount')
      expect(result).not.toContain('rating')
      expect(result).not.toContain('sizes')
    })
  })
})