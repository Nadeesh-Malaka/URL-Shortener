"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { shortenUrl, extractShortCode } from "@/utils/urlUtils"
import ShortURLDisplay from "./ShortURLDisplay"
import URLStats from "./URLStats"
import FeaturesSection from "./FeaturesSection"
import Navbar from "./Navbar"
import Footer from "./Footer"

interface UrlData {
  shortCode: string
  shortUrl: string
  longUrl: string
  customAlias?: string
  visits: number
}

const URLShortener = () => {
  const [longUrl, setLongUrl] = useState("")
  const [customAlias, setCustomAlias] = useState("")
  const [shortUrls, setShortUrls] = useState<UrlData[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recentlyShortened, setRecentlyShortened] = useState<string | null>(null)

  // Load existing URLs from localStorage on component mount
  useEffect(() => {
    const storedUrls = localStorage.getItem("shortUrls")
    if (storedUrls) {
      setShortUrls(JSON.parse(storedUrls))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Basic validation
    if (!longUrl) {
      setError("Please enter a URL")
      return
    }

    try {
      // Check if URL is valid
      new URL(longUrl)
      setIsLoading(true)
      setError("")

      try {
        // Call TinyURL API to shorten URL
        const shortUrl = await shortenUrl(longUrl, customAlias || undefined)
        const shortCode = extractShortCode(shortUrl)

        // Create new shortened URL
        const newShortUrl: UrlData = {
          shortCode,
          shortUrl,
          longUrl,
          customAlias: customAlias || undefined,
          visits: 0,
        }

        // Update state and localStorage
        const updatedUrls = [newShortUrl, ...shortUrls]
        setShortUrls(updatedUrls)
        localStorage.setItem("shortUrls", JSON.stringify(updatedUrls))
        setLongUrl("")
        setCustomAlias("")
        setRecentlyShortened(shortUrl)
        setIsLoading(false)
      } catch (apiError: any) {
        console.error("API Error details:", apiError)
        setError(`API Error: ${apiError.message}`)
        setIsLoading(false)
      }
    } catch (err) {
      setError("Please enter a valid URL including http:// or https://")
      setIsLoading(false)
    }
  }

  const handleEditUrl = (originalShortUrl: string, updatedData: Partial<UrlData>) => {
    const updatedUrls = shortUrls.map((url) =>
      url.shortUrl === originalShortUrl
        ? {
            ...url,
            ...updatedData,
          }
        : url,
    )
    setShortUrls(updatedUrls)
    localStorage.setItem("shortUrls", JSON.stringify(updatedUrls))
  }

  // Add a fallback method for when the TinyURL API is unavailable
  const handleLocalShortening = () => {
    if (!longUrl) return

    try {
      // Check if URL is valid
      new URL(longUrl)

      // Generate a local short code
      const shortCode = Math.random().toString(36).substring(2, 8)
      const shortUrl = `${window.location.origin}/${shortCode}`

      // Create new shortened URL
      const newShortUrl: UrlData = {
        shortCode,
        shortUrl,
        longUrl,
        customAlias: customAlias || undefined,
        visits: 0,
      }

      // Update state and localStorage
      const updatedUrls = [newShortUrl, ...shortUrls]
      setShortUrls(updatedUrls)
      localStorage.setItem("shortUrls", JSON.stringify(updatedUrls))
      setLongUrl("")
      setCustomAlias("")
      setRecentlyShortened(shortUrl)
      setError("")
    } catch (err) {
      setError("Please enter a valid URL including http:// or https://")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div id="home" className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">URL Shortener</h1>
            <p className="text-xl">Shorten your long URLs into memorable, easy-to-share links with ShortURL</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter a long URL
                </label>
                <input
                  type="text"
                  id="longUrl"
                  className={`w-full rounded-md border ${error && error.includes("valid URL") ? "border-red-300" : "border-gray-300"} px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://example.com/very/long/url/that/needs/shortening"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700 mb-1">
                  Custom alias (optional)
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 bg-gray-100 px-3 py-3 rounded-l-md border border-r-0 border-gray-300">
                    is.gd/
                  </span>
                  <input
                    type="text"
                    id="customAlias"
                    className={`flex-1 rounded-r-md border ${error && error.includes("API Error") ? "border-red-300" : "border-gray-300"} px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="mylink"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty for a random short code, or enter your preferred alias
                </p>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  <p className="font-medium">{error}</p>
                  {error.includes("API Error") && (
                    <div className="mt-2">
                      <p className="text-xs text-red-600">
                        The TinyURL service might be experiencing issues. Check your internet connection or try again
                        later.
                      </p>
                      <button
                        type="button"
                        onClick={handleLocalShortening}
                        className="mt-2 text-xs bg-red-100 hover:bg-red-200 text-red-800 font-medium px-2 py-1 rounded"
                      >
                        Use local shortening instead
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium px-6 py-3 rounded-md transition-colors disabled:opacity-70 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Shortening...
                    </>
                  ) : (
                    "Shorten URL"
                  )}
                </button>
              </div>
            </form>
            {recentlyShortened && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-green-800 mb-2">Your shortened URL is ready!</h3>
                <ShortURLDisplay shortUrl={recentlyShortened} />
              </div>
            )}
          </div>
        </div>
      </div>
      <FeaturesSection />
      {shortUrls.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your links</h2>
            <URLStats urls={shortUrls} setUrls={setShortUrls} onEditUrl={handleEditUrl} />
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}

export default URLShortener
