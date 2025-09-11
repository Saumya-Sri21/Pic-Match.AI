import React, { useState, useMemo } from 'react'
import { Star, Filter, Grid, List, ExternalLink, Tag, DollarSign } from 'lucide-react'
import ProductGrid from './ProductGrid'
import CategoryFilter from './CategoryFilter'
import SimilaritySlider from './SimilaritySlider'
import LoadingSpinner from './LoadingSpinner'

const SearchResults = ({ results, isLoading, viewMode, onViewModeChange }) => {
  const [filterCategory, setFilterCategory] = useState('all')
  const [minSimilarity, setMinSimilarity] = useState(0)

  // Get unique categories from results
  const categories = useMemo(() => {
    const cats = new Set(results.map(result => result.product.category))
    return ['all', ...Array.from(cats)]
  }, [results])

  // Filter results
  const filteredResults = useMemo(() => {
    return results.filter(result => {
      if (filterCategory !== 'all' && result.product.category !== filterCategory) {
        return false
      }
      if (result.similarity_score < minSimilarity) {
        return false
      }
      return true
    })
  }, [results, filterCategory, minSimilarity])

  if (isLoading) {
    return <LoadingSpinner message="Analyzing image and finding similar products..." />
  }

  if (!results.length) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Star className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
        <p className="text-gray-600">
          Try uploading a different image or adjusting your search criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left side - Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Category Filter */}
            <CategoryFilter
              selectedCategory={filterCategory}
              onCategoryChange={setFilterCategory}
              className="flex-shrink-0"
            />

            {/* Similarity Filter */}
            <SimilaritySlider
              value={minSimilarity}
              onChange={setMinSimilarity}
              className="flex-1 min-w-0"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredResults.length} of {results.length} results
            {filterCategory !== 'all' && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                <Tag className="h-3 w-3 mr-1" />
                {filterCategory}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={filteredResults}
        isLoading={isLoading}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />
    </div>
  )
}

export default SearchResults
