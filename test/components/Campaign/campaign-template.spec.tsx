/** @jsx createElement */
import { describe, it, expect, beforeAll, beforeEach, afterEach } from "vitest"
import { Campaign, createCampaignSettings } from "@/components/Campaign/Campaign"
import { SimpleCard } from "@/components/SimpleCard/SimpleCard"
import { VariantSelector } from "@/components/VariantSelector/VariantSelector"
import { DynamicCard } from "@/components/DynamicCard/DynamicCard"
import { SectionCampaign } from "@/components/SectionCampaign/SectionCampaign"
import { CampaignSettings, CampaignLayout, CampaignMode } from "@/components/Campaign/types"
import { createElement } from "../../utils/jsx"
import { compile } from "@/templating/vue"
import { JSONResult } from "@nosto/nosto-js/client"

describe("Campaign Template and Settings", () => {
  let template: HTMLTemplateElement
  let campaign: Campaign
  let mockData: JSONResult

  beforeAll(() => {
    // Register all custom elements
    if (!customElements.get("nosto-campaign")) {
      customElements.define("nosto-campaign", Campaign)
    }
    if (!customElements.get("nosto-simple-card")) {
      customElements.define("nosto-simple-card", SimpleCard)
    }
    if (!customElements.get("nosto-variant-selector")) {
      customElements.define("nosto-variant-selector", VariantSelector)
    }
    if (!customElements.get("nosto-dynamic-card")) {
      customElements.define("nosto-dynamic-card", DynamicCard)
    }
    if (!customElements.get("nosto-section-campaign")) {
      customElements.define("nosto-section-campaign", SectionCampaign)
    }
  })

  beforeEach(() => {
    // Create a test template based on our campaign template
    template = document.createElement("template")
    template.innerHTML = `
      <div class="nosto-campaign-wrapper">
        <h2 v-if="settings.title" class="campaign-title">{{ settings.title }}</h2>
        
        <!-- Simple mode: uses SimpleCard with optional VariantSelector -->
        <div v-if="settings.mode === 'simple'" class="campaign-simple">
          <div 
            v-if="settings.layout === 'grid'" 
            class="campaign-grid"
          >
            <div v-for="product in settings.products" class="campaign-grid-item">
              <nosto-simple-card
                :handle="product.handle"
                :alternate="settings.alternate"
                :brand="settings.brand"
                :discount="settings.discount"
              ></nosto-simple-card>
            </div>
          </div>
          
          <div v-if="settings.layout === 'carousel'" class="campaign-carousel">
            <div class="swiper">
              <div class="swiper-wrapper">
                <div v-for="product in settings.products" class="swiper-slide">
                  <nosto-simple-card
                    :handle="product.handle"
                    :alternate="settings.alternate"
                    :brand="settings.brand"
                    :discount="settings.discount"
                  ></nosto-simple-card>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Native mode: uses DynamicCard -->
        <div v-if="settings.mode === 'native'" class="campaign-native">
          <div 
            v-if="settings.layout === 'grid'" 
            class="campaign-grid"
          >
            <div v-for="product in settings.products" class="campaign-grid-item">
              <nosto-dynamic-card
                :handle="product.handle"
                :template="settings.template"
              ></nosto-dynamic-card>
            </div>
          </div>
        </div>
        
        <!-- Section mode: uses SectionCampaign without children -->
        <div v-if="settings.mode === 'section'" class="campaign-section">
          <nosto-section-campaign
            :placement="settings.placement"
            :section="settings.section"
          ></nosto-section-campaign>
        </div>
      </div>
    `

    // Create campaign element
    campaign = (<nosto-campaign placement="test-placement" />) as Campaign

    // Mock data structure matching JSONResult interface
    mockData = {
      element: "test-element",
      source_product_ids: ["123", "456", "789"],
      data: {},
      div_id: "test-div",
      result_id: "test-result",
      campaign_name: "test-campaign",
      product_ids: ["123", "456", "789"],
      reco_id: "test-reco",
      result_type: "recommendations",
      title: "Recommended Products",
      products: [
        {
          product_id: "123",
          handle: "product-1",
          name: "Product 1",
          url: "/products/product-1",
          alternate_image_urls: [],
          categories: [],
          custom_fields: {},
          price: 100,
          price_currency_code: "USD",
          skus: [],
          tags1: [],
          tags2: [],
          tags3: []
        },
        {
          product_id: "456",
          handle: "product-2",
          name: "Product 2",
          url: "/products/product-2",
          alternate_image_urls: [],
          categories: [],
          custom_fields: {},
          price: 200,
          price_currency_code: "USD",
          skus: [],
          tags1: [],
          tags2: [],
          tags3: []
        },
        {
          product_id: "789",
          handle: "product-3",
          name: "Product 3",
          url: "/products/product-3",
          alternate_image_urls: [],
          categories: [],
          custom_fields: {},
          price: 300,
          price_currency_code: "USD",
          skus: [],
          tags1: [],
          tags2: [],
          tags3: []
        }
      ]
    } as unknown as JSONResult
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  describe("CampaignSettings type", () => {
    it("should create valid campaign settings with default values", () => {
      const settings = createCampaignSettings(campaign, mockData)

      expect(settings.placement).toBe("test-placement")
      expect(settings.mode).toBe("simple")
      expect(settings.layout).toBe("grid")
      expect(settings.title).toBe("Recommended Products")
      expect(settings.products).toHaveLength(3)
    })

    it("should create campaign settings with custom mode and layout", () => {
      const settings = createCampaignSettings(campaign, mockData, "native", "carousel")

      expect(settings.mode).toBe("native")
      expect(settings.layout).toBe("carousel")
    })

    it("should include campaign element attributes in settings", () => {
      campaign.productId = "test-product"
      campaign.variantId = "test-variant"
      campaign.template = "test-template"
      campaign.lazy = true
      campaign.cartSynced = true

      const settings = createCampaignSettings(campaign, mockData)

      expect(settings.productId).toBe("test-product")
      expect(settings.variantId).toBe("test-variant")
      expect(settings.template).toBe("test-template")
      expect(settings.lazy).toBe(true)
      expect(settings.cartSynced).toBe(true)
    })
  })

  describe("Template rendering - Simple mode with grid layout", () => {
    it("should render campaign title", () => {
      const settings: CampaignSettings = {
        placement: "test",
        mode: "simple",
        layout: "grid",
        title: "Test Campaign",
        products: []
      }

      compile(campaign, template, { settings })

      const title = campaign.querySelector(".campaign-title")
      expect(title).toBeDefined()
      expect(title?.textContent).toBe("Test Campaign")
    })

    it("should render SimpleCard elements in grid layout", () => {
      const settings: CampaignSettings = {
        placement: "test",
        mode: "simple",
        layout: "grid",
        products: mockData.products,
        alternate: true,
        brand: true,
        discount: true
      }

      compile(campaign, template, { settings })

      const simpleMode = campaign.querySelector(".campaign-simple")
      const gridLayout = campaign.querySelector(".campaign-grid")
      const simpleCards = campaign.querySelectorAll("nosto-simple-card")

      expect(simpleMode).toBeDefined()
      expect(gridLayout).toBeDefined()
      expect(simpleCards).toHaveLength(3)

      // Check attributes are properly bound
      const firstCard = simpleCards[0] as HTMLElement
      expect(firstCard.getAttribute("handle")).toBe("product-1")
      expect(firstCard.hasAttribute("alternate")).toBe(true)
      expect(firstCard.hasAttribute("brand")).toBe(true)
      expect(firstCard.hasAttribute("discount")).toBe(true)
    })

    it("should render SimpleCard elements in carousel layout", () => {
      const settings: CampaignSettings = {
        placement: "test",
        mode: "simple",
        layout: "carousel",
        products: mockData.products
      }

      compile(campaign, template, { settings })

      const carouselLayout = campaign.querySelector(".campaign-carousel")
      const swiperWrapper = campaign.querySelector(".swiper-wrapper")
      const swiperSlides = campaign.querySelectorAll(".swiper-slide")
      const simpleCards = campaign.querySelectorAll("nosto-simple-card")

      expect(carouselLayout).toBeDefined()
      expect(swiperWrapper).toBeDefined()
      expect(swiperSlides).toHaveLength(3)
      expect(simpleCards).toHaveLength(3)
    })
  })

  describe("Template rendering - Native mode", () => {
    it("should render DynamicCard elements in grid layout", () => {
      const settings: CampaignSettings = {
        placement: "test",
        mode: "native",
        layout: "grid",
        products: mockData.products,
        template: "product-card"
      }

      compile(campaign, template, { settings })

      const nativeMode = campaign.querySelector(".campaign-native")
      const gridLayout = campaign.querySelector(".campaign-grid")
      const dynamicCards = campaign.querySelectorAll("nosto-dynamic-card")

      expect(nativeMode).toBeDefined()
      expect(gridLayout).toBeDefined()
      expect(dynamicCards).toHaveLength(3)

      // Check attributes are properly bound
      const firstCard = dynamicCards[0] as HTMLElement
      expect(firstCard.getAttribute("handle")).toBe("product-1")
      expect(firstCard.getAttribute("template")).toBe("product-card")
    })
  })

  describe("Template rendering - Section mode", () => {
    it("should render SectionCampaign element", () => {
      const settings: CampaignSettings = {
        placement: "test-placement",
        mode: "section",
        layout: "grid",
        section: "product-recommendations"
      }

      compile(campaign, template, { settings })

      const sectionMode = campaign.querySelector(".campaign-section")
      const sectionCampaign = campaign.querySelector("nosto-section-campaign")

      expect(sectionMode).toBeDefined()
      expect(sectionCampaign).toBeDefined()

      // Check attributes are properly bound
      expect(sectionCampaign?.getAttribute("placement")).toBe("test-placement")
      expect(sectionCampaign?.getAttribute("section")).toBe("product-recommendations")
    })
  })

  describe("Conditional rendering", () => {
    it("should not render title when not provided", () => {
      const settings: CampaignSettings = {
        placement: "test",
        mode: "simple",
        layout: "grid",
        products: []
      }

      compile(campaign, template, { settings })

      const title = campaign.querySelector(".campaign-title")
      expect(title).toBeNull()
    })

    it("should only render the active mode section", () => {
      const settings: CampaignSettings = {
        placement: "test",
        mode: "simple",
        layout: "grid",
        products: mockData.products
      }

      compile(campaign, template, { settings })

      const simpleMode = campaign.querySelector(".campaign-simple")
      const nativeMode = campaign.querySelector(".campaign-native")
      const sectionMode = campaign.querySelector(".campaign-section")

      expect(simpleMode).toBeDefined()
      expect(nativeMode).toBeNull()
      expect(sectionMode).toBeNull()
    })

    it("should only render the active layout within a mode", () => {
      const settings: CampaignSettings = {
        placement: "test",
        mode: "simple",
        layout: "carousel",
        products: mockData.products
      }

      compile(campaign, template, { settings })

      const gridLayout = campaign.querySelector(".campaign-grid")
      const carouselLayout = campaign.querySelector(".campaign-carousel")

      expect(gridLayout).toBeNull()
      expect(carouselLayout).toBeDefined()
    })
  })

  describe("Type definitions", () => {
    it("should accept valid CampaignLayout values", () => {
      const validLayouts: CampaignLayout[] = ["grid", "carousel"]
      expect(validLayouts).toHaveLength(2)
    })

    it("should accept valid CampaignMode values", () => {
      const validModes: CampaignMode[] = ["simple", "native", "section"]
      expect(validModes).toHaveLength(3)
    })

    it("should have complete CampaignSettings interface", () => {
      const settings: CampaignSettings = {
        placement: "test",
        layout: "grid",
        mode: "simple",
        // Optional Campaign attributes
        productId: "123",
        variantId: "456",
        template: "test-template",
        init: "true",
        lazy: false,
        cartSynced: true,
        // Optional SimpleCard attributes
        handle: "test-handle",
        alternate: true,
        brand: false,
        discount: true,
        rating: 4.5,
        sizes: "(max-width: 768px) 100vw",
        // Optional VariantSelector attributes
        preselect: true,
        // Optional SectionCampaign attributes
        section: "test-section",
        // Additional context
        title: "Test Title",
        products: [{ product_id: "1", handle: "test" }]
      }

      // Type check - this should compile without errors
      expect(settings.placement).toBe("test")
      expect(settings.mode).toBe("simple")
      expect(settings.layout).toBe("grid")
    })
  })
})
