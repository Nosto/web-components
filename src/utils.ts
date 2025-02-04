export function intersectionOf(...arrays: string[][]) {
  return arrays?.reduce((intersection, currentArray) => {
    const intersectionSet = new Set(intersection)
    return currentArray.filter(item => intersectionSet.has(item))
  })
}
