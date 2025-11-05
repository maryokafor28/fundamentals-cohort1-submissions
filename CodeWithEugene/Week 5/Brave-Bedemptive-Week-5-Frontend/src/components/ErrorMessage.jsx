import { AlertCircle, RefreshCw } from 'lucide-react'
import { getErrorMessage } from '../lib/utils'

export default function ErrorMessage({ 
  error, 
  title = 'Something went wrong',
  onRetry,
  className = ''
}) {
  const message = getErrorMessage(error)

  return (
    <div className={`card text-center ${className}`}>
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary inline-flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  )
}
