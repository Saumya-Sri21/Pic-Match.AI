import React, { useState } from 'react'
import { Grid, List, SortAsc, SortDesc } from 'lucide-react'
import ProductCard from './ProductCard'
import LoadingSpinner from './LoadingSpinner'

const ProductGrid = ({ products, isLoading, viewMode, onViewModeChange }) => {
  const [sortBy, setSortBy] = useState('similarity')
  const [sortOrder, setSortOrder] = useState('desc')

  const sortedProducts = React.useMemo(() => {
    if (!products.length) return []

    const sorted = [...products].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'similarity':
          comparison = b.similarity_score - a.similarity_score
          break
        case 'price':
          const priceA = a.product.price || 0
          const priceB = b.product.price || 0
          comparison = priceA - priceB
          break
        case 'name':
          comparison = a.product.name.localeCompare(b.product.name)
          break
        case 'category':
          comparison = a.product.category.localeCompare(b.product.category)
          break
        default:
          return 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [products, sortBy, sortOrder])

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
  }

  if (isLoading) {
    return <LoadingSpinner message="Finding similar products..." />
  }

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Grid className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
        <p className="text-gray-600">
          Try uploading a different image or adjusting your filters.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Sort Controls */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="flex space-x-2">
            {[
              { key: 'similarity', label: 'Similarity' },
              { key: 'price', label: 'Price' },
              { key: 'name', label: 'Name' },
              { key: 'category', label: 'Category' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleSortChange(key)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors ${
                  sortBy === key
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{label}</span>
                {sortBy === key && (
                  sortOrder === 'asc' ? 
                    <SortAsc className="h-3 w-3" /> : 
                    <SortDesc className="h-3 w-3" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">View:</span>
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
      </div>

      {/* Product Grid/List */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      }>
        {sortedProducts.map((result, index) => (
          <ProductCard
            key={result.product.id}
            product={result.product}
            similarityScore={result.similarity_score}
            viewMode={viewMode}
            rank={index + 1}
          />
        ))}
      </div>

      {/* Load More (for future pagination) */}
      {sortedProducts.length >= 20 && (
        <div className="text-center pt-8">
          <button className="btn-secondary">
            Load More Products
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductGrid
