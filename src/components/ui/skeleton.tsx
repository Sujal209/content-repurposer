import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  lines?: number
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  ...props
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-surface/50 backdrop-blur-sm'
  
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              'h-4 rounded',
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
            style={{ width, height }}
          />
        ))}
      </div>
    )
  }

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{ width, height }}
      {...props}
    />
  )
}

// Predefined skeleton components for common use cases
export function CardSkeleton() {
  return (
    <div className="p-6 space-y-4 border border-border rounded-xl bg-card-bg/50">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="40%" height={16} />
          <Skeleton variant="text" width="60%" height={14} />
        </div>
      </div>
      <Skeleton variant="text" lines={3} />
    </div>
  )
}

export function ContentGenerationSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="border border-border rounded-xl p-6 bg-card-bg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width={120} height={18} />
            </div>
            <div className="flex gap-2">
              <Skeleton variant="rectangular" width={36} height={36} />
              <Skeleton variant="rectangular" width={36} height={36} />
            </div>
          </div>
          <Skeleton variant="rectangular" width="100%" height={200} />
        </div>
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={200} height={32} />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width={80} height={36} />
          <Skeleton variant="rectangular" width={80} height={36} />
        </div>
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CardSkeleton />
        </div>
        <div>
          <CardSkeleton />
        </div>
      </div>
      
      {/* Content generation area */}
      <ContentGenerationSkeleton />
    </div>
  )
}
