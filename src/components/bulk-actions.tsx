'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trash2, 
  Download, 
  Share2, 
  CheckSquare, 
  Square,
  X,
  Archive,
  Copy,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConfirmModal } from '@/components/ui/modal'
import { cn } from '@/lib/utils'

interface BulkActionsProps {
  selectedItems: string[]
  totalItems: number
  onSelectAll: () => void
  onDeselectAll: () => void
  onBulkDelete: (ids: string[]) => void
  onBulkExport: (ids: string[]) => void
  onBulkArchive?: (ids: string[]) => void
  onBulkShare?: (ids: string[]) => void
  className?: string
}

export function BulkActions({
  selectedItems,
  totalItems,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  onBulkExport,
  onBulkArchive,
  onBulkShare,
  className
}: BulkActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  
  const selectedCount = selectedItems.length
  const isAllSelected = selectedCount === totalItems && totalItems > 0
  const isPartiallySelected = selectedCount > 0 && selectedCount < totalItems

  const handleSelectToggle = () => {
    if (isAllSelected || isPartiallySelected) {
      onDeselectAll()
    } else {
      onSelectAll()
    }
  }

  const handleBulkDelete = () => {
    onBulkDelete(selectedItems)
    setShowDeleteConfirm(false)
  }

  if (selectedCount === 0) {
    return null
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={cn(
            'fixed top-4 left-1/2 transform -translate-x-1/2 z-40',
            'bg-card-bg border border-border rounded-xl shadow-xl backdrop-blur-sm',
            'px-6 py-4 flex items-center gap-4',
            className
          )}
        >
          {/* Selection info */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectToggle}
              className="flex items-center gap-2 text-primary hover:text-primary"
            >
              {isAllSelected ? (
                <CheckSquare className="h-4 w-4" />
              ) : isPartiallySelected ? (
                <div className="h-4 w-4 border-2 border-primary bg-primary/20 rounded flex items-center justify-center">
                  <div className="h-2 w-2 bg-primary rounded-sm" />
                </div>
              ) : (
                <Square className="h-4 w-4" />
              )}
              {isAllSelected ? 'Deselect All' : 'Select All'}
            </Button>

            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {selectedCount} selected
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 border-l border-border pl-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkExport(selectedItems)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export ({selectedCount})
            </Button>

            {onBulkShare && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkShare(selectedItems)}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            )}

            {onBulkArchive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkArchive(selectedItems)}
                className="flex items-center gap-2"
              >
                <Archive className="h-4 w-4" />
                Archive
              </Button>
            )}

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete ({selectedCount})
            </Button>
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeselectAll}
            className="text-muted hover:text-foreground ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      </AnimatePresence>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Items"
        message={`Are you sure you want to delete ${selectedCount} item${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  )
}

interface SelectableItemProps {
  id: string
  isSelected: boolean
  onToggleSelect: (id: string) => void
  children: React.ReactNode
  className?: string
}

export function SelectableItem({
  id,
  isSelected,
  onToggleSelect,
  children,
  className
}: SelectableItemProps) {
  return (
    <div
      className={cn(
        'relative group',
        isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        className
      )}
    >
      {/* Selection checkbox */}
      <div className="absolute top-3 right-3 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onToggleSelect(id)
          }}
          className={cn(
            'h-8 w-8 p-0 transition-all',
            'opacity-0 group-hover:opacity-100',
            isSelected && 'opacity-100'
          )}
        >
          {isSelected ? (
            <CheckSquare className="h-4 w-4 text-primary" />
          ) : (
            <Square className="h-4 w-4 text-muted" />
          )}
        </Button>
      </div>

      {children}
    </div>
  )
}

// Hook for managing bulk selection
export function useBulkSelection<T extends { id: string }>(items: T[]) {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([])

  const selectAll = () => {
    setSelectedItems(items.map(item => item.id))
  }

  const deselectAll = () => {
    setSelectedItems([])
  }

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    )
  }

  const isSelected = (id: string) => selectedItems.includes(id)

  // Clear selection when items change
  React.useEffect(() => {
    const validIds = items.map(item => item.id)
    setSelectedItems(prev => prev.filter(id => validIds.includes(id)))
  }, [items])

  return {
    selectedItems,
    selectAll,
    deselectAll,
    toggleSelect,
    isSelected,
    selectedCount: selectedItems.length
  }
}
