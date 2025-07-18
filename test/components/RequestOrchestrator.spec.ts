import { describe, it, beforeEach, expect, vi } from "vitest"
import { scheduleRequest, resetOrchestrator } from "@/components/NostoCampaign/RequestOrchestrator"
import { mockNostojs } from "@nosto/nosto-js/testing"

describe("RequestOrchestrator", () => {
  beforeEach(() => {
    // Reset the orchestrator state for each test
    resetOrchestrator()
    vi.clearAllMocks()
  })

  it("should batch compatible requests", async () => {
    const mockLoad = vi.fn().mockResolvedValue({
      recommendations: {
        placement1: { title: "Result 1" },
        placement2: { title: "Result 2" }
      }
    })

    const mockBuilder = {
      createRecommendationRequest: vi.fn().mockReturnValue({
        disableCampaignInjection: vi.fn().mockReturnThis(),
        setElements: vi.fn().mockReturnThis(),
        setResponseMode: vi.fn().mockReturnThis(),
        setProducts: vi.fn().mockReturnThis(),
        load: mockLoad
      })
    }

    mockNostojs(mockBuilder)

    // Create two compatible requests
    const config1 = {
      placement: "placement1",
      responseMode: "HTML" as const,
      flags: { skipPageViews: true, skipEvents: true }
    }

    const config2 = {
      placement: "placement2",
      responseMode: "HTML" as const,
      flags: { skipPageViews: true, skipEvents: true }
    }

    // Schedule both requests
    const [result1, result2] = await Promise.all([scheduleRequest(config1), scheduleRequest(config2)])

    // Verify both requests were batched into a single API call
    expect(mockBuilder.createRecommendationRequest).toHaveBeenCalledTimes(1)
    expect(mockBuilder.createRecommendationRequest().setElements).toHaveBeenCalledWith(["placement1", "placement2"])
    expect(mockLoad).toHaveBeenCalledTimes(1)

    // Verify results are correctly distributed
    expect(result1).toEqual({ title: "Result 1" })
    expect(result2).toEqual({ title: "Result 2" })
  })

  it("should not batch incompatible requests", async () => {
    const mockLoad = vi
      .fn()
      .mockResolvedValueOnce({
        recommendations: { placement1: { title: "HTML Result" } }
      })
      .mockResolvedValueOnce({
        recommendations: { placement2: { title: "JSON Result" } }
      })

    const mockBuilder = {
      createRecommendationRequest: vi.fn().mockReturnValue({
        disableCampaignInjection: vi.fn().mockReturnThis(),
        setElements: vi.fn().mockReturnThis(),
        setResponseMode: vi.fn().mockReturnThis(),
        setProducts: vi.fn().mockReturnThis(),
        load: mockLoad
      })
    }

    mockNostojs(mockBuilder)

    // Create two incompatible requests (different response modes)
    const config1 = {
      placement: "placement1",
      responseMode: "HTML" as const,
      flags: { skipPageViews: true, skipEvents: true }
    }

    const config2 = {
      placement: "placement2",
      responseMode: "JSON_ORIGINAL" as const,
      flags: { skipPageViews: true, skipEvents: true }
    }

    // Schedule both requests
    const [result1, result2] = await Promise.all([scheduleRequest(config1), scheduleRequest(config2)])

    // Verify both requests resulted in separate API calls
    expect(mockBuilder.createRecommendationRequest).toHaveBeenCalledTimes(2)
    expect(mockLoad).toHaveBeenCalledTimes(2)

    // Verify results
    expect(result1).toEqual({ title: "HTML Result" })
    expect(result2).toEqual({ title: "JSON Result" })
  })

  it("should handle request errors gracefully", async () => {
    const mockError = new Error("API Error")
    const mockLoad = vi.fn().mockRejectedValue(mockError)

    const mockBuilder = {
      createRecommendationRequest: vi.fn().mockReturnValue({
        disableCampaignInjection: vi.fn().mockReturnThis(),
        setElements: vi.fn().mockReturnThis(),
        setResponseMode: vi.fn().mockReturnThis(),
        setProducts: vi.fn().mockReturnThis(),
        load: mockLoad
      })
    }

    mockNostojs(mockBuilder)

    const config = {
      placement: "placement1",
      responseMode: "HTML" as const,
      flags: { skipPageViews: true, skipEvents: true }
    }

    await expect(scheduleRequest(config)).rejects.toThrow("API Error")
  })

  it("should batch requests with products correctly", async () => {
    const mockLoad = vi.fn().mockResolvedValue({
      recommendations: {
        placement1: { title: "Product Result 1" },
        placement2: { title: "Product Result 2" }
      }
    })

    const mockBuilder = {
      createRecommendationRequest: vi.fn().mockReturnValue({
        disableCampaignInjection: vi.fn().mockReturnThis(),
        setElements: vi.fn().mockReturnThis(),
        setResponseMode: vi.fn().mockReturnThis(),
        setProducts: vi.fn().mockReturnThis(),
        load: mockLoad
      })
    }

    mockNostojs(mockBuilder)

    // Create requests with same product info
    const config1 = {
      placement: "placement1",
      responseMode: "HTML" as const,
      productId: "123",
      variantId: "456",
      flags: { skipPageViews: true, skipEvents: false }
    }

    const config2 = {
      placement: "placement2",
      responseMode: "HTML" as const,
      productId: "123",
      variantId: "456",
      flags: { skipPageViews: true, skipEvents: false }
    }

    await Promise.all([scheduleRequest(config1), scheduleRequest(config2)])

    // Verify setProducts was called with the correct product info
    expect(mockBuilder.createRecommendationRequest().setProducts).toHaveBeenCalledWith([
      { product_id: "123", sku_id: "456" }
    ])
  })
})
