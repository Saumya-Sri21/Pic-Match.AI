import React from 'react'
import { Star, ExternalLink, Tag, DollarSign, TrendingUp } from 'lucide-react'

const ProductCard = ({ product, similarityScore, viewMode, rank }) => {
  const formatPrice = (price) => {
    if (!price) return 'Price not available'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getSimilarityColor = (score) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100'
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getSimilarityLabel = (score) => {
    if (score >= 0.8) return 'Excellent Match'
    if (score >= 0.6) return 'Good Match'
    return 'Fair Match'
  }

  if (viewMode === 'list') {
    return (
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Rank Badge */}
          <div className="flex-shrink-0 flex items-center">
            <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
              {rank}
            </div>
          </div>

          {/* Product Image */}
          <div className="flex-shrink-0">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-lg border"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150x150?text=No+Image'
              }}
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600">{product.brand}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSimilarityColor(similarityScore)}`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {Math.round(similarityScore * 100)}% - {getSimilarityLabel(similarityScore)}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                  <Tag className="h-3 w-3 mr-1" />
                  {product.category}
                </span>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.tags.slice(0, 4).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {product.tags.length > 4 && (
                  <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    +{product.tags.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div className="card hover:shadow-lg transition-shadow duration-200 relative">
      {/* Rank Badge */}
      <div className="absolute top-2 left-2 z-10">
        <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
          {rank}
        </div>
      </div>

      {/* Product Image */}
      <div className="relative mb-4">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'
          }}
        />
        
        {/* Similarity Score Overlay */}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSimilarityColor(similarityScore)}`}>
            <Star className="h-3 w-3 mr-1" />
            {Math.round(similarityScore * 100)}%
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600">{product.brand}</p>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
            <Tag className="h-3 w-3 mr-1" />
            {product.category}
          </span>
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </div>
        </div>

        {/* Similarity Label */}
        <div className="text-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getSimilarityColor(similarityScore)}`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {getSimilarityLabel(similarityScore)}
          </span>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                +{product.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard
