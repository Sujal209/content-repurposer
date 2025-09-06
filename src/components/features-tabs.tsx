'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Zap, 
  Target, 
  Users,
  ArrowRight,
  Twitter,
  Linkedin,
  Instagram,
  TrendingUp,
  Clock,
  Brain,
  BarChart3,
  Eye,
  Share2,
  Bookmark,
  MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const featureCategories = {
  'ai-power': {
    title: 'AI-Powered Intelligence',
    icon: Sparkles,
    description: 'Advanced AI that understands context, tone, and platform requirements',
    features: [
      {
        icon: Brain,
        title: 'Context-Aware Generation',
        description: 'Our AI understands your content\'s context, maintaining key messages while adapting tone for each platform.',
        benefits: ['Preserves original meaning', 'Platform-appropriate tone', 'Consistent voice'],
        quickDemo: {
          input: 'Technical blog: "API Rate Limiting Best Practices"',
          outputs: {
            twitter: '🧵 Thread: Why your API is getting hammered (and how to fix it)',
            linkedin: '📊 Professional analysis with industry benchmarks',
            instagram: '📱 Visual guide: API basics for beginners'
          }
        },
        stats: ['3x better engagement', '90% context accuracy', '5-second processing']
      },
      {
        icon: Target,
        title: 'Platform Optimization',
        description: 'Each piece of content is optimized for maximum engagement on its target platform.',
        benefits: ['Format-specific structure', 'Optimal length', 'Platform best practices'],
        platformHighlights: [
          { platform: 'Twitter', icon: Twitter, feature: 'Viral thread patterns', boost: '+340% engagement' },
          { platform: 'LinkedIn', icon: Linkedin, feature: 'Professional formatting', boost: '+280% reach' },
          { platform: 'Instagram', icon: Instagram, feature: 'Story sequences', boost: '+420% views' }
        ],
        stats: ['3x higher engagement', '67% more shares', '2.5x reach']
      }
    ]
  },
  'speed': {
    title: 'Lightning Fast',
    icon: Zap,
    description: 'Transform content in seconds, not hours',
    features: [
      {
        icon: Clock,
        title: 'Instant Generation',
        description: 'Get 10+ social posts from one article in under 30 seconds. No more hours of manual adaptation.',
        benefits: ['30-second generation', '10+ posts per article', 'Batch processing'],
        timeComparison: {
          manual: '5+ hours per article',
          contentcraft: '30 seconds per article',
          savings: '10x faster'
        }
      },
      {
        icon: TrendingUp,
        title: 'Bulk Operations',
        description: 'Process multiple articles at once. Perfect for content backlogs and campaigns.',
        benefits: ['Batch processing', 'Queue management', 'Scheduled generation']
      }
    ]
  },
  'platforms': {
    title: 'Platform-Specific',
    icon: Target,
    description: 'Content tailored for each social media platform',
    features: [
      {
        icon: Twitter,
        title: 'Twitter Threads',
        description: 'Viral-ready threads with hooks, engagement patterns, and optimal formatting.',
        format: 'Thread format with numbered tweets, hooks, and call-to-actions',
        examples: [
          'Hook: "I spent $50k learning this lesson..."',
          'Numbered insights with emojis',
          'Engagement questions',
          'Thread continuation patterns'
        ]
      },
      {
        icon: Linkedin,
        title: 'LinkedIn Carousels',
        description: 'Professional carousel posts that drive business engagement.',
        format: 'Slide-by-slide content with professional tone and actionable insights',
        examples: [
          'Slide 1: Problem statement with stats',
          'Slides 2-8: Step-by-step solutions',
          'Slide 9: Key takeaways',
          'Slide 10: Call-to-action'
        ]
      },
      {
        icon: Instagram,
        title: 'Instagram Stories',
        description: 'Visual storytelling scripts optimized for story format.',
        format: 'Story sequence with visual cues and engagement elements',
        examples: [
          'Hook story with visual element',
          'Problem/solution narrative',
          'Step-by-step breakdown',
          'Call-to-action with swipe-up'
        ]
      }
    ]
  },
  'creators': {
    title: 'Built for Creators',
    icon: Users,
    description: 'Designed for indie makers, solopreneurs, and content creators',
    features: [
      {
        icon: Users,
        title: 'Creator-First Design',
        description: 'Simple interface designed for solo creators and small teams who need results fast.',
        benefits: ['One-click generation', 'Intuitive workflow', 'No learning curve'],
        simpleWorkflow: [
          { step: 'Paste', description: 'Drop your blog post or article', icon: '📝' },
          { step: 'Select', description: 'Choose your target platforms', icon: '🎯' },
          { step: 'Generate', description: 'AI creates optimized content', icon: '⚡' },
          { step: 'Publish', description: 'Copy and share instantly', icon: '🚀' }
        ],
        stats: ['30-second setup', '0 learning curve', '10+ platforms']
      },
      {
        icon: TrendingUp,
        title: 'Growth Tools',
        description: 'Built-in analytics and optimization suggestions to grow your audience.',
        benefits: ['Performance tracking', 'Engagement analytics', 'Growth recommendations'],
        growthFeatures: [
          { name: 'Content Analytics', description: 'Track what works best', icon: '📊' },
          { name: 'Engagement Insights', description: 'See audience preferences', icon: '💡' },
          { name: 'Growth Suggestions', description: 'AI-powered recommendations', icon: '📈' }
        ],
        stats: ['Track 15+ metrics', 'Weekly insights', 'Growth recommendations']
      }
    ]
  }
} as const

export default function FeaturesTabs() {
  const [activeTab, setActiveTab] = useState<keyof typeof featureCategories>('ai-power')
  const [selectedPlatform, setSelectedPlatform] = useState('twitter')

  const activeCategory = featureCategories[activeTab]

  const handleKey = (e: React.KeyboardEvent, key: keyof typeof featureCategories) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setActiveTab(key)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-5 mb-12 sm:mb-18">
        {Object.entries(featureCategories).map(([key, category]) => {
          const k = key as keyof typeof featureCategories
          const isActive = activeTab === k
          return (
            <div
              key={k}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              onClick={() => setActiveTab(k)}
              onKeyDown={(e) => handleKey(e, k)}
              className="cursor-pointer block w-full sm:w-auto p-2 sm:p-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div
                className={`relative z-10 w-full flex items-center gap-3 sm:gap-5 px-4 sm:px-7 py-4 sm:py-7 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 min-h-[70px] sm:min-h-[92px] ${
                  isActive
                    ? 'border-primary bg-primary/20 text-white shadow-xl shadow-primary/30 scale-105'
                    : 'border-border hover:border-primary/50 text-gray-300 hover:text-white hover:bg-surface/30 hover:shadow-lg'
                }`}
              >
                <category.icon className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-bold text-base sm:text-lg leading-tight truncate">{category.title}</div>
                  <div className="text-xs sm:text-sm opacity-90 mt-1 leading-tight line-clamp-2">{category.description}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            {activeCategory.features.map((feature, index) => (
              <div key={index} className="p-2 sm:p-[10px]">
                <Card className="overflow-hidden border-2 border-border/50 shadow-xl min-h-[300px] sm:min-h-[340px]">
                  <CardHeader className="pb-6 sm:pb-9 p-4 sm:p-6">
                    <CardTitle className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                        <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">{feature.title}</h3>
                        <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">{feature.description}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-8">
                      {/* Benefits/Details */}
                      <div className="space-y-3 sm:space-y-6">
                        {(feature as any).benefits && (
                          <div>
                            <h4 className="font-bold text-white mb-3 sm:mb-4 text-base sm:text-lg">Key Benefits:</h4>
                            <ul className="space-y-2 sm:space-y-3">
                              {(feature as any).benefits.map((benefit: string, i: number) => (
                                <motion.li 
                                  key={i} 
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="flex items-center gap-3 text-gray-300"
                                >
                                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400 flex-shrink-0 animate-pulse"></div>
                                  <span className="text-sm sm:text-base">{benefit}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Quick Demo for Context-Aware */}
                        {(feature as any).quickDemo && (
                          <div>
                            <h4 className="font-bold text-white mb-4 text-lg">Quick Example:</h4>
                            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-xl border border-blue-500/20 mb-4">
                              <div className="text-sm text-blue-300 mb-2 font-medium">Input:</div>
                              <div className="text-white font-medium">{(feature as any).quickDemo.input}</div>
                            </div>
                            <div className="space-y-3">
                              {Object.entries((feature as any).quickDemo.outputs).map(([platform, output]) => (
                                <div key={platform} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                  <div className="flex-shrink-0 mt-0.5">
                                    {platform === 'twitter' && <Twitter className="h-5 w-5 text-blue-400" />}
                                    {platform === 'linkedin' && <Linkedin className="h-5 w-5 text-blue-600" />}
                                    {platform === 'instagram' && <Instagram className="h-5 w-5 text-pink-500" />}
                                  </div>
                                  <span className="text-gray-200 text-sm leading-relaxed">{String(output)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Platform Highlights */}
                        {(feature as any).platformHighlights && (
                          <div>
                            <h4 className="font-bold text-white mb-4 text-lg">Platform Highlights:</h4>
                            <div className="space-y-4">
                              {(feature as any).platformHighlights.map((platform: any, i: number) => (
                                <div key={i} className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-4 rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-all">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                        <platform.icon className="h-5 w-5 text-white" />
                                      </div>
                                      <div className="text-white font-semibold">{platform.platform}</div>
                                    </div>
                                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                                      {platform.boost}
                                    </div>
                                  </div>
                                  <div className="text-gray-300 text-sm pl-11">{platform.feature}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {(feature as any).stats && (
                          <div>
                            <h4 className="font-semibold text-heading mb-3 text-sm sm:text-base">Performance Impact:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                              {(feature as any).stats.map((stat: string, i: number) => (
                                <motion.div 
                                  key={i} 
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="text-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200 hover:shadow-lg transition-shadow"
                                >
                                  <div className="text-sm sm:text-lg font-bold text-green-700">{stat}</div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Simple Workflow */}
                        {(feature as any).simpleWorkflow && (
                          <div>
                            <h4 className="font-bold text-white mb-3 sm:mb-4 text-base sm:text-lg">Simple Workflow:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              {(feature as any).simpleWorkflow.map((item: any, i: number) => (
                                <div key={i} className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-3 sm:p-4 rounded-xl border border-blue-500/20 hover:border-blue-400/40 transition-all">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xl sm:text-2xl">{item.icon}</span>
                                    <div className="text-white font-semibold text-sm sm:text-base">{item.step}</div>
                                  </div>
                                  <div className="text-gray-300 text-xs sm:text-sm">{item.description}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Growth Features */}
                        {(feature as any).growthFeatures && (
                          <div>
                            <h4 className="font-bold text-white mb-4 text-lg">Growth Features:</h4>
                            <div className="space-y-3">
                              {(feature as any).growthFeatures.map((growthFeature: any, i: number) => (
                                <div key={i} className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-4 rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-all">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xl">{growthFeature.icon}</span>
                                    <div className="text-white font-semibold">{growthFeature.name}</div>
                                  </div>
                                  <div className="text-gray-300 text-sm">{growthFeature.description}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {(feature as any).timeComparison && (
                          <div>
                            <h4 className="font-semibold text-heading mb-3">Time Comparison:</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                                <span className="text-red-700">Manual Process:</span>
                                <span className="font-bold text-red-800">{(feature as any).timeComparison.manual}</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                                <span className="text-green-700">ContentCraft:</span>
                                <span className="font-bold text-green-800">{(feature as any).timeComparison.contentcraft}</span>
                              </div>
                              <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                                <span className="text-blue-700 font-semibold">Result: {(feature as any).timeComparison.savings}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Examples */}
                      <div className="space-y-6">
                        {(feature as any).example && (
                          <div>
                            <h4 className="font-semibold text-heading mb-3">Example Transformation:</h4>
                            <div className="space-y-4">
                              <div className="p-4 bg-gray-50 rounded-lg border">
                                <div className="text-sm font-medium text-gray-600 mb-2">Input:</div>
                                <div className="text-gray-800">{(feature as any).example.input}</div>
                              </div>
                              <div className="text-center">
                                <ArrowRight className="h-6 w-6 mx-auto text-purple-600" />
                              </div>
                              <div className="space-y-3">
                                {Object.entries((feature as any).example.outputs).map(([platform, output]) => (
                                  <div key={platform} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="text-sm font-medium text-blue-600 mb-1 capitalize">{platform}:</div>
                                    <div className="text-blue-800">{String(output)}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {(feature as any).examples && (
                          <div>
                            <h4 className="font-semibold text-heading mb-3">Content Examples:</h4>
                            <div className="space-y-2">
                              {(feature as any).examples.map((example: string, i: number) => (
                                <div key={i} className="p-3 bg-surface/30 rounded-lg border text-sm text-foreground">
                                  {example}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {(feature as any).format && (
                          <div>
                            <h4 className="font-semibold text-heading mb-3">Format Structure:</h4>
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                              <div className="text-purple-800">{(feature as any).format}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
