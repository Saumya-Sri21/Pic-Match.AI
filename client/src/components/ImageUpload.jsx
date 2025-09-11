import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Link, X, Image as ImageIcon, AlertCircle, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadImage, uploadImageUrl, findSimilarProducts } from '../services/api'

const ImageUpload = ({ onSearchStart, onSearchComplete, onImagePreview }) => {
  const [uploadMethod, setUploadMethod] = useState('file') // 'file' or 'url'
  const [imageUrl, setImageUrl] = useState('')
  const [previewImage, setPreviewImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB')
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, WebP, GIF, BMP)')
      return
    }

    setUploadedFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target.result)
    }
    reader.readAsDataURL(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.bmp']
    },
    multiple: false,
    disabled: isUploading
  })

  const handleUrlSubmit = async (e) => {
    e.preventDefault()
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL')
      return
    }

    // Basic URL validation
    try {
      new URL(imageUrl)
    } catch {
      toast.error('Please enter a valid URL')
      return
    }

    setIsUploading(true)
    try {
      const response = await uploadImageUrl(imageUrl)
      setPreviewImage(imageUrl)
      setUploadedFile({ url: imageUrl, data: response.image_data })
      
      // Trigger image preview callback if provided
      if (onImagePreview) {
        onImagePreview(response.image_data)
      }
      
      toast.success('Image loaded successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to load image from URL')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSearch = async () => {
    if (!uploadedFile) {
      toast.error('Please upload an image first')
      return
    }

    onSearchStart()
    setIsUploading(true)

    try {
      let results
      let imageData

      if (uploadedFile.url) {
        // URL-based search
        results = await findSimilarProducts({ imageUrl: uploadedFile.url })
        imageData = uploadedFile.data
      } else {
        // File-based search
        results = await findSimilarProducts({ file: uploadedFile })
        
        // Also upload the file to get metadata
        const uploadResponse = await uploadImage(uploadedFile)
        imageData = uploadResponse.image_data
      }

      onSearchComplete(results, imageData)
      toast.success(`Found ${results.length} similar products!`)
    } catch (error) {
      toast.error(error.message || 'Search failed. Please try again.')
      onSearchComplete([], null)
    } finally {
      setIsUploading(false)
    }
  }

  const clearImage = () => {
    setPreviewImage(null)
    setUploadedFile(null)
    setImageUrl('')
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Upload Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ minHeight: '70vh' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="text-3xl  text-white">Snap it, Search it, Find it</div>
          </div>
          <p className="text-white/90 text-lg italic">Your visual search companion.</p>
        </div>

        <div className="p-8">
          {/* Upload Method Selector - Styled like toggle switch */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-full flex">
              <button
                onClick={() => setUploadMethod('file')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  uploadMethod === 'file'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Upload
              </button>
              <button
                onClick={() => setUploadMethod('url')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  uploadMethod === 'url'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                URL
              </button>
            </div>
          </div>

          {/* File Upload */}
          {uploadMethod === 'file' && !previewImage && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-purple-400 bg-purple-50 scale-105'
                  : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
              } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ minHeight: '300px' }}
            >
              <input {...getInputProps()} />
              <div className="space-y-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <Upload className="h-10 w-10 text-purple-500" />
                </div>
                <div>
                  <p className="text-xl font-medium text-gray-900 mb-2">
                    {isDragActive ? 'Drop your image here' : 'Choose or Drag File'}
                  </p>
                  <p className="text-gray-500">
                    {isDragActive ? 'Release to upload' : ''}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* URL Input */}
          {uploadMethod === 'url' && !previewImage && (
            <div className="space-y-6">
              <form onSubmit={handleUrlSubmit} className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                    <Link className="h-10 w-10 text-blue-500" />
                  </div>
                  <input
                    type="url"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste image URL here"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg"
                    disabled={isUploading}
                    style={{ minHeight: '60px' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!imageUrl.trim() || isUploading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50"
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Loading Image...</span>
                    </div>
                  ) : (
                    'Load Image'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Image Preview */}
          {previewImage && (
            <div className="space-y-6">
              <div className="relative bg-gray-50 rounded-2xl p-6">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full max-w-sm mx-auto rounded-xl shadow-lg"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-medium text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 shadow-lg"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Searching for Similar Products...</span>
                  </div>
                ) : (
                  'Search Similar Products'
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default ImageUpload
