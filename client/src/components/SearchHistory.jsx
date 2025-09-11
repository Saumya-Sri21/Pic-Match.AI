import React from 'react'
import { Clock, Image as ImageIcon, Trash2 } from 'lucide-react'

const SearchHistory = ({ history, onSelectSearch, onClearHistory }) => {
  if (!history.length) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No search history yet</p>
      </div>
    )
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Search History
        </h3>
        <button
          onClick={onClearHistory}
          className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-3">
        {history.map((search) => (
          <div
            key={search.id}
            onClick={() => onSelectSearch(search)}
            className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 cursor-pointer transition-colors"
          >
            <div className="flex-shrink-0">
              <img
                src={search.imageData.thumbnail_path || search.imageData.image_path}
                alt="Search"
                className="w-12 h-12 object-cover rounded-md"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {search.imageData.filename}
              </p>
              <p className="text-xs text-gray-500">
                {formatTimestamp(search.timestamp)} • {search.results.length} results
              </p>
            </div>
            <div className="flex-shrink-0">
              <ImageIcon className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchHistory
