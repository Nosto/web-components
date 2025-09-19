export function formatPrice(price: number, currency = "USD", locale = "en-US"): string {
  // Convert from cents to currency units
  const amount = price / 100

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  } catch (error) {
    // Fallback to simple formatting if Intl fails
    console.warn("Failed to format price with Intl, falling back to simple format:", error)
    return `$${amount.toFixed(2)}`
  }
}
