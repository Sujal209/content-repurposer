'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Copy, 
  Download, 
  Share2, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Calendar,
  Eye,
  Hash,
  TrendingUp,
  Clock,
  FileText,
  Zap,
  CheckCircle,
  Edit3,
  Maximize2,
  Minimize2,
  Trash2
} from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ContentRow {
  id: string
  title: string | null
  content: string
  content_type: 'twitter' | 'linkedin' | 'instagram'
  created_at: string
}

interface ContentPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  content: ContentRow | null
  onCopy?: (content: string) => void
  onDelete?: (id: string) => void
  onShare?: (content: ContentRow) => void
}

const platformIcons = {
  twitter: { icon: Twitter, color: 'bg-blue-500', name: 'Twitter', description: 'Perfect for tweets and threads' },
  linkedin: { icon: Linkedin, color: 'bg-blue-600', name: 'LinkedIn', description: 'Professional networking content' },
  instagram: { icon: Instagram, color: 'bg-purple-500', name: 'Instagram', description: 'Visual storytelling content' }
} as const

export function ContentPreviewModal({ 
  isOpen, 
  onClose, 
  content,
  onCopy,
  onDelete,
  onShare
}: ContentPreviewModalProps) {
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [readingTime, setReadingTime] = useState(0)

  useEffect(() => {
    if (content) {
      // Calculate reading time (average 200 words per minute)
      const words = content.content.trim().split(/\s+/).length
      const time = Math.ceil(words / 200)
      setReadingTime(time)
    }
  }, [content])

  if (!content) return null

  const platform = platformIcons[content.content_type] || {
    icon: Share2,
    color: 'bg-gray-500',
    name: 'Unknown',
    description: 'Content format'
  }

  const handleCopy = async () => {
    if (onCopy) {
      onCopy(content.content)
    } else {
      try {
        await navigator.clipboard.writeText(content.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }
  }

  const handleDownload = () => {
    const blob = new Blob([content.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${content.title || 'content'}-${content.content_type}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getContentStats = (text: string) => {
    const words = text.trim().split(/\s+/).length
    const chars = text.length
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
    const hashtags = (text.match(/#[\w]+/g) || []).length
    
    return { words, chars, sentences, hashtags }
  }

  const stats = getContentStats(content.content)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={isExpanded ? "full" : "xl"}
      title=""
      showHeader={false}
      className="max-h-[95vh] sm:max-h-[90vh] cyber-glass"
    >
      <div className="relative">
        {/* Custom Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <motion.div 
              className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center shadow-lg`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <platform.icon className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold gradient-text">
                Content Preview
              </h2>
              <p className="text-sm text-muted">
                {platform.name} • {new Date(content.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted hover:text-primary"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted hover:text-primary"
            >
              ×
            </Button>
          </div>
        </div>

        <div className="space-y-6 max-h-[calc(95vh-8rem)] sm:max-h-[calc(90vh-8rem)] overflow-y-auto p-6">
          {/* Enhanced Header Info */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-heading">{content.title || 'Untitled Content'}</p>
                    <p className="text-xs text-muted">{platform.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Clock className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-heading">{readingTime} min read</p>
                    <p className="text-xs text-muted">Estimated time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Zap className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-heading">AI Generated</p>
                    <p className="text-xs text-muted">High quality</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Content Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="neon-glow-blue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 gradient-text">
                  <TrendingUp className="h-5 w-5" />
                  Content Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.div 
                    className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="text-2xl font-bold text-primary mb-1">{stats.words}</div>
                    <div className="text-xs text-muted uppercase tracking-wide">Words</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl border border-secondary/20 hover:border-secondary/40 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="text-2xl font-bold text-secondary mb-1">{stats.chars}</div>
                    <div className="text-xs text-muted uppercase tracking-wide">Characters</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20 hover:border-accent/40 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="text-2xl font-bold text-accent mb-1">{stats.sentences}</div>
                    <div className="text-xs text-muted uppercase tracking-wide">Sentences</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="text-2xl font-bold text-purple-400 mb-1">{stats.hashtags}</div>
                    <div className="text-xs text-muted uppercase tracking-wide">Hashtags</div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Content Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="neon-glow-green">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 gradient-text-accent">
                    <Eye className="h-5 w-5" />
                    Content Preview
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-surface/50 text-xs">
                      {platform.name}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted hover:text-primary"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="bg-gradient-to-br from-surface/40 to-surface/20 rounded-xl p-6 border border-border/50 backdrop-blur-sm max-h-64 overflow-y-auto custom-scrollbar">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-mono selection:bg-primary/20">
                      {content.content}
                    </pre>
                  </div>
                  <div className="absolute top-3 right-3">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="bg-surface/80 backdrop-blur-sm border border-border/50 hover:border-primary/50"
                      >
                        {copied ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Hashtag Analysis */}
          {stats.hashtags > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="neon-glow-pink">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 gradient-text-secondary">
                    <Hash className="h-5 w-5" />
                    Hashtag Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <AnimatePresence>
                      {(content.content.match(/#[\w]+/g) || []).map((hashtag, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Badge 
                            variant="outline" 
                            className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 text-primary hover:border-primary/50 transition-all duration-300 cursor-pointer"
                          >
                            {hashtag}
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {/* Enhanced Additional Actions - INSIDE scrollable area like share content */}
          <motion.div 
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-4 text-sm text-muted order-2 sm:order-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Created {new Date(content.created_at).toLocaleDateString()}</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Clock className="h-4 w-4 text-secondary" />
                <span>{new Date(content.created_at).toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center sm:justify-end gap-3 order-1 sm:order-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="cyber"
                  size="sm"
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 hover:border-accent/50 hover:text-accent"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
              </motion.div>
              
              {onShare && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => onShare(content)}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </motion.div>
              )}
              
              {onDelete && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      onDelete(content.id)
                      onClose()
                    }}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Modal>
  )
}
