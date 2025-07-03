import { nostojs } from "@nosto/nosto-js"

const key = "nosto:web-components:logged"

export async function logFirstUsage() {
  if (localStorage.getItem(key)) return
  localStorage.setItem(key, "true")

  const api = await new Promise(nostojs)
  api.internal.logger.info("Nosto/web-components: First component initialized.")
}
