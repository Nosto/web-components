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

// State for the request orchestrator - using closures
let pendingRequests: CampaignRequest[] = []
let batchTimer: number | null = null
const batchDelay = 50 // 50ms delay to collect requests

export async function addRequest(request: Omit<CampaignRequest, "resolve" | "reject">): Promise<RecommendationResult> {
  return new Promise((resolve, reject) => {
    const campaignRequest: CampaignRequest = {
      ...request,
      resolve,
      reject
    }

    pendingRequests.push(campaignRequest)
    scheduleBatch()
  })
}

function scheduleBatch(): void {
  if (batchTimer !== null) {
    return // Timer already scheduled
  }

  batchTimer = window.setTimeout(() => {
    processBatch()
    batchTimer = null
  }, batchDelay)
}

async function processBatch(): Promise<void> {
  if (pendingRequests.length === 0) {
    return
  }

  const requests = [...pendingRequests]
  pendingRequests = []

  // Group requests by compatible criteria
  const groups = groupRequests(requests)

  // Process each group
  await Promise.all(groups.map(group => processGroup(group)))
}

function groupRequests(requests: CampaignRequest[]): RequestGroup[] {
  const groups: RequestGroup[] = []

  for (const request of requests) {
    let group = groups.find(g => g.responseMode === request.responseMode && areCompatibleFlags(g.flags, request.flags))

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

function areCompatibleFlags(flags1: RecommendationRequestFlags, flags2: RecommendationRequestFlags): boolean {
  return flags1.skipPageViews === flags2.skipPageViews && flags1.skipEvents === flags2.skipEvents
}

async function processGroup(group: RequestGroup): Promise<void> {
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
