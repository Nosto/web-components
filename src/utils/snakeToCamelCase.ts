export function snakeToCamelCase(str: string) {
  return str.replace(/_([a-z])/g, (_, l) => l.toUpperCase())
}
