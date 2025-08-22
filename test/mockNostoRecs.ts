import { JSONProduct, RequestBuilder } from "@nosto/nosto-js/client"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { vi } from "vitest"

export function mockNostoRecs(placement: string, result: { products: Partial<JSONProduct>[] }) {
  const load = vi.fn().mockResolvedValue({
    recommendations: {
      [placement]: result
    }
  })

  const mockBuilder: Partial<RequestBuilder> = {
    disableCampaignInjection: () => mockBuilder as RequestBuilder,
    setElements: vi.fn(() => mockBuilder as RequestBuilder),
    setResponseMode: vi.fn(() => mockBuilder as RequestBuilder),
    setProducts: vi.fn(() => mockBuilder as RequestBuilder),
    load
  }

  const attributeProductClicksInCampaign = vi.fn()

  const api = {
    createRecommendationRequest: () => mockBuilder as RequestBuilder,
    attributeProductClicksInCampaign
  }
  mockNostojs(api)

  return {
    load,
    mockBuilder,
    attributeProductClicksInCampaign
  }
}
