import { nostojs } from "@nosto/nosto-js"
import { Product, JSONResult, AttributedCampaignResult } from "@nosto/nosto-js/client"

type RecommendationResult = JSONResult | string | AttributedCampaignResult | undefined

interface CampaignRequest {
  placement: string
  productId?: string
  variantId?: string
  responseMode: "HTML" | "JSON_ORIGINAL"
  resolve: (result: RecommendationResult) => void
  reject: (error: Error) => void
}

interface RequestGroup {
  responseMode: "HTML" | "JSON_ORIGINAL"
  requests: CampaignRequest[]
}

// State for the request orchestrator - using closures
let pendingRequests: CampaignRequest[] = []
let batchTimer: number | null = null
const batchDelay = 50 // 50ms delay to collect requests

export function addRequest(request: Omit<CampaignRequest, "resolve" | "reject">) {
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

function scheduleBatch() {
  if (batchTimer !== null) {
    return // Timer already scheduled
  }

  batchTimer = window.setTimeout(() => {
    processBatch()
    batchTimer = null
  }, batchDelay)
}

async function processBatch() {
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

function groupRequests(requests: CampaignRequest[]) {
  const groups: RequestGroup[] = []

  requests.forEach(request => {
    let group = groups.find(g => g.responseMode === request.responseMode)

    if (!group) {
      group = {
        responseMode: request.responseMode,
        requests: []
      }
      groups.push(group)
    }

    group.requests.push(request)
  })

  return groups
}

async function processGroup(group: RequestGroup) {
  try {
    const api = await new Promise(nostojs)
    const request = api
      .createRecommendationRequest({ includeTagging: true })
      .disableCampaignInjection()
      .setElements(group.requests.map(r => r.placement))
      .setResponseMode(group.responseMode)

    // Combine products from all requests in the group
    const products: Product[] = []
    group.requests.forEach(req => {
      if (req.productId) {
        products.push({
          product_id: req.productId,
          ...(req.variantId ? { sku_id: req.variantId } : {})
        })
      }
    })

    if (products.length > 0) {
      request.setProducts(products)
    }

    const { recommendations } = await request.load()

    // Distribute results back to individual requests
    group.requests.forEach(req => {
      const result = recommendations[req.placement]
      req.resolve(result)
    })
  } catch (error) {
    // If the batch request fails, reject all requests in the group
    const errorObj = error instanceof Error ? error : new Error(String(error))
    group.requests.forEach(req => {
      req.reject(errorObj)
    })
  }
}
