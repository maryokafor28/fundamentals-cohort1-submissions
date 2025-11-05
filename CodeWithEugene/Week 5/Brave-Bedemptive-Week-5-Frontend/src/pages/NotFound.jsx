import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-neutral-200">404</h1>
          <div className="text-4xl font-semibold text-neutral-900 mb-2">Page not found</div>
          <p className="text-neutral-600 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="btn-outline inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
          
          <Link to="/" className="btn-primary inline-flex items-center">
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
