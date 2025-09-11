import React from 'react'
import { X, Info, Eye } from 'lucide-react'

const ImagePreview = ({ imageData, onClose }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Image Preview
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Display */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${imageData.thumbnail_path || imageData.image_path}`}
                  alt="Preview"
                  className="w-full rounded-lg shadow-md"
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                />
              </div>
              
              <div className="flex space-x-3">
                
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${imageData.image_path}`
                    link.click()
                  }}
                  className="btn-secondary flex items-center space-x-2"
                >
                </button>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Image Information
                </h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Filename:</span>
                      <p className="text-gray-600 break-all">{imageData.filename}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">File Size:</span>
                      <p className="text-gray-600">{formatFileSize(imageData.size)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Dimensions:</span>
                      <p className="text-gray-600">{imageData.width} × {imageData.height} px</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Format:</span>
                      <p className="text-gray-600">{imageData.format}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Content Type:</span>
                      <p className="text-gray-600">{imageData.content_type}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Aspect Ratio:</span>
                      <p className="text-gray-600">
                        {(imageData.width / imageData.height).toFixed(2)}:1
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Technical Details</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Megapixels:</span>
                    <span>{((imageData.width * imageData.height) / 1000000).toFixed(2)} MP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Color Depth:</span>
                    <span>24-bit RGB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compression:</span>
                    <span>{imageData.format === 'JPEG' ? 'Lossy' : 'Lossless'}</span>
                  </div>
                </div>
              </div>

              {/* Processing Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">AI Processing Ready</h4>
                <p className="text-sm text-blue-700">
                  This image has been processed and is ready for AI-powered similarity matching using CLIP technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImagePreview
