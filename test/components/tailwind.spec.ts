import { getStyle } from "../../src/components/tailwind"
import { describe, expect, it } from "vitest"

describe("getStyle", () => {
  it("should return null for unknown class names", () => {
    expect(getStyle("unknown")).toBeNull()
  })

  it("should return margin styles", () => {
    expect(getStyle("m-4")).toEqual([".m-4", { margin: "1rem" }])
    expect(getStyle("mt-2")).toEqual([".mt-2", { marginTop: "0.5rem" }])
    expect(getStyle("mr-8")).toEqual([".mr-8", { marginRight: "2rem" }])
    expect(getStyle("mb-1")).toEqual([".mb-1", { marginBottom: "0.25rem" }])
    expect(getStyle("ml-3")).toEqual([".ml-3", { marginLeft: "0.75rem" }])
  })

  it("should return padding styles", () => {
    expect(getStyle("p-4")).toEqual([".p-4", { padding: "1rem" }])
  })

  it("should return background color styles", () => {
    expect(getStyle("bg-red")).toEqual([".bg-red", { backgroundColor: "red" }])
    expect(getStyle("bg-#fff")).toEqual([".bg-#fff", { backgroundColor: "#fff" }])
    expect(getStyle("bg-#ffffff")).toEqual([".bg-#ffffff", { backgroundColor: "#ffffff" }])
  })

  it("should return text styles (font size and color)", () => {
    expect(getStyle("text-12")).toEqual([".text-12", { fontSize: "1.5rem" }])
    expect(getStyle("text-blue")).toEqual([".text-blue", { color: "blue" }])
    expect(getStyle("text-#000")).toEqual([".text-#000", { color: "#000" }])
  })

  it("should return flex styles", () => {
    expect(getStyle("flex")).toEqual([".flex", { display: "flex" }])
    expect(getStyle("flex-row")).toEqual([".flex-row", { flexDirection: "row" }])
    expect(getStyle("flex-col")).toEqual([".flex-col", { flexDirection: "column" }])
  })

  it("should return items styles", () => {
    expect(getStyle("items-start")).toEqual([".items-start", { alignItems: "start" }])
    expect(getStyle("items-center")).toEqual([".items-center", { alignItems: "center" }])
    expect(getStyle("items-end")).toEqual([".items-end", { alignItems: "end" }])
    expect(getStyle("items-baseline")).toEqual([".items-baseline", { alignItems: "baseline" }])
    expect(getStyle("items-stretch")).toEqual([".items-stretch", { alignItems: "stretch" }])
  })

  it("should return justify styles", () => {
    expect(getStyle("justify-start")).toEqual([".justify-start", { justifyContent: "start" }])
    expect(getStyle("justify-center")).toEqual([".justify-center", { justifyContent: "center" }])
    expect(getStyle("justify-end")).toEqual([".justify-end", { justifyContent: "end" }])
    expect(getStyle("justify-between")).toEqual([".justify-between", { justifyContent: "between" }])
    expect(getStyle("justify-around")).toEqual([".justify-around", { justifyContent: "around" }])
    expect(getStyle("justify-evenly")).toEqual([".justify-evenly", { justifyContent: "evenly" }])
  })

  it("should return width styles", () => {
    expect(getStyle("w-4")).toEqual([".w-4", { width: "1rem" }])
  })

  it("should return height styles", () => {
    expect(getStyle("h-4")).toEqual([".h-4", { height: "1rem" }])
  })

  it("should handle pseudo classes", () => {
    expect(getStyle("hover:m-4")).toEqual([".'hover:m-4':hover", { margin: "1rem" }])
    expect(getStyle("focus:text-red")).toEqual([".'focus:text-red':focus", { color: "red" }])
  })

  it("should return border styles", () => {
    expect(getStyle("border")).toEqual([".border", { border: "1px solid black" }])
    expect(getStyle("border-2")).toEqual([".border-2", { borderWidth: "2px" }])
    expect(getStyle("border-#f00")).toEqual([".border-#f00", { borderColor: "#f00" }])
  })
})
