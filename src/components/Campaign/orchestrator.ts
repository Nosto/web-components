import { nostojs } from "@nosto/nosto-js"
import { AttributedCampaignResult, JSONResult } from "@nosto/nosto-js/client"

type RecommendationResult = JSONResult | string | AttributedCampaignResult | undefined

interface Request {
  placement: string
  responseMode: "JSON_ORIGINAL" | "HTML"
  productId?: string
  variantId?: string
}

interface CampaignRequest extends Request {
  resolve: (result: RecommendationResult) => void
  reject: (error: Error) => void
}

interface RequestGroup {
  requests: CampaignRequest[]
}

let pendingRequests: CampaignRequest[] = []
let batchTimer: number | null = null
const batchDelay = 50 // 50ms delay to collect requests

export function addRequest(request: Request) {
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
    let group = groups.find(
      g =>
        g.requests[0].responseMode === request.responseMode &&
        g.requests[0].productId === request.productId &&
        g.requests[0].variantId === request.variantId
    )

    if (!group) {
      group = {
        requests: []
      }
      groups.push(group)
    }
    group.requests.push(request)
  })

  return groups
}

async function processGroup({ requests }: RequestGroup) {
  try {
    const api = await new Promise(nostojs)
    const request = api
      .createRecommendationRequest({ includeTagging: true })
      .disableCampaignInjection()
      .setElements(requests.map(r => r.placement))
      .setResponseMode(requests[0].responseMode)

    if (requests[0].productId) {
      const { productId, variantId } = requests[0]
      request.setProducts([
        {
          product_id: productId,
          ...(variantId ? { sku_id: variantId } : {})
        }
      ])
    }

    const { recommendations } = await request.load()

    // Distribute results back to individual requests
    requests.forEach(req => {
      req.resolve(recommendations[req.placement])
    })
  } catch (error) {
    // If the batch request fails, reject all requests in the group
    const errorObj = error instanceof Error ? error : new Error(String(error))
    requests.forEach(req => {
      req.reject(errorObj)
    })
  }
}
