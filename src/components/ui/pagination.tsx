'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, MoreHorizontal, Loader2 } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPageNumbers?: boolean
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  className
}: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2 // Number of pages to show around current page
    const range = []
    const rangeWithDots = []

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i)
      }
    }

    let prev = 0
    for (const i of range) {
      if (prev + 1 !== i) {
        rangeWithDots.push('...')
      }
      rangeWithDots.push(i)
      prev = i
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <nav className={cn('flex items-center justify-center space-x-1', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      {showPageNumbers && (
        <div className="flex items-center space-x-1 mx-4">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <div className="px-3 py-2">
                  <MoreHorizontal className="h-4 w-4 text-muted" />
                </div>
              ) : (
                <Button
                  variant={currentPage === page ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className={cn(
                    'min-w-[40px]',
                    currentPage === page && 'bg-primary text-primary-foreground'
                  )}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}

interface InfiniteScrollProps {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  loader?: React.ReactNode
  endMessage?: React.ReactNode
  threshold?: number
  children: React.ReactNode
}

export function InfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  loader,
  endMessage,
  threshold = 100,
  children
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  )

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: `${threshold}px`
    })

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [handleIntersect, threshold])

  return (
    <div>
      {children}
      
      <div ref={sentinelRef} className="w-full py-4">
        {isFetchingNextPage && (
          <div className="flex justify-center">
            {loader || (
              <div className="flex items-center gap-2 text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading more content...
              </div>
            )}
          </div>
        )}
        
        {!hasNextPage && !isFetchingNextPage && (
          <div className="flex justify-center">
            {endMessage || (
              <div className="text-center text-muted py-8">
                <p>You've reached the end!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

interface PaginatedListProps<T> {
  items: T[]
  itemsPerPage?: number
  renderItem: (item: T, index: number) => React.ReactNode
  renderEmpty?: () => React.ReactNode
  className?: string
  paginationClassName?: string
}

export function PaginatedList<T>({
  items,
  itemsPerPage = 10,
  renderItem,
  renderEmpty,
  className,
  paginationClassName
}: PaginatedListProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1)

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = items.slice(startIndex, endIndex)

  // Reset to first page when items change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [items.length, totalPages, currentPage])

  if (items.length === 0) {
    return <div className={className}>{renderEmpty?.()}</div>
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {currentItems.map((item, index) => (
          <motion.div
            key={startIndex + index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {renderItem(item, startIndex + index)}
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className={paginationClassName}
          />
        </div>
      )}
    </div>
  )
}
