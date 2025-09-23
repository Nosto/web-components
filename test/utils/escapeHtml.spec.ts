import { describe, it, expect } from "vitest"
import { escapeHtml } from "@/utils/escapeHtml"

describe("escapeHtml", () => {
  it("escapes dangerous HTML characters", () => {
    const dangerous = `<>&"'`
    const result = escapeHtml(dangerous)
    expect(result).toBe("&lt;&gt;&amp;&quot;&#039;")
  })

  it("escapes ampersands", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry")
  })

  it("escapes less than symbols", () => {
    expect(escapeHtml("5 < 10")).toBe("5 &lt; 10")
  })

  it("escapes greater than symbols", () => {
    expect(escapeHtml("10 > 5")).toBe("10 &gt; 5")
  })

  it("escapes double quotes", () => {
    expect(escapeHtml('Say "hello"')).toBe("Say &quot;hello&quot;")
  })

  it("escapes single quotes", () => {
    expect(escapeHtml("It's working")).toBe("It&#039;s working")
  })

  it("escapes script tags", () => {
    const script = "<script>alert('xss')</script>"
    const result = escapeHtml(script)
    expect(result).toBe("&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;")
  })

  it("handles empty string", () => {
    expect(escapeHtml("")).toBe("")
  })

  it("handles string with no special characters", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World")
  })

  it("handles complex mixed content", () => {
    const mixed = `<div class="test" data-value='5 & 10'>Hello "World"</div>`
    const result = escapeHtml(mixed)
    expect(result).toBe("&lt;div class=&quot;test&quot; data-value=&#039;5 &amp; 10&#039;&gt;Hello &quot;World&quot;&lt;/div&gt;")
  })
})