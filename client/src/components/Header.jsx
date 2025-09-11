import React from 'react'
import { Eye, Github, ExternalLink,Search } from 'lucide-react'
import ApiStatus from './ApiStatus'
import searchImg from '../assests/search.png'

const Header = () => {
  return (
    <header className="bg-gradient-to-br from-purple-500 via-blue-400 to-pink-400 shadow-sm ">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2  rounded-lg">
              {/* icon ki jagah image */}
              <img 
                src={searchImg} 
                alt="search" 
                className="h-6 w-6 object-contain" 
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white ">Pic-Match.AI</h1>
            </div>
          </div>
          
        </div>
      </div>
    </header>
  )
}

export default Header
