'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Share2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContentPreviewModal } from '@/components/content-preview-modal'
import { ShareContentModal } from '@/components/share-content'

interface ContentRow {
  id: string
  title: string | null
  content: string
  content_type: 'twitter' | 'linkedin' | 'instagram'
  created_at: string
}

// Sample content data
const sampleContent = {
  id: 'demo-content-1',
  title: 'AI-Powered Content Strategy for 2024',
  content: `🚀 The Future of Content Creation is Here! 

In 2024, AI isn't just changing how we create content—it's revolutionizing the entire content strategy landscape.

Here's what every content creator needs to know:

1/ 📊 Data-Driven Personalization
AI analyzes user behavior patterns to create hyper-personalized content experiences. No more one-size-fits-all approaches.

2/ ⚡ Real-Time Content Optimization  
Smart algorithms adjust your content performance in real-time, maximizing engagement across all platforms.

3/ 🎯 Predictive Content Planning
AI predicts trending topics before they explode, giving you a competitive edge in content planning.

4/ 🤖 Automated Content Distribution
Intelligent scheduling ensures your content reaches the right audience at the perfect moment.

5/ 📈 Performance Analytics 2.0
Advanced AI analytics provide deeper insights into what resonates with your audience.

The brands that embrace AI-powered content strategies now will dominate their niches in 2024.

Are you ready to transform your content game?

#ContentStrategy #AI #DigitalMarketing #ContentCreation #2024Trends`,
  content_type: 'twitter' as const,
  created_at: new Date().toISOString()
}

const sampleLinkedInContent = {
  id: 'demo-content-2',
  title: 'Professional Growth Through AI Tools',
  content: `The Professional's Guide to AI-Enhanced Productivity

As we navigate the evolving workplace landscape, artificial intelligence has become an indispensable ally for professionals across all industries.

Key Benefits of AI Integration:

• Enhanced Decision Making: AI provides data-driven insights that improve strategic thinking
• Time Optimization: Automated routine tasks free up time for high-value activities  
• Skill Development: AI tools help identify and bridge knowledge gaps
• Competitive Advantage: Early adopters gain significant market positioning

Implementation Strategy:
1. Start with one AI tool in your daily workflow
2. Measure productivity improvements
3. Gradually expand to complementary tools
4. Share learnings with your team

The future belongs to professionals who can effectively collaborate with AI systems while maintaining their human creativity and strategic thinking.

What AI tools have transformed your professional workflow?

#ProfessionalDevelopment #ArtificialIntelligence #Productivity #FutureOfWork`,
  content_type: 'linkedin' as const,
  created_at: new Date().toISOString()
}

const sampleInstagramContent = {
  id: 'demo-content-3',
  title: 'Visual Storytelling with AI',
  content: `✨ Creating Magic with AI ✨

Story 1: "The Creative Revolution"
🎨 AI isn't replacing creativity—it's amplifying it!
Show: Split screen of traditional vs AI-enhanced design

Story 2: "Behind the Scenes"  
📱 How I use AI tools in my daily creative process
Show: Screen recording of AI tools in action

Story 3: "Before & After"
🔄 Transform ordinary content into extraordinary
Show: Content transformation examples

Story 4: "Quick Tips"
💡 3 AI tools every creator should know
Show: Tool screenshots with key features

Story 5: "Community Love"
❤️ Featuring amazing AI-created content from followers
Show: User-generated content showcase

Story 6: "What's Next?"
🚀 The future of AI in creative industries
Show: Futuristic concept visuals

Story 7: "Call to Action"
📲 Try these tools and tag me in your creations!
Show: Swipe-up link to resources

#AICreativity #ContentCreation #DigitalArt #CreativeProcess #AITools #Innovation`,
  content_type: 'instagram' as const,
  created_at: new Date().toISOString()
}

export function ModalDemo() {
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

  const handlePreview = (content: ContentRow) => {
    setPreviewModal({ isOpen: true, content })
  }

  const handleShare = (content: ContentRow) => {
    setPreviewModal({ isOpen: false, content: null })
    setShareModal({ isOpen: true, content })
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    // In a real app, you'd show a toast notification here
    console.log('Content copied to clipboard!')
  }

  const handlePlatformShare = (platform: string, content: ContentRow) => {
    console.log(`Sharing to ${platform}:`, content.title)
    // In a real app, this would handle the actual sharing logic
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">Enhanced Modals Demo</h1>
          </div>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Experience the enhanced Content Preview and Share Content modals with improved UI, animations, and functionality.
          </p>
        </motion.div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Twitter Content Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 neon-glow-blue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">T</span>
                  </div>
                  Twitter Thread
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-surface/30 rounded-lg p-3 max-h-32 overflow-y-auto">
                  <p className="text-sm text-foreground leading-relaxed">
                    {sampleContent.content.substring(0, 150)}...
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="cyber"
                    size="sm"
                    onClick={() => handlePreview(sampleContent)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => handleShare(sampleContent)}
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* LinkedIn Content Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 neon-glow-green">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">L</span>
                  </div>
                  LinkedIn Post
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-surface/30 rounded-lg p-3 max-h-32 overflow-y-auto">
                  <p className="text-sm text-foreground leading-relaxed">
                    {sampleLinkedInContent.content.substring(0, 150)}...
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="cyber"
                    size="sm"
                    onClick={() => handlePreview(sampleLinkedInContent)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => handleShare(sampleLinkedInContent)}
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Instagram Content Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 neon-glow-pink">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">I</span>
                  </div>
                  Instagram Stories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-surface/30 rounded-lg p-3 max-h-32 overflow-y-auto">
                  <p className="text-sm text-foreground leading-relaxed">
                    {sampleInstagramContent.content.substring(0, 150)}...
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="cyber"
                    size="sm"
                    onClick={() => handlePreview(sampleInstagramContent)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => handleShare(sampleInstagramContent)}
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-surface/40 to-surface/20 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center gradient-text-secondary">Enhanced Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-heading">Smooth Animations</h3>
                  <p className="text-sm text-muted">Framer Motion powered transitions</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/30 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-heading">Enhanced Preview</h3>
                  <p className="text-sm text-muted">Rich content analysis & stats</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 flex items-center justify-center">
                    <Share2 className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-heading">Smart Sharing</h3>
                  <p className="text-sm text-muted">Platform-specific optimizations</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                    <span className="text-purple-400 font-bold">UI</span>
                  </div>
                  <h3 className="font-semibold text-heading">Modern Design</h3>
                  <p className="text-sm text-muted">Cyberpunk-inspired aesthetics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Modals */}
      <ContentPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, content: null })}
        content={previewModal.content}
        onCopy={handleCopy}
        onShare={handleShare}
      />

      <ShareContentModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ isOpen: false, content: null })}
        content={shareModal.content}
        onShare={handlePlatformShare}
      />
    </div>
  )
}