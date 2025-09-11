import React from 'react'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useApiHealth } from '../hooks/useApi'

const ApiStatus = () => {
  const isHealthy = useApiHealth()

  if (isHealthy === null) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Checking API status...</span>
      </div>
    )
  }

  if (isHealthy) {
    return (
      <div className="flex items-center space-x-2 text-sm text-green-600">
        <CheckCircle className="h-4 w-4" />
        <span>API Connected</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-red-600">
      <XCircle className="h-4 w-4" />
      <span>API Disconnected</span>
    </div>
  )
}

export default ApiStatus
