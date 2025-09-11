import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../services/api'
import toast from 'react-hot-toast'

// Custom hook for API health check
export const useApiHealth = () => {
  const [isHealthy, setIsHealthy] = useState(null)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.healthCheck()
        setIsHealthy(true)
      } catch (error) {
        setIsHealthy(false)
        console.error('API health check failed:', error)
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return isHealthy
}

// Hook for fetching products
export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => api.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for fetching categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Hook for image upload
export const useImageUpload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.uploadImage,
    onSuccess: (data) => {
      toast.success('Image uploaded successfully!')
      return data
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to upload image')
      throw error
    }
  })
}

// Hook for URL image processing
export const useImageUrl = () => {
  return useMutation({
    mutationFn: api.uploadImageUrl,
    onSuccess: (data) => {
      toast.success('Image processed successfully!')
      return data
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to process image URL')
      throw error
    }
  })
}

// Hook for similarity search
export const useSimilaritySearch = () => {
  return useMutation({
    mutationFn: api.findSimilarProducts,
    onSuccess: (data) => {
      toast.success(`Found ${data.length} similar products!`)
      return data
    },
    onError: (error) => {
      toast.error(error.message || 'Search failed. Please try again.')
      throw error
    }
  })
}

// Hook for managing search state
export const useSearchState = () => {
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [searchHistory, setSearchHistory] = useState([])

  const startSearch = () => {
    setIsSearching(true)
    setSearchResults([])
  }

  const completeSearch = (results, imageData) => {
    setSearchResults(results)
    setUploadedImage(imageData)
    setIsSearching(false)
    
    // Add to search history
    if (imageData) {
      setSearchHistory(prev => [
        {
          id: Date.now(),
          imageData,
          results,
          timestamp: new Date().toISOString()
        },
        ...prev.slice(0, 9) // Keep last 10 searches
      ])
    }
  }

  const resetSearch = () => {
    setSearchResults([])
    setUploadedImage(null)
    setIsSearching(false)
  }

  return {
    searchResults,
    isSearching,
    uploadedImage,
    searchHistory,
    startSearch,
    completeSearch,
    resetSearch
  }
}
