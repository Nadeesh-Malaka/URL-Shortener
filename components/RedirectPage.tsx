"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"

const RedirectPage = () => {
  const params = useParams()
  const router = useRouter()
  const shortCode = params?.shortCode as string
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!shortCode) {
      router.push("/")
      return
    }

    // Get URLs from localStorage
    const storedUrls = localStorage.getItem("shortUrls")
    if (!storedUrls) {
      setError("URL not found")
      return
    }

    const urls = JSON.parse(storedUrls)
    const urlData = urls.find((url: any) => url.shortCode === shortCode)

    if (urlData) {
      // Update visit count
      const updatedUrls = urls.map((url: any) => {
        if (url.shortCode === shortCode) {
          return {
            ...url,
            visits: url.visits + 1,
          }
        }
        return url
      })
      localStorage.setItem("shortUrls", JSON.stringify(updatedUrls))

      // Redirect to the original URL
      window.location.href = urlData.longUrl
    } else {
      setError("URL not found")
      // Start countdown to redirect to home
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            router.push("/")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [shortCode, router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {error ? (
        <div className="text-center bg-white p-8 rounded-lg shadow-md border border-gray-200 max-w-md">
          <div className="text-red-500 mb-4">
            <AlertTriangle className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Link not found</h1>
          <p className="text-gray-600 mb-6">
            The shortened URL you're trying to access doesn't exist or has been removed.
          </p>
          <p className="text-sm text-gray-500 mb-4">Redirecting to homepage in {countdown} seconds...</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md w-full"
          >
            Go to Homepage Now
          </button>
        </div>
      ) : (
        <div className="text-center bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Redirecting you to the destination...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait</p>
        </div>
      )}
    </div>
  )
}

export default RedirectPage
