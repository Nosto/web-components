const cache = new Map<string, string[]>()

export async function getExampleHandles(root: string, amount = 12) {
  if (cache.has(root)) {
    return cache.get(root)!
  }
  const endpoint = `${root}api/2025-10/graphql.json`
  const query = `
    {
      products(first: ${amount}) {
        edges {
          node {
            handle
          }
        }
      }
    }
  `
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  })
  const data = await response.json()
  const handles = data?.data?.products?.edges?.map((edge: { node: { handle: string } }) => edge.node.handle) ?? []
  cache.set(root, handles)
  return handles
}
