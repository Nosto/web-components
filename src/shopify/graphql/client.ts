import ky from "ky"

export const graphqlClient = ky.create({
  headers: {
    "Content-Type": "application/json"
  },
  retry: 2,
  timeout: 10000
})

