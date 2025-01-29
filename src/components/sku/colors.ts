import colors from "./colors.json"

export type ColorValue = {
  hex: string
  rgb: number[]
  name: string
}

export default function () {
  const _loadedColors: Record<string, ColorValue> = {}

  function initColors() {
    Object.entries(colors).forEach(([k, v]) => (_loadedColors[k] = v))
  }

  initColors()

  function getHEX(key: string) {
    return _loadedColors[key].hex
  }

  function getRGB(key: string) {
    return _loadedColors[key].rgb
  }

  return {
    getHEX,
    getRGB
  }
}
