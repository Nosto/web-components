import { nostojs } from "@nosto/nosto-js"
import { Product, RecommendationRequestFlags, JSONResult, AttributedCampaignResult } from "@nosto/nosto-js/client"

type RecommendationResult = JSONResult | string | AttributedCampaignResult | undefined

interface CampaignRequest {
  placement: string
  productId?: string
  variantId?: string
  responseMode: "HTML" | "JSON_ORIGINAL"
  flags: RecommendationRequestFlags
  resolve: (result: RecommendationResult) => void
  reject: (error: Error) => void
}

interface RequestGroup {
  responseMode: "HTML" | "JSON_ORIGINAL"
  flags: RecommendationRequestFlags
  requests: CampaignRequest[]
}

class RequestOrchestrator {
  private pendingRequests: CampaignRequest[] = []
  private batchTimer: number | null = null
  private readonly batchDelay = 50 // 50ms delay to collect requests

  async addRequest(request: Omit<CampaignRequest, "resolve" | "reject">): Promise<RecommendationResult> {
    return new Promise((resolve, reject) => {
      const campaignRequest: CampaignRequest = {
        ...request,
        resolve,
        reject
      }

      this.pendingRequests.push(campaignRequest)
      this.scheduleBatch()
    })
  }

  private scheduleBatch(): void {
    if (this.batchTimer !== null) {
      return // Timer already scheduled
    }

    this.batchTimer = window.setTimeout(() => {
      this.processBatch()
      this.batchTimer = null
    }, this.batchDelay)
  }

  private async processBatch(): Promise<void> {
    if (this.pendingRequests.length === 0) {
      return
    }

    const requests = [...this.pendingRequests]
    this.pendingRequests = []

    // Group requests by compatible criteria
    const groups = this.groupRequests(requests)

    // Process each group
    await Promise.all(groups.map(group => this.processGroup(group)))
  }

  private groupRequests(requests: CampaignRequest[]): RequestGroup[] {
    const groups: RequestGroup[] = []

    for (const request of requests) {
      let group = groups.find(
        g => g.responseMode === request.responseMode && this.areCompatibleFlags(g.flags, request.flags)
      )

      if (!group) {
        group = {
          responseMode: request.responseMode,
          flags: request.flags,
          requests: []
        }
        groups.push(group)
      }

      group.requests.push(request)
    }

    return groups
  }

  private areCompatibleFlags(flags1: RecommendationRequestFlags, flags2: RecommendationRequestFlags): boolean {
    return flags1.skipPageViews === flags2.skipPageViews && flags1.skipEvents === flags2.skipEvents
  }

  private async processGroup(group: RequestGroup): Promise<void> {
    try {
      const api = await new Promise(nostojs)
      const request = api
        .createRecommendationRequest({ includeTagging: true })
        .disableCampaignInjection()
        .setElements(group.requests.map(r => r.placement))
        .setResponseMode(group.responseMode)

      // Combine products from all requests in the group
      const products: Product[] = []
      for (const req of group.requests) {
        if (req.productId) {
          products.push({
            product_id: req.productId,
            ...(req.variantId ? { sku_id: req.variantId } : {})
          })
        }
      }

      if (products.length > 0) {
        request.setProducts(products)
      }

      const { recommendations } = await request.load(group.flags)

      // Distribute results back to individual requests
      for (const req of group.requests) {
        const result = recommendations[req.placement]
        req.resolve(result)
      }
    } catch (error) {
      // If the batch request fails, reject all requests in the group
      const errorObj = error instanceof Error ? error : new Error(String(error))
      for (const req of group.requests) {
        req.reject(errorObj)
      }
    }
  }
}

// Export a singleton instance
export const requestOrchestrator = new RequestOrchestrator()
