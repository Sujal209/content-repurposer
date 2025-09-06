'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  FileText, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Copy, 
  Download,
  Loader2,
  RefreshCw,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  CheckCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProductionAuth } from '@/lib/auth-context-production'
import Footer from '@/components/footer'
import { createProductionClient } from '@/lib/supabase-production'
import { useToast } from '@/components/ui/toast'
import { Loading } from '@/components/ui/loading'
import ContentPreferences, { type ContentPreferences as ContentPreferencesType } from '@/components/content-preferences'
import ContentAnalysisDisplay from '@/components/content-analysis-display'
import { analyzeContent, type ContentAnalysis } from '@/lib/content-analysis'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ContentGenerationSkeleton } from '@/components/ui/skeleton'
import { QuickShareButton } from '@/components/share-content'
import { ContentPreviewModal } from '@/components/content-preview-modal'
import { Eye } from 'lucide-react'

const contentTypes = [
  { id: 'twitter', name: 'Twitter Thread', icon: Twitter, color: 'bg-blue-500', description: '10 engaging tweets with hooks' },
  { id: 'linkedin', name: 'LinkedIn Carousel', icon: Linkedin, color: 'bg-blue-600', description: 'Professional slideshow format' },
  { id: 'instagram', name: 'Instagram Reels', icon: Instagram, color: 'bg-purple-500', description: 'Viral short-form video scripts' },
]

type SocialFormat = 'twitter' | 'linkedin' | 'instagram'

interface Transformation {
  format: SocialFormat
  content: string
}

interface GeneratedContent {
  type: SocialFormat
  title: string
  content: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  analysis?: ContentAnalysis
  improvementTips?: string[]
}

export default function Dashboard() {
  const { user, loading, signOut } = useProductionAuth()
  const router = useRouter()
  const supabase = createProductionClient()
  const { toast } = useToast()
  const [inputContent, setInputContent] = useState('')
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [wordCount, setWordCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [contentPreferences, setContentPreferences] = useState<ContentPreferencesType>({})
  const [currentAnalysis, setCurrentAnalysis] = useState<ContentAnalysis | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean
    content: any | null
  }>({
    isOpen: false,
    content: null
  })

  type Plan = 'free' | 'pro' | 'enterprise'
  const [plan, setPlan] = useState<Plan>('free')
  const LIMITS: Record<Plan, number> = {
    free: parseInt(process.env.NEXT_PUBLIC_FREE_DAILY_LIMIT || '3', 10),
    pro: parseInt(process.env.NEXT_PUBLIC_PRO_DAILY_LIMIT || '200', 10),
    enterprise: parseInt(process.env.NEXT_PUBLIC_ENTERPRISE_DAILY_LIMIT || '2000', 10),
  }
  const [usedToday, setUsedToday] = useState(0)
  const dailyLimit = LIMITS[plan]
  const remainingToday = Math.max(dailyLimit - usedToday, 0)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth')
    }
  }, [loading, user, router])

  // Load usage and plan
  useEffect(() => {
    const loadUsage = async () => {
      if (!user) return
      const meta = (user.user_metadata || {}) as Record<string, any>
      const p = (meta.plan as Plan) || 'free'
      setPlan(p)
      const today = new Date().toISOString().slice(0, 10)
      const { data } = await supabase
        .from('generation_limits')
        .select('count')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle()
      setUsedToday(data?.count ?? 0)
    }
    loadUsage()
  }, [user, supabase])

  const handleSignOut = async () => {
    await signOut()
    router.push('/') // Redirect to landing page
  }

  const handleInputChange = (value: string) => {
    setInputContent(value)
    setWordCount(value.trim().split(/\s+/).filter(word => word.length > 0).length)
    
    // Analyze content in real-time if it's substantial
    if (value.length > 200) {
      const analysis = analyzeContent(value, 'twitter') // Default platform for analysis
      setCurrentAnalysis(analysis)
    } else {
      setCurrentAnalysis(null)
    }
  }

  const toggleFormat = (formatId: string) => {
    setSelectedFormats(prev => 
      prev.includes(formatId) 
        ? prev.filter(id => id !== formatId)
        : [...prev, formatId]
    )
  }

  const generateContent = async () => {
    if (!inputContent.trim() || selectedFormats.length === 0) return
    if (selectedFormats.length > remainingToday) return

    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: inputContent,
          formats: selectedFormats,
          preferences: contentPreferences
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          toast({ type: 'error', title: 'Please sign in', description: 'Your session has expired. Sign in again to continue.' })
        } else if (response.status === 403) {
          toast({ type: 'error', title: 'Security check failed', description: data.error || 'Please refresh and try again.' })
        } else if (response.status === 429) {
          const remaining = response.headers.get('X-Usage-Remaining')
          const limit = response.headers.get('X-Usage-Limit')
          toast({ type: 'warning', title: 'Daily limit reached', description: `You have ${remaining} of ${limit} remaining today.` })
        } else {
          toast({ type: 'error', title: 'Something went wrong', description: data.error || 'Please try again later.' })
        }
        return
      }
      
      if (data.success && data.transformations) {
        // update usage locally
        setUsedToday((u) => u + selectedFormats.length)
        const generated = data.transformations.map((transformation: any) => {
          const format = contentTypes.find(t => t.id === transformation.format)!
          
          return {
            type: transformation.format,
            title: format.name,
            content: transformation.content,
            icon: format.icon,
            color: format.color,
            analysis: transformation.analysis,
            improvementTips: transformation.improvementTips
          }
        })
        
        setGeneratedContent(generated)
        
        // Show success message
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 5000)
      } else {
        throw new Error('Failed to transform content')
      }
    } catch (error) {
      console.error('Error generating content:', error)
      toast({ type: 'error', title: 'Generation failed', description: 'We could not generate content right now. Please try again.' })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (content: string, title: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({ 
        type: 'success', 
        title: 'Content copied!', 
        description: `${title} copied to clipboard` 
      })
    } catch (error) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = content
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      toast({ 
        type: 'success', 
        title: 'Content copied!', 
        description: `${title} copied to clipboard` 
      })
    }
  }

  const handlePreview = (item: GeneratedContent) => {
    setPreviewModal({
      isOpen: true,
      content: {
        id: Date.now().toString(),
        title: item.title,
        content: item.content,
        content_type: item.type,
        created_at: new Date().toISOString()
      }
    })
  }

  const handleShare = (content: any) => {
    setPreviewModal({ isOpen: false, content: null })
    // The QuickShareButton will handle opening the share modal
  }

  const clearAll = () => {
    setInputContent('')
    setSelectedFormats([])
    setGeneratedContent([])
    setWordCount(0)
    setContentPreferences({}) // Reset content preferences
    setCurrentAnalysis(null)   // Clear content analysis
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      {/* Animated background elements */}
      <div className="data-lines" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface/5 to-background" />
      {/* Header */}
      <header className="border-b border-border bg-card-bg/80 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/repurposemate-logo.png" 
                alt="ContentCraft logo" 
                className="w-10 h-10 object-contain drop-shadow-lg"
              />
              <h1 className="text-xl font-bold gradient-text">ContentCraft</h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Desktop Navigation */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/pricing')}
                className="hidden sm:flex text-muted hover:text-foreground"
              >
                Pricing
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/history')}
                className="hidden sm:flex text-muted hover:text-foreground"
              >
                Library
              </Button>
              <div className="hidden lg:flex items-center gap-4 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded bg-gray-100 text-gray-800">Plan: {plan.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded bg-gray-100 text-gray-800">Remaining: {remainingToday}/{dailyLimit}</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">{user?.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex"
                onClick={() => router.push('/settings')}
              >
                <Settings className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden sm:flex">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden text-muted hover:text-foreground p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden border-t border-border bg-card-bg/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-3">
                {/* User Info */}
                {user?.email && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50">
                    <img 
                      src="/repurposemate-logo.png" 
                      alt="ContentCraft" 
                      className="w-10 h-10 object-contain drop-shadow-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-heading truncate">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 text-xs rounded bg-primary/20 text-primary border border-primary/30">
                          {plan.toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 text-xs rounded bg-surface text-muted border border-border">
                          {remainingToday}/{dailyLimit} left
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Items */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      router.push('/pricing')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-surface/50 transition-colors"
                  >
                    <span className="text-heading">Pricing</span>
                  </button>
                  <button
                    onClick={() => {
                      router.push('/history')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-surface/50 transition-colors"
                  >
                    <span className="text-heading">Library</span>
                  </button>
                  <button
                    onClick={() => {
                      router.push('/settings')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-surface/50 transition-colors"
                  >
                    <Settings className="h-5 w-5 text-muted" />
                    <span className="text-heading">Settings</span>
                  </button>
                </div>

                {/* Sign Out */}
                <div className="pt-3 border-t border-border">
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6 flex-1">
        {/* Breadcrumb Navigation */}
        <Breadcrumb 
          items={[{ label: 'Dashboard', icon: Sparkles }]}
          className="mb-2"
        />
        
        {/* Top Row: Your Content and Output Formats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 p-[10px]">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Your Content
                  </CardTitle>
                  <CardDescription>
                    Paste your blog post, video script, or podcast transcript
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4 p-4 sm:p-6">
                  <textarea
                    value={inputContent}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Paste your long-form content here... (blog posts, video scripts, podcast transcripts)"
                    className="flex-1 min-h-[200px] sm:min-h-[300px] w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base mobile-text-base"
                  />
                  <div className="flex justify-between items-center text-sm text-muted">
                    <span>{wordCount} words</span>
                    <span>{wordCount >= 100 ? '✅' : '⚠️'} {wordCount >= 100 ? 'Good length' : 'Add more content'}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Sidebar - Output Formats */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Output Formats</CardTitle>
                  <CardDescription>
                    Choose which social media formats to generate
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-3 p-4 sm:p-6">
                  <div className="flex-1 space-y-3">
                    {contentTypes.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => toggleFormat(type.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedFormats.includes(type.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full ${type.color} flex items-center justify-center flex-shrink-0`}>
                            <type.icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm text-heading">{type.name}</h3>
                            <p className="text-xs text-muted mt-1">{type.description}</p>
                          </div>
                          {selectedFormats.includes(type.id) && (
                            <div className="text-primary text-sm font-medium">✓</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-border space-y-3 mt-auto">
                    <Button
                      onClick={generateContent}
                      disabled={!inputContent.trim() || selectedFormats.length === 0 || isGenerating || selectedFormats.length > remainingToday}
                      variant="gradient"
                      size="lg"
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Magic...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Transform Content
                        </>
                      )}
                    </Button>

                    {selectedFormats.length > remainingToday && (
                      <p className="text-xs text-red-500 text-center">Not enough daily credits for {selectedFormats.length} formats. Remaining today: {remainingToday}.</p>
                    )}
                    
                    <Button
                      onClick={clearAll}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Content Preferences */}
        <div className="mt-2">
          <ContentPreferences 
            preferences={contentPreferences}
            onPreferencesChange={setContentPreferences}
            selectedFormats={selectedFormats}
            inputContent={inputContent}
          />
        </div>

        {/* Content Analysis */}
        {currentAnalysis && (
          <div className="mt-2">
            <ContentAnalysisDisplay 
              analysis={currentAnalysis}
              className=""
            />
          </div>
        )}

        {/* Full Width Generated Content Section */}
        {(generatedContent.length > 0 || isGenerating) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full mt-2"
          >
            <Card className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-heading">Generated Content</CardTitle>
                    <CardDescription className="text-base">
                      Your transformed content ready for social media
                    </CardDescription>
                  </div>
                  {generatedContent.length > 0 && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="w-full">
                {isGenerating && (
                  <ContentGenerationSkeleton />
                )}
                
                {generatedContent.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full">
                    {generatedContent.map((item, index) => (
                      <motion.div
                        key={item.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-border rounded-xl p-5 sm:p-6 bg-card-bg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-5 gap-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}>
                              <item.icon className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-base sm:text-lg truncate text-heading">{item.title}</h3>
                          </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreview(item)}
                              className="mobile-touch-target hover:bg-gray-50 min-w-[44px] h-[44px] sm:min-w-auto sm:h-auto p-2.5 sm:p-2"
                              title="Preview content"
                              aria-label="Preview content"
                            >
                              <Eye className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(item.content, item.title)}
                              className="mobile-touch-target hover:bg-gray-50 min-w-[44px] h-[44px] sm:min-w-auto sm:h-auto p-2.5 sm:p-2"
                              title="Copy to clipboard"
                              aria-label="Copy content to clipboard"
                            >
                              <Copy className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                const blob = new Blob([item.content], { type: 'text/plain' })
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = `${item.title || 'content'}-${item.type}.txt`
                                a.click()
                                URL.revokeObjectURL(url)
                              }}
                              className="mobile-touch-target hover:bg-gray-50 min-w-[44px] h-[44px] sm:min-w-auto sm:h-auto p-2.5 sm:p-2"
                              title="Download content"
                              aria-label="Download content"
                            >
                              <Download className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <QuickShareButton
                              content={{
                                id: Date.now().toString(),
                                title: item.title,
                                content: item.content,
                                content_type: item.type as 'twitter' | 'linkedin' | 'instagram',
                                created_at: new Date().toISOString()
                              }}
                              variant="icon"
                              className="mobile-touch-target hover:bg-gray-50 min-w-[44px] h-[44px] sm:min-w-auto sm:h-auto p-2.5 sm:p-2"
                            />
                          </div>
                        </div>
                        <div className="bg-surface/30 rounded-lg p-4 sm:p-5 min-h-[200px]">
                          <pre className="whitespace-pre-wrap text-xs sm:text-sm text-foreground font-mono leading-relaxed">
                            {item.content}
                          </pre>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Success Message */}
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Content generated successfully!</span>
            </div>
          </motion.div>
        )}

        {/* Empty State Placeholder */}
        {generatedContent.length === 0 && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full mt-2"
          >
            <Card className="w-full border-2 border-dashed border-gray-300 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
              <CardContent className="py-16 text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
                >
                  <Sparkles className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-heading mb-3">Ready to Transform Your Content!</h3>
                <p className="text-muted max-w-md mx-auto mb-6">
                  Add your long-form content above, select the output formats you want, and click "Transform Content" to generate engaging social media posts.
                </p>
                <div className="flex items-center justify-center gap-8 text-sm text-muted">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Platform-Optimized</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>Lightning Fast</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
      
      <Footer />
      
      {/* Enhanced Content Preview Modal */}
      <ContentPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, content: null })}
        content={previewModal.content}
        onCopy={(content) => copyToClipboard(content, previewModal.content?.title || 'Content')}
        onShare={handleShare}
      />
    </div>
  )
}
