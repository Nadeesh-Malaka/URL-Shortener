"use client"
import Link from "next/link"
import { LinkIcon } from "lucide-react"

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-500 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <LinkIcon className="h-8 w-8 text-white" />
              <span className="text-white font-bold text-xl">ShortURL</span>
            </Link>
          </div>

          {/* Centered navigation buttons */}
          <div className="flex items-center justify-center flex-1">
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })}
                className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                className="text-white hover:text-purple-200 px-3 py-2 text-sm font-medium transition-colors"
              >
                About Me
              </button>
            </div>
          </div>

          {/* Right side placeholder for balance */}
          <div className="flex items-center w-24"></div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
