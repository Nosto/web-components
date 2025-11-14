import { ExampleHandlesQuery } from "./queries"

const cache = new Map<string, Promise<string[]>>()

export async function getExampleHandles(root: string, amount = 12) {
  if (!cache.has(root)) {
    cache.set(root, getHandles(root, amount))
  }
  return cache.get(root)!
}

async function getHandles(root: string, amount: number) {
  const endpoint = `${root}api/2025-10/graphql.json`
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: ExampleHandlesQuery,
      variables: { first: amount }
    })
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch example handles from ${endpoint}: ${response.status} ${response.statusText}`)
  }
  const data = await response.json()
  return data?.data?.products?.edges?.map((edge: { node: { handle: string } }) => edge.node.handle) ?? []
}
