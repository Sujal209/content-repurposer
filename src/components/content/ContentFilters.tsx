'use client'

import { Search, X, CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import CustomDropdown from '@/components/ui/custom-dropdown'

interface ContentFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  contentType: string
  onContentTypeChange: (value: string) => void
  dateRange?: DateRange
  onDateRangeChange: (range: DateRange | undefined) => void
  className?: string
}

export function ContentFilters({
  searchQuery,
  onSearchChange,
  contentType,
  onContentTypeChange,
  dateRange,
  onDateRangeChange,
  className,
}: ContentFiltersProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content by title or keywords..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-gray-100"
              onClick={() => onSearchChange('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <CustomDropdown
          value={contentType}
          onChange={onContentTypeChange}
          options={[
            { 
              value: 'all', 
              label: 'All Platforms', 
              icon: '🌐',
              color: ''
            },
            { 
              value: 'twitter', 
              label: 'Twitter', 
              icon: '🐦',
              color: 'bg-gradient-to-r from-sky-400 to-blue-500'
            },
            { 
              value: 'linkedin', 
              label: 'LinkedIn', 
              icon: '💼',
              color: 'bg-gradient-to-r from-blue-600 to-blue-700'
            },
            { 
              value: 'instagram', 
              label: 'Instagram', 
              icon: '📸',
              color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500'
            }
          ]}
          className="w-[180px]"
        />

        <div className="relative">
          <Button
            variant="outline"
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !dateRange?.from && 'text-muted-foreground'
            )}
            onClick={() => {
              // For now, we'll implement a simple date picker later
              // This is a placeholder for the date range functionality
            }}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                  {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
            {dateRange?.from && (
              <X
                className="ml-auto h-4 w-4"
                onClick={(e) => {
                  e.stopPropagation()
                  onDateRangeChange(undefined)
                }}
              />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
