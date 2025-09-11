import React, { useState } from 'react'
import { Search, Upload, Zap, Star, Sparkles,Link } from 'lucide-react'
import ImageUpload from './components/ImageUpload'
import SearchResults from './components/SearchResults'
import Header from './components/Header'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import ImagePreview from './components/ImagePreview'

function App() {
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  const handleSearchComplete = (results, imageData) => {
    setSearchResults(results)
    setUploadedImage(imageData)
    setIsSearching(false)
  }

  const handleSearchStart = () => {
    setIsSearching(true)
    setSearchResults([])
  }

  const handleReset = () => {
    setSearchResults([])
    setUploadedImage(null)
    setIsSearching(false)
    setShowImagePreview(false)
  }

  const handleImagePreview = (imageData) => {
    setUploadedImage(imageData)
    setShowImagePreview(true)
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="h-8 w-8 text-yellow-300" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
                Pic-Match.AI
              </h1>
              <Sparkles className="h-8 w-8 text-yellow-300" />
            </div>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
              Upload any product image and discover visually similar items using advanced AI technology
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-8 text-center rounded-lg shadow-sm transform transition-transform duration-300 hover:scale-105 hover:cursor-pointer">
                <Upload className="h-6 w-6 text-white" />
                <span className="font-medium text-white">Upload or Drag Image</span>
              </div>
              <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-8 text-center rounded-lg shadow-sm transform transition-transform duration-300 hover:scale-105 hover:cursor-pointer">
                <Link className="h-6 w-6 text-white" />
                <span className="font-medium text-white">Paste Image Link</span>
              </div>
              <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-8 text-center rounded-lg shadow-sm transform transition-transform duration-300 hover:scale-105 hover:cursor-pointer">
                <Zap className="h-6 w-6 text-white" />
                <span className="font-medium text-white">Similarity Search</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full px-4">
            {!searchResults.length && !isSearching ? (
              <ImageUpload
                onSearchStart={handleSearchStart}
                onSearchComplete={handleSearchComplete}
                onImagePreview={handleImagePreview}
              />
            ) : (
              <div className="space-y-8">
                {/* Search Results Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {isSearching ? 'Searching...' : `Found ${searchResults.length} similar products`}
                    </h2>
                    {!isSearching && (
                      <p className="text-gray-600 mt-1">
                        Results are ranked by visual similarity
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleReset}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Search className="h-4 w-4" />
                    <span>New Search</span>
                  </button>
                </div>

                {/* Uploaded Image Preview */}
                {uploadedImage && (
                  <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Your Image</h3>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${uploadedImage.thumbnail_path || uploadedImage.image_path}`}
                          alt="Uploaded"
                          className="w-32 h-32 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setShowImagePreview(true)}
                        />
                      </div>
                      <div className="flex-1 space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Filename:</span> {uploadedImage.filename}</p>
                        <p><span className="font-medium">Size:</span> {(uploadedImage.size / 1024).toFixed(1)} KB</p>
                        <p><span className="font-medium">Dimensions:</span> {uploadedImage.width} × {uploadedImage.height}</p>
                        <p><span className="font-medium">Format:</span> {uploadedImage.format}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Search Results */}
                <SearchResults
                  results={searchResults}
                  isLoading={isSearching}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </div>
            )}
          </div>

          {/* Image Preview Modal */}
          {showImagePreview && uploadedImage && (
            <ImagePreview
              imageData={uploadedImage}
              onClose={() => setShowImagePreview(false)}
              onSearch={() => {
                setShowImagePreview(false)
                handleSearchStart()

              }}
            />
          )}
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default App
