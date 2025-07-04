"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

interface ShortURLDisplayProps {
  shortUrl: string
  showQR?: boolean
}

const ShortURLDisplay = ({ shortUrl, showQR = false }: ShortURLDisplayProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
        <div className="flex-1 px-4 py-3 truncate">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            {shortUrl}
          </a>
        </div>
        <button
          onClick={handleCopy}
          className="bg-purple-100 hover:bg-purple-200 px-4 py-3 border-l border-gray-200 text-purple-600 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
        </button>
      </div>
      {showQR && (
        <div className="flex justify-center p-2">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shortUrl)}`}
            alt="QR Code"
            className="w-24 h-24"
          />
        </div>
      )}
    </div>
  )
}

export default ShortURLDisplay
