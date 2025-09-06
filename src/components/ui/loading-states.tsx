'use client'

import { Loader2 } from 'lucide-react'

export function LoadingSpinner({ size = 'default', className = '' }: { 
  size?: 'sm' | 'default' | 'lg'
  className?: string 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }
  
  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  )
}

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`loading-skeleton rounded ${className}`} />
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4 text-primary" />
        <p className="text-muted">Loading...</p>
      </div>
    </div>
  )
}

export function ButtonLoader({ children, loading, ...props }: any) {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  )
}