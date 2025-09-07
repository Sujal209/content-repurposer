'use client'

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  Twitter, 
  Linkedin, 
  Instagram,
  Calendar,
  Eye,
  Copy,
  Trash2,
  Archive,
  LogOut,
  User,
  Grid3X3,
  List,
  RefreshCw,
  Search,
  Share2,

  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'


import { ContentPreviewModal } from '@/components/content-preview-modal'
import { ShareContentModal } from '@/components/share-content'
import { ConfirmModal } from '@/components/ui/modal'
import { useProductionAuth } from '@/lib/auth-context-production'
import Footer from '@/components/footer'
import { createProductionClient } from '@/lib/supabase-production'
import UsageBadge from '@/components/usage-badge'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { format, subDays, startOfWeek, startOfMonth, startOfYear } from 'date-fns'

interface ContentRow {
  id: string
  title: string | null
  content: string
  content_type: 'twitter' | 'linkedin' | 'instagram'
  created_at: string
}

const platformIcons = {
  twitter: { icon: Twitter, color: 'bg-blue-500', name: 'Twitter' },
  linkedin: { icon: Linkedin, color: 'bg-blue-600', name: 'LinkedIn' },
  instagram: { icon: Instagram, color: 'bg-purple-500', name: 'Instagram' }
} as const

type PlatformType = keyof typeof platformIcons

const getPlatformIcon = (contentType: string) => {
  return platformIcons[contentType as PlatformType] || {
    icon: Share2,
    color: 'bg-gray-500',
    name: 'Unknown'
  }
}

export default function HistoryPage() {
  const { user, loading, signOut } = useProductionAuth()
  const router = useRouter()
  const channelRef = useRef<any>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [contentType, setContentType] = useState('all')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [items, setItems] = useState<ContentRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState(0)
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean
    content: ContentRow | null
  }>({
    isOpen: false,
    content: null
  })
  const [shareModal, setShareModal] = useState<{
    isOpen: boolean
    content: ContentRow | null
  }>({
    isOpen: false,
    content: null
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'type'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')


  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth')
    }
  }, [loading, user, router])

  // Fetch content when filters change (not search)
  useEffect(() => {
    fetchContent()
  }, [contentType, dateRange])

  const fetchContent = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createProductionClient()
      let query = supabase
        .from('content_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      // Apply search filter
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
      }

      // Apply content type filter
      if (contentType !== 'all') {
        query = query.eq('content_type', contentType)
      }

      // Apply date range filter
      if (dateRange?.from) {
        query = query.gte('created_at', dateRange.from.toISOString())
      }
      if (dateRange?.to) {
        // Add one day to include the entire end date
        const endOfDay = new Date(dateRange.to)
        endOfDay.setHours(23, 59, 59, 999)
        query = query.lte('created_at', endOfDay.toISOString())
      }

      const { data, error } = await query

      if (error) throw error
      setItems(data || [])
      setLastRefresh(Date.now())
    } catch (err) {
      console.error('Error fetching content:', err)
      setError('Failed to load content. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [user, searchQuery, contentType, dateRange])

  // Function to refresh content
  const refreshContent = async (force = false) => {
    await fetchContent()
    
    try {
      // Try API route first for better security
      const response = await fetch('/api/history?' + new URLSearchParams({
        t: Date.now().toString() // Cache busting
      }), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Ensure fresh data
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          console.log('API returned', result.data.length, 'items')
          setItems(result.data as ContentRow[])
          setLastRefresh(Date.now())
          return
        }
      }
      
      // Fallback to direct Supabase query if API fails
      console.warn('API route failed, falling back to direct Supabase query')
      const supabase = createProductionClient()
      const { data, error } = await supabase
        .from('content_history')
        .select('id, title, content, content_type, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        console.log('Direct query returned', data.length, 'items')
        setItems(data as ContentRow[])
        setLastRefresh(Date.now())
      } else if (error) {
        console.error('Error fetching history:', error)
      }
    } catch (err) {
      console.error('Failed to fetch history:', err)
      // Final fallback to direct query
      try {
        const fallbackSupabase = createProductionClient()
        const { data, error } = await fallbackSupabase
          .from('content_history')
          .select('id, title, content, content_type, created_at')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
        
        if (!error && data) {
          console.log('Fallback query returned', data.length, 'items')
          setItems(data as ContentRow[])
          setLastRefresh(Date.now())
        }
      } catch (fallbackErr) {
        console.error('Fallback query failed:', fallbackErr)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load effect
  useEffect(() => {
    refreshContent()
  }, [user?.id])

  // Refresh only when user navigates to the page (not auto-refresh)
  // This is handled by the initial load effect and visibility change effect

  // Removed automatic refresh on tab visibility change for better UX
  // Users can manually refresh if needed

  // Separate effect for realtime subscription to prevent re-subscription issues
  useEffect(() => {
    if (!user) return

    // Clean up any existing channel first
    if (channelRef.current) {
      const supabase = createProductionClient()
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }

    // Enable realtime for immediate content updates
    const ENABLE_REALTIME = true
    
    if (ENABLE_REALTIME) {
      try {
        const supabase = createProductionClient()
        const channel = supabase
          .channel('content_history_changes')
          .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'content_history', 
            filter: `user_id=eq.${user?.id}` 
          }, (payload) => {
            console.log('Real-time INSERT detected:', payload)
            const row = payload.new as ContentRow
            console.log('Adding new row to history:', row)
            setItems((prev) => [row, ...prev])
          })
          .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'content_history', 
            filter: `user_id=eq.${user?.id}` 
          }, (payload) => {
            const row = payload.new as ContentRow
            setItems((prev) => prev.map((i) => (i.id === row.id ? row : i)))
          })
          .on('postgres_changes', { 
            event: 'DELETE', 
            schema: 'public', 
            table: 'content_history', 
            filter: `user_id=eq.${user?.id}` 
          }, (payload) => {
            const row = payload.old as { id: string }
            setItems((prev) => prev.filter((i) => i.id !== row.id))
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('Realtime subscription active')
            } else if (status === 'CLOSED') {
              console.warn('Realtime subscription closed')
            } else {
              console.warn('Realtime subscription status:', status)
            }
          })
        
        channelRef.current = channel
      } catch (err) {
        console.warn('Realtime subscription failed:', err)
      }
    }

    return () => {
      if (channelRef.current) {
        const supabase = createProductionClient()
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [user?.id])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Date range helper functions
  const getDateRangeLabel = () => {
    if (!dateRange?.from) return 'All Time'
    if (!dateRange?.to) return format(dateRange.from, 'MMM dd, yyyy') + ' - '
    if (dateRange.from.getTime() === dateRange.to.getTime()) {
      return format(dateRange.from, 'MMM dd, yyyy')
    }
    return format(dateRange.from, 'MMM dd') + ' - ' + format(dateRange.to, 'MMM dd, yyyy')
  }

  const setDateRangePreset = (preset: string) => {
    const now = new Date()
    switch (preset) {
      case 'all':
        setDateRange(undefined)
        break
      case 'today':
        setDateRange({ from: now, to: now })
        break
      case '7days':
        setDateRange({ from: subDays(now, 7), to: now })
        break
      case '30days':
        setDateRange({ from: subDays(now, 30), to: now })
        break
      case 'thisWeek':
        setDateRange({ from: startOfWeek(now, { weekStartsOn: 1 }), to: now })
        break
      case 'thisMonth':
        setDateRange({ from: startOfMonth(now), to: now })
        break
      case 'thisYear':
        setDateRange({ from: startOfYear(now), to: now })
        break
      default:
        break
    }
  }

  const clearDateRange = () => {
    setDateRange(undefined)
  }

  const filteredAndSortedContent = useMemo(() => {
    const filtered = items.filter((item) => {
      const matchesSearch = (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPlatform = contentType === 'all' || item.content_type === contentType
      return matchesSearch && matchesPlatform
    })

    // Sort items
    filtered.sort((a, b) => {
      let aValue: string | Date
      let bValue: string | Date
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.created_at)
          bValue = new Date(b.created_at)
          break
        case 'title':
          aValue = a.title || 'Untitled'
          bValue = b.title || 'Untitled'
          break
        case 'type':
          aValue = a.content_type
          bValue = b.content_type
          break
        default:
          return 0
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [items, searchQuery, contentType, sortBy, sortOrder])

  // For backward compatibility
  const filteredContent = filteredAndSortedContent

  const deleteContent = async (id: string) => {
    try {
      const response = await fetch(`/api/history?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setItems((prev) => prev.filter((i) => i.id !== id))

        }
      } else {
        console.error('Error deleting content:', response.statusText)
      }
    } catch (err) {
      console.error('Failed to delete content:', err)
    }
  }



  const exportContent = (format: 'json' | 'txt') => {
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(filteredContent, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'content_history.json'
      a.click()
      URL.revokeObjectURL(url)
    } else {
      const txt = filteredContent.map((i) => `# ${i.title}\nType: ${i.content_type}\nDate: ${i.created_at}\n\n${i.content}`).join('\n\n---\n\n')
      const blob = new Blob([txt], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'content_history.txt'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handlePreview = (item: ContentRow) => {
    setPreviewModal({ isOpen: true, content: item })
  }

  const handleShare = (content: ContentRow) => {
    setPreviewModal({ isOpen: false, content: null })
    setShareModal({ isOpen: true, content })
  }

  const handlePlatformShare = (platform: string, content: ContentRow) => {
    console.log(`Sharing to ${platform}:`, content.title)
    // In a real app, this would handle the actual sharing logic
  }

  const copyToClipboard = async (content: string, title?: string) => {
    try {
      await navigator.clipboard.writeText(content)
      // You might want to add a toast notification here
      console.log(`${title || 'Content'} copied to clipboard!`)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Animated background elements */}
      <div className="data-lines" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface/5 to-background" />
      
      {/* Header */}
      <header className="border-b border-border bg-card-bg/80 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-muted hover:text-foreground"
              >
                ← Back to Dashboard
              </Button>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:flex items-center gap-2">
                <UsageBadge />
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">{user?.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Content Library</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <p className="text-muted">Manage and organize your generated content</p>
                {lastRefresh > 0 && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    Updated: {new Date(lastRefresh).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => refreshContent(true)}
                disabled={isLoading}
                className="flex items-center gap-2"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button variant="outline" onClick={() => exportContent('json')} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button variant="outline" onClick={() => exportContent('txt')} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export TXT
              </Button>
              <Button onClick={() => router.push('/dashboard')} size="sm">
                Create New
              </Button>
            </div>
          </div>

          {/* Filters and Search */}
          {/* Filters and Search */}
<Card className="mb-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-xl border border-gray-700">
  <CardContent className="py-6">
    <div className="flex flex-col lg:flex-row gap-4 items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          placeholder="Search content by title or keywords..."
          className="pl-10 bg-gray-800/70 border border-gray-700 rounded-xl 
                     text-gray-100 placeholder-gray-400 focus:ring-2 
                     focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Controls Group */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Platform Filter */}
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          className="px-3 py-2 rounded-xl bg-gray-800/70 border border-gray-700 
                     text-gray-100 min-w-[140px] shadow-md 
                     hover:border-indigo-400 focus:outline-none 
                     focus:ring-2 focus:ring-indigo-500 transition-all"
          style={{
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '16px',
            paddingRight: '32px'
          }}
        >
          <option value="all">🌐 All Platforms</option>
          <option value="twitter">🐦 Twitter</option>
          <option value="linkedin">💼 LinkedIn</option>
          <option value="instagram">📸 Instagram</option>
        </select>

        {/* Date Range Filter */}
        <div className="relative">
          <select
            value="custom"
            onChange={(e) => {
              const value = e.target.value
              if (value !== 'custom') setDateRangePreset(value)
            }}
            className="px-3 py-2 rounded-xl bg-gray-800/70 border border-gray-700 
                       text-gray-100 min-w-[160px] shadow-md cursor-pointer 
                       hover:border-indigo-400 focus:ring-2 
                       focus:ring-indigo-500 transition-all"
            style={{
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M8 2v4'/%3e%3cpath d='M16 2v4'/%3e%3crect width='18' height='18' x='3' y='4' rx='2'/%3e%3cpath d='M3 10h18'/%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px',
              paddingRight: dateRange ? '52px' : '32px'
            }}
          >
            <option value="custom">{getDateRangeLabel()}</option>
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="thisYear">This Year</option>
          </select>
          {dateRange && (
            <button
              onClick={clearDateRange}
              className="absolute right-8 top-1/2 transform -translate-y-1/2 
                         text-gray-400 hover:text-white transition-colors"
              title="Clear date filter"
            >
              ×
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'type')}
            className="px-3 py-2 rounded-xl bg-gray-800/70 border border-gray-700 
                       text-gray-100 min-w-[100px] shadow-md"
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
            <option value="type">Type</option>
          </select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="bg-gray-800/70 border-gray-700 hover:bg-gray-700"
            title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>

        {/* View Mode */}
        <div className="flex items-center gap-1 border border-gray-700 rounded-xl 
                        bg-gray-800/70 shadow-md p-1 order-last sm:order-none">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title="Grid view"
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
        

      </div>
    </div>
  </CardContent>
</Card>


          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">Total Content</p>
                    <p className="text-2xl font-bold text-foreground">{items.length}</p>
                  </div>
                  <Archive className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">Newest</p>
                    <p className="text-sm text-foreground">
                      {items[0] ? new Date(items[0].created_at).toLocaleString() : '—'}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">This Month</p>
                    <p className="text-2xl font-bold text-foreground">
                      {items.filter(i => new Date(i.created_at).getMonth() === new Date().getMonth()).length}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>



          {/* Content Grid/List */}
          {filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Archive className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-heading mb-2">No Content Found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {searchQuery || contentType !== 'all' || dateRange
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "You haven't created any content yet. Start by transforming your first piece of content."
                }
              </p>
              {!searchQuery && contentType === 'all' && !dateRange && (
                <Button onClick={() => router.push('/dashboard')}>
                  Create Your First Content
                </Button>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredContent.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handlePreview(item)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-8 h-8 rounded-full ${getPlatformIcon(item.content_type).color} flex items-center justify-center`}>
                            {React.createElement(getPlatformIcon(item.content_type).icon, { className: "h-4 w-4 text-white" })}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-heading truncate">{item.title || 'Untitled'}</h3>
                            <div className="flex items-center gap-2 text-xs text-muted mt-1">
                              <span>{getPlatformIcon(item.content_type).name}</span>
                              <span>•</span>
                              <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="mb-4">
                        <p className="text-sm text-muted line-clamp-3">
                          {item.content.length > 150 ? `${item.content.substring(0, 150)}...` : item.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(item.content, item.title || 'Content')
                          }}
                          className="flex-1"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePreview(item)
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleShare(item)
                          }}
                          className="p-2"
                        >
                          <Share2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowDeleteConfirm(item.id)
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Enhanced Content Preview Modal */}
          <ContentPreviewModal
            isOpen={previewModal.isOpen}
            onClose={() => setPreviewModal({ isOpen: false, content: null })}
            content={previewModal.content}
            onCopy={(content) => copyToClipboard(content, previewModal.content?.title || 'Content')}
            onShare={handleShare}
            onDelete={(id) => {
              deleteContent(id)
              setPreviewModal({ isOpen: false, content: null })
            }}
          />

          {/* Enhanced Share Content Modal */}
          <ShareContentModal
            isOpen={shareModal.isOpen}
            onClose={() => setShareModal({ isOpen: false, content: null })}
            content={shareModal.content}
            onShare={handlePlatformShare}
          />

          {/* Delete Confirmation Modal */}
          <ConfirmModal
            isOpen={!!showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(null)}
            onConfirm={() => {
              if (showDeleteConfirm) {
                deleteContent(showDeleteConfirm)
                setShowDeleteConfirm(null)
              }
            }}
            title="Delete Content"
            message="Are you sure you want to delete this content? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            variant="destructive"
          />

        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
