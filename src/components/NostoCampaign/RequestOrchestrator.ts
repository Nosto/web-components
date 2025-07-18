import { nostojs } from "@nosto/nosto-js"

export interface CampaignRequestConfig {
  placement: string
  responseMode: "HTML" | "JSON_ORIGINAL"
  productId?: string
  variantId?: string
  flags: {
    skipPageViews: boolean
    skipEvents: boolean
  }
}

export interface CampaignRequest {
  config: CampaignRequestConfig
  resolve: (result: unknown) => void
  reject: (error: unknown) => void
}

/**
 * Orchestrates and batches compatible ev1 recommendation requests to reduce API calls
 */
export class RequestOrchestrator {
  private static instance: RequestOrchestrator | null = null
  private pendingRequests: CampaignRequest[] = []
  private batchTimeout: NodeJS.Timeout | null = null
  private readonly BATCH_DELAY_MS = 16 // One frame delay to batch requests

  private constructor() {}

  static getInstance(): RequestOrchestrator {
    if (!RequestOrchestrator.instance) {
      RequestOrchestrator.instance = new RequestOrchestrator()
    }
    return RequestOrchestrator.instance
  }

  /**
   * Schedules a campaign request for batching
   */
  scheduleRequest(config: CampaignRequestConfig): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const request: CampaignRequest = { config, resolve, reject }
      this.pendingRequests.push(request)

      // Schedule batch execution if not already scheduled
      if (!this.batchTimeout) {
        this.batchTimeout = setTimeout(() => {
          this.executeBatch()
        }, this.BATCH_DELAY_MS)
      }
    })
  }

  /**
   * Groups requests by compatibility and executes them as batched requests
   */
  private async executeBatch(): Promise<void> {
    const requests = this.pendingRequests
    this.pendingRequests = []
    this.batchTimeout = null

    if (requests.length === 0) return

    try {
      // Group compatible requests
      const groups = this.groupCompatibleRequests(requests)

      // Execute each group as a combined request
      await Promise.all(groups.map(group => this.executeGroup(group)))
    } catch (error) {
      // If batching fails, reject all pending requests
      requests.forEach(request => request.reject(error))
    }
  }

  /**
   * Groups requests that can be combined into a single API call
   */
  private groupCompatibleRequests(requests: CampaignRequest[]): CampaignRequest[][] {
    const groups: CampaignRequest[][] = []

    for (const request of requests) {
      let foundGroup = false

      // Find a compatible group
      for (const group of groups) {
        if (this.areRequestsCompatible(request.config, group[0].config)) {
          group.push(request)
          foundGroup = true
          break
        }
      }

      // Create new group if no compatible group found
      if (!foundGroup) {
        groups.push([request])
      }
    }

    return groups
  }

  /**
   * Determines if two requests can be batched together
   */
  private areRequestsCompatible(a: CampaignRequestConfig, b: CampaignRequestConfig): boolean {
    return (
      a.responseMode === b.responseMode &&
      a.flags.skipPageViews === b.flags.skipPageViews &&
      a.flags.skipEvents === b.flags.skipEvents &&
      a.productId === b.productId &&
      a.variantId === b.variantId
    )
  }

  /**
   * Executes a group of compatible requests as a single batched API call
   */
  private async executeGroup(group: CampaignRequest[]): Promise<void> {
    try {
      const api = await new Promise(nostojs)
      const representative = group[0].config
      const placements = group.map(req => req.config.placement)

      const request = api
        .createRecommendationRequest({ includeTagging: true })
        .disableCampaignInjection()
        .setElements(placements)
        .setResponseMode(representative.responseMode)

      if (representative.productId) {
        request.setProducts([
          {
            product_id: representative.productId,
            ...(representative.variantId ? { sku_id: representative.variantId } : {})
          }
        ])
      }

      const { recommendations } = await request.load(representative.flags)

      // Distribute results back to individual requests
      group.forEach(({ config, resolve }) => {
        const result = recommendations[config.placement]
        resolve(result)
      })
    } catch (error) {
      // If batch execution fails, reject all requests in the group
      group.forEach(({ reject }) => reject(error))
    }
  }
}
