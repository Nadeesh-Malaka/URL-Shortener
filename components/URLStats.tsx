"use client"

import type React from "react"
import { useState } from "react"
import ShortURLDisplay from "./ShortURLDisplay"
import { Trash2, ExternalLink, Edit, X, Check } from "lucide-react"
import { shortenUrl, extractShortCode } from "@/utils/urlUtils"

interface UrlData {
  shortCode: string
  shortUrl: string
  longUrl: string
  customAlias?: string
  visits: number
}

interface URLStatsProps {
  urls: UrlData[]
  setUrls: React.Dispatch<React.SetStateAction<UrlData[]>>
  onEditUrl: (originalShortUrl: string, updatedData: Partial<UrlData>) => void
}

const URLStats = ({ urls, setUrls, onEditUrl }: URLStatsProps) => {
  const [editingUrl, setEditingUrl] = useState<string | null>(null)
  const [editedLongUrl, setEditedLongUrl] = useState("")
  const [editedCustomAlias, setEditedCustomAlias] = useState("")
  const [editError, setEditError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const deleteUrl = (shortUrl: string) => {
    const updatedUrls = urls.filter((url) => url.shortUrl !== shortUrl)
    setUrls(updatedUrls)
    localStorage.setItem("shortUrls", JSON.stringify(updatedUrls))
  }

  const startEdit = (url: UrlData) => {
    setEditingUrl(url.shortUrl)
    setEditedLongUrl(url.longUrl)
    setEditedCustomAlias(url.customAlias || "")
    setEditError(null)
  }

  const cancelEdit = () => {
    setEditingUrl(null)
    setEditedLongUrl("")
    setEditedCustomAlias("")
    setEditError(null)
  }

  const saveEdit = async (originalUrl: UrlData) => {
    try {
      // Validate the new URL
      new URL(editedLongUrl)
      setIsUpdating(true)
      setEditError(null)

      // Only create a new short URL if the long URL or custom alias changed
      if (editedLongUrl !== originalUrl.longUrl || editedCustomAlias !== (originalUrl.customAlias || "")) {
        try {
          // Generate a new short URL through TinyURL
          const newShortUrl = await shortenUrl(editedLongUrl, editedCustomAlias || undefined)
          const newShortCode = extractShortCode(newShortUrl)

          // Update the URL data
          onEditUrl(originalUrl.shortUrl, {
            shortUrl: newShortUrl,
            shortCode: newShortCode,
            longUrl: editedLongUrl,
            customAlias: editedCustomAlias || undefined,
          })

          setEditingUrl(null)
          setIsUpdating(false)
        } catch (apiError: any) {
          setEditError(`API Error: ${apiError.message}`)
          setIsUpdating(false)
        }
      } else {
        // No changes to URL or alias, just cancel edit
        cancelEdit()
      }
    } catch (err) {
      setEditError("Please enter a valid URL including http:// or https://")
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      {urls.map((url) => (
        <div key={url.shortUrl} className="border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md">
          {editingUrl === url.shortUrl ? (
            // Edit mode
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original URL</label>
                <input
                  type="text"
                  value={editedLongUrl}
                  onChange={(e) => setEditedLongUrl(e.target.value)}
                  className={`w-full rounded-md border ${editError && editError.includes("valid URL") ? "border-red-300" : "border-gray-300"} px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom alias (optional)</label>
                <div className="flex items-center">
                  <span className="text-gray-500 bg-gray-100 px-3 py-2 rounded-l-md border border-r-0 border-gray-300">
                    is.gd/
                  </span>
                  <input
                    type="text"
                    value={editedCustomAlias}
                    onChange={(e) => setEditedCustomAlias(e.target.value)}
                    className={`flex-1 rounded-r-md border ${editError && editError.includes("API Error") ? "border-red-300" : "border-gray-300"} px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="mylink"
                  />
                </div>
              </div>
              {editError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                  {editError}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={cancelEdit}
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-1"
                  disabled={isUpdating}
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={() => saveEdit(url)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            // View mode
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="truncate flex-1">
                  <span className="text-sm text-gray-500 block mb-1">Original URL:</span>
                  <div className="flex items-center">
                    <a
                      href={url.longUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-blue-600 truncate max-w-[300px]"
                    >
                      {url.longUrl}
                    </a>
                    <a
                      href={url.longUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    {url.visits} {url.visits === 1 ? "visit" : "visits"}
                  </span>
                  <button
                    onClick={() => startEdit(url)}
                    className="text-gray-500 hover:text-blue-600 p-1"
                    title="Edit URL"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteUrl(url.shortUrl)}
                    className="text-gray-500 hover:text-red-600 p-1"
                    title="Delete URL"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-2">Shortened URL:</span>
                <ShortURLDisplay shortUrl={url.shortUrl} showQR={true} />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default URLStats
