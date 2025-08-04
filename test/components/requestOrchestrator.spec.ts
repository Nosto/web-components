import { describe, it, beforeEach, expect, vi } from "vitest"
import { requestOrchestrator } from "@/components/NostoCampaign/requestOrchestrator"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { RequestBuilder } from "@nosto/nosto-js/client"

describe("requestOrchestrator", () => {
  beforeEach(() => {
    // Clear any pending requests
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  function getMockBuilder(overrides: Partial<RequestBuilder> = {}): RequestBuilder {
    const base: Partial<RequestBuilder> = {
      disableCampaignInjection: () => base as RequestBuilder,
      setElements: vi.fn(() => base as RequestBuilder),
      setResponseMode: vi.fn(() => base as RequestBuilder),
      setProducts: vi.fn(() => base as RequestBuilder),
      load: vi.fn().mockResolvedValue({
        recommendations: {}
      }),
      ...overrides
    }
    return base as RequestBuilder
  }

  it("should batch multiple compatible requests", async () => {
    const mockBuilder = getMockBuilder()
    const loadSpy = vi.fn().mockResolvedValue({
      recommendations: {
        placement1: { id: "rec1" },
        placement2: { id: "rec2" }
      }
    })
    mockBuilder.load = loadSpy

    mockNostojs({
      createRecommendationRequest: () => mockBuilder
    })

    const flags = { skipPageViews: true, skipEvents: false }

    // Start two requests with compatible parameters
    const promise1 = requestOrchestrator.addRequest({
      placement: "placement1",
      responseMode: "JSON_ORIGINAL",
      flags
    })

    const promise2 = requestOrchestrator.addRequest({
      placement: "placement2",
      responseMode: "JSON_ORIGINAL",
      flags
    })

    // Advance timers to trigger batching
    vi.advanceTimersByTime(100)

    const [result1, result2] = await Promise.all([promise1, promise2])

    // Should have made only one API call
    expect(loadSpy).toHaveBeenCalledTimes(1)
    expect(loadSpy).toHaveBeenCalledWith(flags)

    // Should have set elements for both placements
    expect(mockBuilder.setElements).toHaveBeenCalledWith(["placement1", "placement2"])

    // Should return correct results to each request
    expect(result1).toEqual({ id: "rec1" })
    expect(result2).toEqual({ id: "rec2" })
  })

  it("should separate requests with different response modes", async () => {
    const mockBuilder = getMockBuilder()
    const loadSpy = vi.fn().mockResolvedValue({
      recommendations: {
        placement1: { id: "rec1" },
        placement2: { id: "rec2" }
      }
    })
    mockBuilder.load = loadSpy

    mockNostojs({
      createRecommendationRequest: () => mockBuilder
    })

    const flags = { skipPageViews: true, skipEvents: false }

    // Start two requests with different response modes
    const promise1 = requestOrchestrator.addRequest({
      placement: "placement1",
      responseMode: "JSON_ORIGINAL",
      flags
    })

    const promise2 = requestOrchestrator.addRequest({
      placement: "placement2",
      responseMode: "HTML",
      flags
    })

    // Advance timers to trigger batching
    vi.advanceTimersByTime(100)

    await Promise.all([promise1, promise2])

    // Should have made two separate API calls due to different response modes
    expect(loadSpy).toHaveBeenCalledTimes(2)
  })

  it("should separate requests with different flags", async () => {
    const mockBuilder = getMockBuilder()
    const loadSpy = vi.fn().mockResolvedValue({
      recommendations: {
        placement1: { id: "rec1" },
        placement2: { id: "rec2" }
      }
    })
    mockBuilder.load = loadSpy

    mockNostojs({
      createRecommendationRequest: () => mockBuilder
    })

    // Start two requests with different flags
    const promise1 = requestOrchestrator.addRequest({
      placement: "placement1",
      responseMode: "JSON_ORIGINAL",
      flags: { skipPageViews: true, skipEvents: false }
    })

    const promise2 = requestOrchestrator.addRequest({
      placement: "placement2",
      responseMode: "JSON_ORIGINAL",
      flags: { skipPageViews: true, skipEvents: true }
    })

    // Advance timers to trigger batching
    vi.advanceTimersByTime(100)

    await Promise.all([promise1, promise2])

    // Should have made two separate API calls due to different flags
    expect(loadSpy).toHaveBeenCalledTimes(2)
  })

  it("should combine products from multiple requests", async () => {
    const mockBuilder = getMockBuilder()
    const loadSpy = vi.fn().mockResolvedValue({
      recommendations: {
        placement1: { id: "rec1" },
        placement2: { id: "rec2" }
      }
    })
    mockBuilder.load = loadSpy

    mockNostojs({
      createRecommendationRequest: () => mockBuilder
    })

    const flags = { skipPageViews: true, skipEvents: false }

    // Start two requests with products
    const promise1 = requestOrchestrator.addRequest({
      placement: "placement1",
      productId: "prod1",
      variantId: "var1",
      responseMode: "JSON_ORIGINAL",
      flags
    })

    const promise2 = requestOrchestrator.addRequest({
      placement: "placement2",
      productId: "prod2",
      responseMode: "JSON_ORIGINAL",
      flags
    })

    // Advance timers to trigger batching
    vi.advanceTimersByTime(100)

    await Promise.all([promise1, promise2])

    // Should have combined products
    expect(mockBuilder.setProducts).toHaveBeenCalledWith([
      { product_id: "prod1", sku_id: "var1" },
      { product_id: "prod2" }
    ])
  })

  it("should handle errors gracefully", async () => {
    const mockBuilder = getMockBuilder()
    const loadSpy = vi.fn().mockRejectedValue(new Error("API Error"))
    mockBuilder.load = loadSpy

    mockNostojs({
      createRecommendationRequest: () => mockBuilder
    })

    const flags = { skipPageViews: true, skipEvents: false }

    const promise = requestOrchestrator.addRequest({
      placement: "placement1",
      responseMode: "JSON_ORIGINAL",
      flags
    })

    // Advance timers to trigger batching
    vi.advanceTimersByTime(100)

    // Should reject with the error
    await expect(promise).rejects.toThrow("API Error")
  })
})
