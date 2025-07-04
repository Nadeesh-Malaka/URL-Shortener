"use client"

import { Linkedin, Github } from "lucide-react"

const Footer = () => {
  return (
    <footer id="about" className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          {/* About Me Section */}
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">About Me</h3>
            <p className="text-gray-300 max-w-xl mx-auto text-base leading-loose">
              Hi! I'm Nadeesh Malaka, a passionate developer who loves creating useful web applications. This URL shortener was built to help people share links more efficiently and track their performance.
            </p>
          </div>

          {/* Creator Info */}
          <div className="mb-4">
            <div className="flex justify-center space-x-6">
              <a
                href="https://www.linkedin.com/in/nadeesh-chathuranga/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-gray-300 hover:text-blue-400 transition-colors transform hover:scale-105"
              >
                <Linkedin size={20} />
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
              <a
                href="https://github.com/Nadeesh-Malaka"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-gray-300 hover:text-purple-400 transition-colors transform hover:scale-105"
              >
                <Github size={20} />
                <span className="text-sm font-medium">GitHub</span>
              </a>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-1">Built with modern technologies:</p>
            <div className="flex justify-center space-x-2 text-xs">
              <span className="bg-gray-700 px-2 py-1 rounded-full">Next.js</span>
              <span className="bg-gray-700 px-2 py-1 rounded-full">TypeScript</span>
              <span className="bg-gray-700 px-2 py-1 rounded-full">Tailwind CSS</span>
              <span className="bg-gray-700 px-2 py-1 rounded-full">is.gd API</span> {/* Corrected to TinyURL */}
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-2 border-t border-gray-700">
            <p className="text-xs text-gray-400">© 2025 ShortURL by Nadeesh Malaka. Made with ❤️ for the community.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
