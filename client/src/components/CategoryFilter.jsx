import React, { useState, useEffect } from 'react'
import { Filter, ChevronDown, X } from 'lucide-react'
import { getCategories } from '../services/api'

const CategoryFilter = ({ selectedCategory, onCategoryChange, className = '' }) => {
  const [categories, setCategories] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories()
        setCategories(['All Categories', ...response.categories])
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        setCategories(['All Categories'])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategorySelect = (category) => {
    const value = category === 'All Categories' ? 'all' : category
    onCategoryChange(value)
    setIsOpen(false)
  }

  const displayCategory = selectedCategory === 'all' ? 'All Categories' : selectedCategory

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:opacity-50"
      >
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          {loading ? 'Loading...' : displayCategory}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !loading && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            <div className="p-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    (category === 'All Categories' && selectedCategory === 'all') ||
                    (category === selectedCategory)
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CategoryFilter
