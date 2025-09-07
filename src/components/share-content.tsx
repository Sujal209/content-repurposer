'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Share2, 
  Copy, 
  Download, 
  Link2, 
  Twitter, 
  Linkedin, 
  Facebook,
  Mail,
  MessageCircle,
  CheckCircle,
  ExternalLink,
  Globe,
} from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ContentRow {
  id: string
  title: string | null
  content: string
  content_type: 'twitter' | 'linkedin' | 'instagram'
  created_at: string
}

interface ShareContentModalProps {
  isOpen: boolean
  onClose: () => void
  content: ContentRow | null
  onShare?: (platform: string, content: ContentRow) => void
}

const shareOptions = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
    color: 'from-blue-500 to-blue-600',
    hoverColor: 'hover:from-blue-600 hover:to-blue-700',
    description: 'Share as a tweet',
    category: 'social',
    popularity: 95
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'from-blue-600 to-blue-700',
    hoverColor: 'hover:from-blue-700 hover:to-blue-800',
    description: 'Professional network',
    category: 'professional',
    popularity: 88
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'from-blue-700 to-indigo-600',
    hoverColor: 'hover:from-blue-800 hover:to-indigo-700',
    description: 'Social network',
    category: 'social',
    popularity: 82
  },
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    color: 'from-gray-600 to-gray-700',
    hoverColor: 'hover:from-gray-700 hover:to-gray-800',
    description: 'Send via email',
    category: 'direct',
    popularity: 90
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'from-green-500 to-green-600',
    hoverColor: 'hover:from-green-600 hover:to-green-700',
    description: 'Instant messaging',
    category: 'messaging',
    popularity: 93
  }
]

export function ShareContentModal({ 
  isOpen, 
  onClose, 
  content,
  onShare
}: ShareContentModalProps) {
  const [contentCopied, setContentCopied] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')

  if (!content) return null

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(content.content)
      setContentCopied(true)
      setTimeout(() => setContentCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handlePlatformShare = (platform: string) => {
    const text = encodeURIComponent(content.content)
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(content.title || 'Check out this content')

    let shareLink = ''

    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        break
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`
        break
      case 'email':
        shareLink = `mailto:?subject=${title}&body=${text}%0A%0A${url}`
        break
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${text}%20${url}`
        break
      default:
        return
    }

    window.open(shareLink, '_blank', 'width=700,height=500,scrollbars=yes,resizable=yes')
    
    if (onShare) {
      onShare(platform, content)
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

  const filteredOptions = selectedCategory === 'all' 
    ? shareOptions 
    : shareOptions.filter(option => option.category === selectedCategory)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title=""
      showHeader={false}
      className="max-h-[90vh] cyber-glass mx-2 sm:mx-0"
    >
      <div className="relative">
        {/* Custom Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold gradient-text">
                Share Content
              </h2>
              <p className="text-sm text-muted">
                Spread your content across platforms
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted hover:text-primary"
          >
            ×
          </Button>
        </div>

        <div className="space-y-3 sm:space-y-6 max-h-[calc(90vh-6rem)] overflow-y-auto p-3 sm:p-6">
          {/* Enhanced Content Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="neon-glow-blue">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="gradient-text-accent text-sm sm:text-base">Content Preview</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-surface/50 text-xs">
                      {content.content_type.toUpperCase()}
                    </Badge>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyContent}
                        className="text-xs px-2 sm:px-3 h-7"
                      >
                        {contentCopied ? (
                          <CheckCircle className="h-3 w-3 sm:mr-1 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3 sm:mr-1" />
                        )}
                        <span className="hidden sm:inline">{contentCopied ? 'Copied!' : 'Copy'}</span>
                      </Button>
                    </motion.div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-surface/40 to-surface/20 rounded-xl p-2 sm:p-4 border border-border/50 backdrop-blur-sm max-h-20 sm:max-h-32 overflow-y-auto">
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                    {content.content.length > 200 
                      ? `${content.content.substring(0, 200)}...`
                      : content.content
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Platform Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4">
              <h3 className="text-sm font-medium gradient-text-secondary">Share to Platform</h3>
              <div className="flex items-center gap-1 flex-wrap">
                {['all', 'social', 'professional', 'messaging'].map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'cyber' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs px-2 py-1 h-6 sm:h-7 capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <AnimatePresence>
                {filteredOptions.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => handlePlatformShare(option.id)}
                      className="flex items-center gap-3 p-3 sm:p-4 h-auto justify-start w-full bg-gradient-to-r from-surface/20 to-surface/10 border-border/50 hover:border-primary/30 transition-all duration-300"
                    >
                      <div className={`p-1.5 sm:p-2 rounded-xl text-white bg-gradient-to-br ${option.color} ${option.hoverColor} flex-shrink-0 shadow-lg`}>
                        <option.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-xs sm:text-sm text-heading">{option.name}</span>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-400 hidden sm:inline">{option.popularity}%</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted hidden sm:block">{option.description}</div>
                        <div className="flex items-center gap-1 mt-1 sm:mt-1">
                          <ExternalLink className="h-3 w-3 text-primary" />
                          <span className="text-xs text-primary hidden sm:inline">Open in new tab</span>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Enhanced Additional Actions */}
          <motion.div 
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted order-2 sm:order-1">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <span>Created {new Date(content.created_at).toLocaleDateString()}</span>
              </div>
              <Badge variant="outline" className="bg-surface/50 text-xs">
                {content.content_type} content
              </Badge>
            </div>
            
            <div className="flex items-center justify-center sm:justify-end gap-2 order-1 sm:order-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 hover:border-accent/50 hover:text-accent text-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
              </motion.div>
              

            </div>
          </motion.div>
        </div>
      </div>
    </Modal>
  )
}

// Quick share button component
interface QuickShareButtonProps {
  content: ContentRow
  onShare?: (platform: string, content: ContentRow) => void
  variant?: 'icon' | 'full'
  className?: string
}

export function QuickShareButton({ 
  content, 
  onShare, 
  variant = 'icon',
  className 
}: QuickShareButtonProps) {
  const [showModal, setShowModal] = useState(false)

  if (variant === 'full') {
    return (
      <>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="gradient"
            size="sm"
            onClick={() => setShowModal(true)}
            className={className}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </motion.div>
        
        <ShareContentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          content={content}
          onShare={onShare}
        />
      </>
    )
  }

  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="cyber"
          size="sm"
          onClick={() => setShowModal(true)}
          className={className}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </motion.div>
      
      <ShareContentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        content={content}
        onShare={onShare}
      />
    </>
  )
}
