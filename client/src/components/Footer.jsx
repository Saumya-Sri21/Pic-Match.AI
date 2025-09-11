import React from 'react'
import { Heart, Code } from 'lucide-react'

const Footer = () => {
  return (
    <footer className=" bg-[#737373] mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-200">
          <div className="flex items-center justify-center space-x-2  mb-4">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span className='italic'>By Saumya Srivastava</span>

          </div>
          
          
          <p className=" text-sm">
            © 2025 AI-Powered : Visual Product Search - Pic-Match
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
