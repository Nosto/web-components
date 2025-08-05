import { describe, it, beforeEach, expect, vi } from "vitest"
import { addRequest } from "@/components/NostoCampaign/orchestrator"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { RequestBuilder } from "@nosto/nosto-js/client"

describe("orchestrator", () => {
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

    // Start two requests with compatible parameters
    const promise1 = addRequest({
      placement: "placement1",
      responseMode: "JSON_ORIGINAL"
    })

    const promise2 = addRequest({
      placement: "placement2",
      responseMode: "JSON_ORIGINAL"
    })

    // Advance timers to trigger batching
    vi.advanceTimersByTime(100)

    const [result1, result2] = await Promise.all([promise1, promise2])

    // Should have made only one API call
    expect(loadSpy).toHaveBeenCalledTimes(1)
    expect(loadSpy).toHaveBeenCalledWith({
      skipEvents: true,
      skipPageViews: true
    })

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

    // Start two requests with different response modes
    const promise1 = addRequest({
      placement: "placement1",
      responseMode: "JSON_ORIGINAL"
    })

    const promise2 = addRequest({
      placement: "placement2",
      responseMode: "HTML"
    })

    // Advance timers to trigger batching
    vi.advanceTimersByTime(100)

    await Promise.all([promise1, promise2])

    // Should have made two separate API calls due to different response modes
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

    // Start two requests with products
    const promise1 = addRequest({
      placement: "placement1",
      productId: "prod1",
      responseMode: "JSON_ORIGINAL"
    })

    const promise2 = addRequest({
      placement: "placement2",
      productId: "prod1",
      responseMode: "JSON_ORIGINAL"
    })

    // Advance timers to trigger batching
    vi.advanceTimersByTime(100)

    await Promise.all([promise1, promise2])

    // Should have combined products
    expect(mockBuilder.setProducts).toHaveBeenCalledTimes(1)
    expect(mockBuilder.setProducts).toHaveBeenCalledWith([{ product_id: "prod1" }])
  })

  it("should handle errors gracefully", async () => {
    const mockBuilder = getMockBuilder()
    const loadSpy = vi.fn().mockRejectedValue(new Error("API Error"))
    mockBuilder.load = loadSpy

    mockNostojs({
      createRecommendationRequest: () => mockBuilder
    })

    const promise = addRequest({
      placement: "placement1",
      responseMode: "JSON_ORIGINAL"
    })

    // Advance timers to trigger batching
    vi.advanceTimersByTime(100)

    // Should reject with the error
    await expect(promise).rejects.toThrow("API Error")
  })
})
