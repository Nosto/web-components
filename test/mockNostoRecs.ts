import { JSONProduct, RequestBuilder } from "@nosto/nosto-js/client"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { vi } from "vitest"

type MockResult = { products: Partial<JSONProduct>[] } | { html: string } | Record<string, unknown> | string

interface MockNostoRecsOptions {
  placements?: {
    injectCampaigns?: (...args: unknown[]) => unknown
  }
}

// Overload for single placement
export function mockNostoRecs(
  placement: string,
  result: MockResult,
  options?: MockNostoRecsOptions
): {
  load: ReturnType<typeof vi.fn>
  mockBuilder: Partial<RequestBuilder>
  attributeProductClicksInCampaign: ReturnType<typeof vi.fn>
  injectCampaigns: ReturnType<typeof vi.fn>
}

// Overload for multiple placements
export function mockNostoRecs(
  recommendations: Record<string, MockResult>,
  options?: MockNostoRecsOptions
): {
  load: ReturnType<typeof vi.fn>
  mockBuilder: Partial<RequestBuilder>
  attributeProductClicksInCampaign: ReturnType<typeof vi.fn>
  injectCampaigns: ReturnType<typeof vi.fn>
}

export function mockNostoRecs(
  placementOrRecommendations: string | Record<string, MockResult>,
  resultOrOptions?: MockResult | MockNostoRecsOptions,
  optionsArg?: MockNostoRecsOptions
) {
  let recommendations: Record<string, MockResult>
  let options: MockNostoRecsOptions

  if (typeof placementOrRecommendations === "string") {
    // Single placement mode
    recommendations = { [placementOrRecommendations]: resultOrOptions as MockResult }
    options = optionsArg || {}
  } else {
    // Multiple placements mode
    recommendations = placementOrRecommendations
    options = (resultOrOptions as MockNostoRecsOptions) || {}
  }

  const load = vi.fn().mockResolvedValue({ recommendations })

  const mockBuilder: Partial<RequestBuilder> = {
    disableCampaignInjection: () => mockBuilder as RequestBuilder,
    setElements: vi.fn(() => mockBuilder as RequestBuilder),
    setResponseMode: vi.fn(() => mockBuilder as RequestBuilder),
    setProducts: vi.fn(() => mockBuilder as RequestBuilder),
    load
  }

  const attributeProductClicksInCampaign = vi.fn()
  const injectCampaigns = options.placements?.injectCampaigns || vi.fn()

  const api = {
    createRecommendationRequest: () => mockBuilder as RequestBuilder,
    attributeProductClicksInCampaign,
    placements: {
      injectCampaigns
    }
  }
  mockNostojs(api)

  return {
    load,
    mockBuilder,
    attributeProductClicksInCampaign,
    injectCampaigns
  }
}
