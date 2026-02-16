export type RepeatingItemsResult = {
  /** The parent element whose direct children are the repeated items */
  container: Element
  /** The repeated child elements (direct children of container) */
  items: Element[]
  /** Tag name of the repeated items (e.g., "LI", "DIV") */
  itemTag: string
  /**
   * Best-effort selector for the repeated items under the container.
   * Usually something like ".resource-list__item" or "li.grid__item".
   * If no stable class exists, may be a tag selector like "li" or "div".
   */
  itemSelector: string
  debug?: {
    score: number
    depth: number
    reason: string
  }
}

export type FindRepeatingOptions = {
  minItems?: number // default 2
  maxDepth?: number // default 8
  /** Prefer UL/OL containers with LI children */
  preferLists?: boolean // default true
  /**
   * Optional: filter items (e.g., only count items that contain an <a href*="/products/">).
   * This is the most effective way to avoid matching menus, etc.
   */
  isItemElement?: (el: Element) => boolean
}

/**
 * Convenience predicate for Shopify product cards:
 * item element must contain at least one anchor linking to /products/.
 */
export function isShopifyProductItem(el: Element): boolean {
  return el.querySelector('a[href*="/products/"]') !== null
}

/**
 * Find the best repeating "item" element group within a scoped root element.
 * You can pass `isItemElement: isShopifyProductItem` to strongly lock onto product cards.
 */
export function findRepeatingItems(root: Element, opts: FindRepeatingOptions = {}): RepeatingItemsResult | null {
  const { minItems = 2, maxDepth = 8, preferLists = true, isItemElement } = opts

  function children(el: Element) {
    return Array.from(el.children).filter(c => c.tagName !== "SCRIPT" && c.tagName !== "STYLE")
  }

  function depthBetween(ancestor: Element, node: Element): number {
    let d = 0
    let cur: Element | null = node
    while (cur && cur !== ancestor) {
      cur = cur.parentElement
      d++
      if (d > 80) break
    }
    return cur === ancestor ? d : 999
  }

  function cssEscape(ident: string): string {
    // Minimal escape suitable for common Shopify classnames.
    return ident.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1")
  }

  function pickBestItemSelector(items: Element[], tag: string): { selector: string; reason: string } {
    // Prefer a class that is present on most/all items.
    const classCounts = new Map<string, number>()
    for (const it of items) {
      for (const cls of Array.from(it.classList)) {
        classCounts.set(cls, (classCounts.get(cls) ?? 0) + 1)
      }
    }

    const sorted = Array.from(classCounts.entries())
      .filter(([, count]) => count >= Math.ceil(items.length * 0.8)) // appears on >=80% of items
      .sort((a, b) => {
        const byCount = b[1] - a[1]
        if (byCount !== 0) return byCount
        return b[0].length - a[0].length
      })

    if (sorted.length > 0) {
      const bestClass = sorted[0][0]
      return { selector: `${tag.toLowerCase()}.${cssEscape(bestClass)}`, reason: "class-shared-by-items" }
    }

    return { selector: tag.toLowerCase(), reason: "tag-only-fallback" }
  }

  function sharedClassCount(items: Element[]): number {
    if (items.length === 0) return 0
    const counts = new Map<string, number>()
    for (const it of items) for (const cls of Array.from(it.classList)) counts.set(cls, (counts.get(cls) ?? 0) + 1)
    return Array.from(counts.values()).filter(c => c === items.length).length
  }

  function allowedItemForContainer(container: Element, item: Element): boolean {
    // Strong semantic rule: UL/OL should have LI items.
    if ((container.tagName === "UL" || container.tagName === "OL") && item.tagName !== "LI") return false
    return true
  }

  type Candidate = {
    container: Element
    items: Element[]
    itemTag: string
    score: number
    depth: number
    reason: string
  }

  let best: Candidate | null = null

  const queue: Array<{ el: Element; depth: number }> = [{ el: root, depth: 0 }]

  while (queue.length) {
    const { el, depth } = queue.shift()!
    if (depth > maxDepth) continue

    const kids = children(el)

    if (kids.length >= minItems) {
      // Apply container->item semantic filter first
      const semanticKids = kids.filter(k => allowedItemForContainer(el, k))
      if (semanticKids.length >= minItems) {
        // Apply item predicate (Shopify product anchor) if provided
        const predicateKids = isItemElement ? semanticKids.filter(isItemElement) : semanticKids
        if (predicateKids.length >= minItems) {
          // Group by tag (LI vs DIV, etc.)
          const byTag = new Map<string, Element[]>()
          for (const k of predicateKids) byTag.set(k.tagName, [...(byTag.get(k.tagName) ?? []), k])

          for (const [tag, items] of byTag.entries()) {
            if (items.length < minItems) continue

            const dominance = items.length / predicateKids.length // 1.0 if all are same tag
            const trueDepth = depthBetween(root, el)

            let score = 0

            // Base: more items is better
            score += items.length * 12

            // Prefer uniform repeated structure
            score += Math.round(dominance * 25)

            // Strongly prefer UL/OL + LI
            if (preferLists && (el.tagName === "UL" || el.tagName === "OL") && tag === "LI") score += 45

            // Prefer items that share a class (helps ".resource-list__item" and ".grid__item")
            if (sharedClassCount(items) > 0) score += 20

            // Prefer closer to root (avoid deep nested repeats like inside each card)
            score -= trueDepth * 6

            // Penalize huge containers (avoid matching root-ish wrappers)
            score -= Math.min(220, el.querySelectorAll("*").length) * 0.12

            const reason = isItemElement
              ? 'repeated-direct-children-with-a[href*="/products/"]'
              : "repeated-direct-children"

            if (!best || score > best.score) {
              best = { container: el, items, itemTag: tag, score, depth: trueDepth, reason }
            }
          }
        }
      }
    }

    for (const c of kids) queue.push({ el: c, depth: depth + 1 })
  }

  if (!best) return null

  const { selector: itemSelector, reason: selectorReason } = pickBestItemSelector(best.items, best.itemTag)

  return {
    container: best.container,
    items: best.items,
    itemTag: best.itemTag,
    itemSelector,
    debug: { score: best.score, depth: best.depth, reason: `${best.reason}; selector=${selectorReason}` }
  }
}
