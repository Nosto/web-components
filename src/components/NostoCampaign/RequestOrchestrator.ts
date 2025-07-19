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

// Module-level state for batching requests
let pendingRequests: CampaignRequest[] = []
let batchTimeout: NodeJS.Timeout | null = null
const BATCH_DELAY_MS = 16 // One frame delay to batch requests

/**
 * Schedules a campaign request for batching
 */
export function scheduleRequest(config: CampaignRequestConfig): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const request: CampaignRequest = { config, resolve, reject }
    pendingRequests.push(request)

    // Schedule batch execution if not already scheduled
    if (!batchTimeout) {
      batchTimeout = setTimeout(() => {
        executeBatch()
      }, BATCH_DELAY_MS)
    }
  })
}

/**
 * Groups requests by compatibility and executes them as batched requests
 */
async function executeBatch(): Promise<void> {
  const requests = pendingRequests
  pendingRequests = []
  batchTimeout = null

  if (requests.length === 0) return

  try {
    // Group compatible requests
    const groups = groupCompatibleRequests(requests)

    // Execute each group as a combined request
    await Promise.all(groups.map(group => executeGroup(group)))
  } catch (error) {
    // If batching fails, reject all pending requests
    requests.forEach(request => request.reject(error))
  }
}

/**
 * Groups requests that can be combined into a single API call
 */
function groupCompatibleRequests(requests: CampaignRequest[]): CampaignRequest[][] {
  const groups: CampaignRequest[][] = []

  for (const request of requests) {
    let foundGroup = false

    // Find a compatible group
    for (const group of groups) {
      if (areRequestsCompatible(request.config, group[0].config)) {
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
function areRequestsCompatible(a: CampaignRequestConfig, b: CampaignRequestConfig) {
  return a.responseMode === b.responseMode && a.productId === b.productId && a.variantId === b.variantId
}

/**
 * Executes a group of compatible requests as a single batched API call
 */
async function executeGroup(group: CampaignRequest[]) {
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

/**
 * Resets the orchestrator state (useful for testing)
 */
export function resetOrchestrator() {
  pendingRequests = []
  if (batchTimeout) {
    clearTimeout(batchTimeout)
    batchTimeout = null
  }
}
