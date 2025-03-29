type TailwindMapping = {
  [key: string]: {
    regex: RegExp
    extract: (match: RegExpMatchArray) => { [key: string]: unknown } | null
  }
}

const tailwindMapping: TailwindMapping = {
  m: {
    regex: /^m-(\d+)$/,
    extract: match => ({ margin: `${+match[1] * 0.25}rem` })
  },
  mt: {
    regex: /^mt-(\d+)$/,
    extract: match => ({ marginTop: `${+match[1] * 0.25}rem` })
  },
  mr: {
    regex: /^mr-(\d+)$/,
    extract: match => ({ marginRight: `${+match[1] * 0.25}rem` })
  },
  mb: {
    regex: /^mb-(\d+)$/,
    extract: match => ({ marginBottom: `${+match[1] * 0.25}rem` })
  },
  ml: {
    regex: /^ml-(\d+)$/,
    extract: match => ({ marginLeft: `${+match[1] * 0.25}rem` })
  },
  p: {
    regex: /^p-(\d+)$/,
    extract: match => ({ padding: `${+match[1] * 0.25}rem` })
  },
  bg: {
    regex: /^bg-(#[0-9a-fA-F]{3,6}|\w+)$/,
    extract: match => ({ backgroundColor: match[1] })
  },
  text: {
    regex: /^text-(\d+|#[0-9a-fA-F]{3,6}|\w+)$/,
    extract: match => {
      const value = match[1]
      return !isNaN(+value) ? { fontSize: `${+value * 0.125}rem` } : { color: value }
    }
  },
  flex: {
    regex: /^(flex|flex-row|flex-col)$/,
    extract: match => {
      if (match[1] === "flex") return { display: "flex" }
      if (match[1] === "flex-row") return { flexDirection: "row" }
      if (match[1] === "flex-col") return { flexDirection: "column" }
      return null
    }
  },
  items: {
    regex: /^items-(start|center|end|baseline|stretch)$/,
    extract: match => ({ alignItems: match[1] })
  },
  justify: {
    regex: /^justify-(start|center|end|between|around|evenly)$/,
    extract: match => ({ justifyContent: match[1] })
  },
  w: {
    regex: /^w-(\d+)$/,
    extract: match => ({ width: `${+match[1] * 0.25}rem` })
  },
  h: {
    regex: /^h-(\d+)$/,
    extract: match => ({ height: `${+match[1] * 0.25}rem` })
  },
  border: {
    regex: /^border(-(#[0-9a-fA-F]{3,6}|\d+))?$/,
    extract: match => {
      if (!match[1]) return { border: "1px solid black" }
      if (!isNaN(+match[1])) return { borderWidth: `${match[1].substring(1)}px` }
      return { borderColor: match[1].substring(1) }
    }
  }
}

type StyleEntry = [string, object]

export function getStyle(className: string): StyleEntry | null {
  if (className.includes(":")) {
    const [pseudoClass, baseClass] = className.split(":")
    const styles = getStyle(baseClass)
    return styles ? [`.'${className}':${pseudoClass}`, styles[1]] : null
  }

  const [key] = className.split("-")
  const mapping = tailwindMapping[key]
  if (mapping && mapping.regex) {
    const match = className.match(mapping.regex)
    if (match) {
      const resolved = mapping.extract(match)
      return resolved ? [`.${className}`, resolved] : null
    }
  }
  return null
}
