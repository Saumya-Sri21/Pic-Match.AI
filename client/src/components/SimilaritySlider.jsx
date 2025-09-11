import React from 'react'
import { TrendingUp } from 'lucide-react'

const SimilaritySlider = ({ value, onChange, className = '' }) => {
  const getSliderColor = (val) => {
    if (val >= 0.8) return 'bg-green-500'
    if (val >= 0.6) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getLabel = (val) => {
    if (val >= 0.8) return 'Excellent'
    if (val >= 0.6) return 'Good'
    if (val >= 0.4) return 'Fair'
    return 'Any'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
          <TrendingUp className="h-4 w-4" />
          <span>Min Similarity</span>
        </label>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{Math.round(value * 100)}%</span>
          <span className={`text-xs px-2 py-1 rounded-full text-white ${getSliderColor(value)}`}>
            {getLabel(value)}
          </span>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`
          }}
        />
        
        {/* Tick marks */}
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>
      
      <p className="text-xs text-gray-500">
        Higher values show only very similar products
      </p>
    </div>
  )
}

export default SimilaritySlider
