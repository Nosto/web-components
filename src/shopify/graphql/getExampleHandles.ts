export async function getExampleHandles(root: string, amount = 12) {
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
  return data?.data?.products?.edges?.map((edge: { node: { handle: string } }) => edge.node.handle) ?? []
}
