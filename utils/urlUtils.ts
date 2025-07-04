/**
 * Generates a random 6-character short code
 */
export const generateShortCode = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const charactersLength = characters.length
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

/**
 * Gets the base URL of the current application
 */
export const getBaseUrl = (): string => {
  return window.location.origin
}

/**
 * Shortens a URL using the public is.gd API (no auth, CORS-friendly).
 * If a custom alias is supplied, is.gd will try to assign it.
 */
export const shortenUrl = async (longUrl: string, customAlias?: string): Promise<string> => {
  const endpoint = new URL("https://is.gd/create.php")
  endpoint.searchParams.append("format", "json")
  endpoint.searchParams.append("url", longUrl)

  // is.gd supports a *shorturl* query param for custom codes
  if (customAlias && customAlias.trim() !== "") {
    endpoint.searchParams.append("shorturl", customAlias.trim())
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 s timeout

    const res = await fetch(endpoint.toString(), {
      method: "GET",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const data = (await res.json()) as { shorturl: string } | { errormessage: string }

    if ("errormessage" in data) {
      throw new Error(data.errormessage)
    }

    return data.shorturl
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. The shortening service might be slow or unreachable.")
    }
    throw new Error(error.message || "Failed to shorten URL")
  }
}

/**
 * Extracts the short code from a full TinyURL URL
 */
export const extractShortCode = (shortUrl: string): string => {
  try {
    const url = new URL(shortUrl)
    return url.pathname.substring(1) // Remove the leading slash
  } catch (error) {
    return shortUrl
  }
}
