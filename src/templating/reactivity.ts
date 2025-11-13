/**
 * A minimal reactivity engine inspired by Vue 3's reactivity system.
 * This provides a simple implementation for proof of concept.
 */

// Type for effect functions
type Effect = () => void

// Currently active effect being tracked
let activeEffect: Effect | null = null

// Map to store dependencies: target -> key -> Set of effects
const targetMap = new WeakMap<object, Map<string | symbol, Set<Effect>>>()

/**
 * Track a dependency for the currently active effect
 */
function track(target: object, key: string | symbol) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}

/**
 * Trigger all effects that depend on this property
 */
function trigger(target: object, key: string | symbol) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const dep = depsMap.get(key)
  if (!dep) return

  // Create a copy to avoid infinite loops
  const effects = new Set(dep)
  effects.forEach(effect => effect())
}

/**
 * Create a reactive proxy around an object
 */
export function reactive<T extends object>(target: T): T {
  return new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver)
      track(target, key)
      // If the result is an object, make it reactive too
      if (result !== null && typeof result === "object") {
        return reactive(result)
      }
      return result
    },
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver)
      const result = Reflect.set(target, key, value, receiver)
      // Only trigger if the value actually changed
      if (oldValue !== value) {
        trigger(target, key)
      }
      return result
    }
  })
}

/**
 * Run an effect function and track its dependencies
 */
export function effect(fn: Effect) {
  const effectFn = () => {
    activeEffect = effectFn
    try {
      fn()
    } finally {
      activeEffect = null
    }
  }
  effectFn()
  return effectFn
}

/**
 * Create a computed value that automatically updates when dependencies change
 */
export function computed<T>(getter: () => T) {
  let value: T
  let dirty = true

  // Create an effect that marks computed as dirty when dependencies change
  const computedEffect = () => {
    dirty = true
  }

  // Setup initial computation and tracking
  const evaluate = () => {
    if (dirty) {
      const prevEffect = activeEffect
      activeEffect = computedEffect
      value = getter()
      activeEffect = prevEffect
      dirty = false
    }
  }

  return {
    get value() {
      evaluate()
      return value
    }
  }
}
