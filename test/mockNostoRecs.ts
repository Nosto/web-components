import { JSONProduct, RequestBuilder } from "@nosto/nosto-js/client"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { vi } from "vitest"

type MockResult = { products: Partial<JSONProduct>[] } | { html: string } | Record<string, unknown> | string

interface MockNostoRecsOptions {
  placements?: {
    injectCampaigns?: (...args: unknown[]) => unknown
  }
}

export function mockNostoRecs(
  recommendations: Record<string, MockResult>,
  options?: MockNostoRecsOptions
): {
  load: ReturnType<typeof vi.fn>
  mockBuilder: Partial<RequestBuilder>
  attributeProductClicksInCampaign: ReturnType<typeof vi.fn>
  injectCampaigns: ReturnType<typeof vi.fn>
} {
  const resolvedOptions = options || {}

  const load = vi.fn().mockResolvedValue({ recommendations })

  const mockBuilder: Partial<RequestBuilder> = {
    disableCampaignInjection: () => mockBuilder as RequestBuilder,
    setElements: vi.fn(() => mockBuilder as RequestBuilder),
    setResponseMode: vi.fn(() => mockBuilder as RequestBuilder),
    setProducts: vi.fn(() => mockBuilder as RequestBuilder),
    load
  }

  const attributeProductClicksInCampaign = vi.fn()
  const injectCampaigns = vi.fn(resolvedOptions.placements?.injectCampaigns)

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
