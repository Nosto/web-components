import { JSONProduct, RequestBuilder } from "@nosto/nosto-js/client"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { vi } from "vitest"

type MockResult = { products: Partial<JSONProduct>[] } | { html: string } | Record<string, unknown> | string

export function mockNostoRecs(recommendations: Record<string, MockResult>) {
  const load = vi.fn().mockResolvedValue({ recommendations })

  const mockBuilder: Partial<RequestBuilder> = {
    disableCampaignInjection: () => mockBuilder as RequestBuilder,
    setElements: vi.fn(() => mockBuilder as RequestBuilder),
    setResponseMode: vi.fn(() => mockBuilder as RequestBuilder),
    setProducts: vi.fn(() => mockBuilder as RequestBuilder),
    load
  }

  const attributeProductClicksInCampaign = vi.fn()

  const injectCampaigns = vi.fn(async (campaigns: Record<string, string>, targets: Record<string, HTMLElement>) => {
    const filledElements: string[] = []
    const unFilledElements: string[] = []

    Object.keys(campaigns).forEach(placementId => {
      const target = targets[placementId]
      if (target) {
        target.innerHTML = campaigns[placementId]
        filledElements.push(placementId)
      } else {
        unFilledElements.push(placementId)
      }
    })

    return { filledElements, unFilledElements }
  })

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
