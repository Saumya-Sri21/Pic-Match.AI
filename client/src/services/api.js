import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    let errorMessage = 'An unexpected error occurred'
    
    if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data?.detail || error.response.data?.message || `Server error: ${error.response.status}`
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'Unable to connect to server. Please check your internet connection.'
    } else {
      // Something else happened
      errorMessage = error.message
    }
    
    return Promise.reject(new Error(errorMessage))
  }
)

// API functions
export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  return await api.post('/api/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const uploadImageUrl = async (imageUrl) => {
  const formData = new FormData()
  formData.append('image_url', imageUrl)
  
  return await api.post('/api/upload-url', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const findSimilarProducts = async ({ file, imageUrl, minSimilarity = 0.0, maxResults = 20, categoryFilter }) => {
  const formData = new FormData()
  
  if (file) {
    formData.append('file', file)
  }
  
  if (imageUrl) {
    formData.append('image_url', imageUrl)
  }
  
  formData.append('min_similarity', minSimilarity.toString())
  formData.append('max_results', maxResults.toString())
  
  if (categoryFilter) {
    formData.append('category_filter', categoryFilter)
  }
  
  return await api.post('/api/find-similar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const getProducts = async ({ category, limit = 50, offset = 0 } = {}) => {
  const params = new URLSearchParams()
  
  if (category) params.append('category', category)
  params.append('limit', limit.toString())
  params.append('offset', offset.toString())
  
  return await api.get(`/api/products?${params}`)
}

export const getProduct = async (productId) => {
  return await api.get(`/api/products/${productId}`)
}

export const getCategories = async () => {
  return await api.get('/api/categories')
}

export const healthCheck = async () => {
  return await api.get('/health')
}

// Utility function to check if API is available
export const checkApiHealth = async () => {
  try {
    await healthCheck()
    return true
  } catch (error) {
    console.error('API health check failed:', error)
    return false
  }
}

export default api
