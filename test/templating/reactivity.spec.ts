import { describe, it, expect, vi } from "vitest"
import { reactive, effect, computed } from "@/templating/reactivity"

describe("reactivity:reactive", () => {
  it("should make an object reactive", () => {
    const obj = reactive({ count: 0 })
    let dummy: number
    effect(() => {
      dummy = obj.count
    })
    expect(dummy!).toBe(0)
    obj.count = 1
    expect(dummy!).toBe(1)
  })

  it("should track multiple properties", () => {
    const obj = reactive({ count: 0, name: "test" })
    let dummyCount: number
    let dummyName: string
    effect(() => {
      dummyCount = obj.count
    })
    effect(() => {
      dummyName = obj.name
    })
    expect(dummyCount!).toBe(0)
    expect(dummyName!).toBe("test")
    obj.count = 1
    expect(dummyCount!).toBe(1)
    expect(dummyName!).toBe("test")
    obj.name = "updated"
    expect(dummyName!).toBe("updated")
    expect(dummyCount!).toBe(1)
  })

  it("should handle nested objects", () => {
    const obj = reactive({ nested: { count: 0 } })
    let dummy: number
    effect(() => {
      dummy = obj.nested.count
    })
    expect(dummy!).toBe(0)
    obj.nested.count = 1
    expect(dummy!).toBe(1)
  })

  it("should not trigger effect if value hasn't changed", () => {
    const obj = reactive({ count: 0 })
    const fn = vi.fn(() => {
      // Access the property to track it
      return obj.count
    })
    effect(fn)
    expect(fn).toHaveBeenCalledTimes(1)
    obj.count = 0
    expect(fn).toHaveBeenCalledTimes(1)
    obj.count = 1
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it("should work with arrays", () => {
    const arr = reactive([1, 2, 3])
    let dummy: number
    effect(() => {
      dummy = arr[0]
    })
    expect(dummy!).toBe(1)
    arr[0] = 10
    expect(dummy!).toBe(10)
  })
})

describe("reactivity:effect", () => {
  it("should run effect immediately", () => {
    const fn = vi.fn()
    effect(fn)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("should track dependencies and re-run when they change", () => {
    const obj = reactive({ count: 0 })
    const fn = vi.fn(() => {
      return obj.count
    })
    effect(fn)
    expect(fn).toHaveBeenCalledTimes(1)
    obj.count = 1
    expect(fn).toHaveBeenCalledTimes(2)
    obj.count = 2
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it("should handle multiple effects on same property", () => {
    const obj = reactive({ count: 0 })
    const fn1 = vi.fn(() => obj.count)
    const fn2 = vi.fn(() => obj.count)
    effect(fn1)
    effect(fn2)
    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)
    obj.count = 1
    expect(fn1).toHaveBeenCalledTimes(2)
    expect(fn2).toHaveBeenCalledTimes(2)
  })
})

describe("reactivity:computed", () => {
  it("should compute value lazily", () => {
    const obj = reactive({ count: 0 })
    const getter = vi.fn(() => obj.count * 2)
    const double = computed(getter)
    expect(getter).toHaveBeenCalledTimes(0)
    expect(double.value).toBe(0)
    expect(getter).toHaveBeenCalledTimes(1)
    // Accessing again should not recompute
    expect(double.value).toBe(0)
    expect(getter).toHaveBeenCalledTimes(1)
  })

  it("should update when dependency changes", () => {
    const obj = reactive({ count: 0 })
    const getter = vi.fn(() => obj.count * 2)
    const double = computed(getter)
    expect(double.value).toBe(0)
    expect(getter).toHaveBeenCalledTimes(1)
    obj.count = 1
    expect(double.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)
  })

  it("should work with multiple dependencies", () => {
    const obj = reactive({ a: 1, b: 2 })
    const sum = computed(() => obj.a + obj.b)
    expect(sum.value).toBe(3)
    obj.a = 2
    expect(sum.value).toBe(4)
    obj.b = 3
    expect(sum.value).toBe(5)
  })
})
