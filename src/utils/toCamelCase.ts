export function toCamelCase(str: string) {
  return str.replace(/-([a-z])/g, (_, l) => l.toUpperCase())
}
