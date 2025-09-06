'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Copy, 
  Sparkles,
  Play,
  RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const sampleContent = `How to Build a SaaS Product in 2024: A Complete Guide

Building a successful SaaS product requires careful planning, market research, and execution. Here are the key steps:

1. Market Research & Validation
Before writing a single line of code, validate your idea with potential customers. Survey your target market and understand their pain points.

2. MVP Development
Focus on core features that solve the primary problem. Don't overcomplicate your first version.

3. Customer Acquisition
Develop a clear go-to-market strategy. Content marketing, SEO, and social media are crucial for early-stage SaaS companies.

The key is to start small, validate early, and iterate based on real user feedback.`

const transformedContent = {
  twitter: {
    icon: Twitter,
    color: 'bg-blue-500',
    title: 'Twitter Thread',
    content: `🧵 Building a SaaS in 2024? Here's your step-by-step guide (thread)

1/ Market research first ✋

Before you write ANY code, talk to your potential customers. 

I see too many founders skip this step and build products nobody wants.

2/ Focus on validation 🎯

Survey your target market. Understand their real pain points.

Your assumptions ≠ reality

3/ Build an MVP, not a masterpiece 🛠️

Core features only. Solve ONE problem really well.

Complexity kills early-stage products.

4/ Go-to-market is everything 📈

Content marketing
SEO 
Social media

Pick 1-2 channels and dominate them.

5/ The real secret? 🤫

Start small → Validate → Iterate

User feedback > Your opinion

What's your biggest SaaS challenge? Drop it below 👇`
  },
  linkedin: {
    icon: Linkedin,
    color: 'bg-blue-600',
    title: 'LinkedIn Carousel',
    content: `🚀 The Complete SaaS Building Guide for 2024

Slide 1: The Foundation
Market research isn't optional—it's essential. 67% of failed startups never validated their idea with real customers first.

Slide 2: Validation Framework
→ Customer interviews (50+ people)
→ Landing page tests
→ Pre-order campaigns
→ MVP waitlists

Slide 3: MVP Development
Focus beats feature-creep every time:
✅ One core problem
✅ Simple solution  
✅ Fast iteration cycles

Slide 4: Go-to-Market Strategy
The best product without distribution = failure
• Content marketing: 3x cheaper than paid ads
• SEO: 53% of website traffic comes from organic search
• Social media: Build in public for authenticity

Slide 5: Success Metrics
Track what matters:
📊 Customer Acquisition Cost (CAC)
📊 Monthly Recurring Revenue (MRR)
📊 Customer Lifetime Value (LTV)

Start small. Validate early. Iterate fast.

What's your SaaS building experience? Share below! 👇`
  },
  instagram: {
    icon: Instagram,
    color: 'bg-purple-500',
    title: 'Instagram Story Script',
    content: `Story 1: Hook
"I built 3 failed SaaS products before learning this..."
[Show laptop with failed projects]

Story 2: Problem Setup  
"Most founders start with code instead of customers"
[Red X over coding icon, green check over customer icon]

Story 3: Solution Reveal
"Here's the real process:"
1. Research first 🔍
2. Validate ideas 💡  
3. Build MVP 🛠️
4. Get customers 📈

Story 4: Market Research
"Talk to 50+ potential customers BEFORE building anything"
[Show conversation bubbles]

Story 5: MVP Focus
"Your first version should solve ONE problem perfectly"
[Show simple vs complex interface comparison]

Story 6: Customer Acquisition
"Content + SEO = 70% of my customer growth"
[Show growth chart]

Story 7: Call to Action
"Building your own SaaS? DM me 'GUIDE' for my free checklist"
[Swipe up animation]

Story 8: Social Proof
"This strategy helped 500+ founders launch successfully"
[Show testimonial screenshots]`
  }
} as const

export default function InteractiveDemo() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<'twitter' | 'linkedin' | 'instagram'>('twitter')
  const [showResults, setShowResults] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsGenerating(false)
    setShowResults(true)
    setHasGenerated(true)
  }

  const handleReset = () => {
    setShowResults(false)
    setHasGenerated(false)
    setIsGenerating(false)
  }

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = content
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const currentPlatform = transformedContent[selectedPlatform]

  return (
    <div className="max-w-6xl mx-auto px-4 overflow-x-hidden">
      <div className="text-center mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white px-4 sm:px-0">Try It Yourself</h3>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            See how repuposemate transforms a blog post into platform-specific social content. 
            <span className="font-semibold text-white block sm:inline mt-1 sm:mt-0">No signup required!</span>
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start mb-8 sm:mb-12">
        {/* Input Section */}
        <div className="p-2 sm:p-[10px]">
          <Card className="h-full border-2 border-border/50 shadow-xl">
            <CardHeader className="pb-4 px-4 sm:px-6">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm font-bold">1</span>
                </div>
                <span className="text-white">Original Blog Post</span>
              </CardTitle>
              <CardDescription className="text-gray-300 text-sm sm:text-base">
                This is what a typical blog post looks like
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 px-4 sm:px-6">
              <div className="p-3 sm:p-6 rounded-xl border border-gray-200 max-h-60 sm:max-h-80 overflow-y-auto shadow-inner">
                <pre className="whitespace-pre-wrap text-xs sm:text-sm text-white leading-relaxed font-medium">
                  {sampleContent}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div className="p-2 sm:p-[10px]">
          <Card className="h-full border-2 border-border/50 shadow-xl">
            <CardHeader className="pb-4 px-4 sm:px-6">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm font-bold">2</span>
                </div>
                <span className="text-white">Platform-Optimized Content</span>
              </CardTitle>
              <CardDescription className="text-gray-300 text-sm sm:text-base">
                Choose a platform to see the transformation
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 px-4 sm:px-6">
              {/* Platform Selection */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                {Object.entries(transformedContent).map(([platform, data]) => (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatform(platform as any)}
                    className={`flex items-center justify-center sm:justify-start gap-3 px-3 sm:px-4 py-3 rounded-xl border-2 transition-all font-medium min-h-[48px] w-full sm:w-auto flex-1 sm:flex-none ${
                      selectedPlatform === platform
                        ? 'border-primary bg-primary/20 text-white shadow-lg shadow-primary/25'
                        : 'border-border hover:border-primary/50 text-gray-300 hover:text-white hover:bg-surface/30'
                    }`}
                  >
                    <data.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="text-sm font-semibold">{data.title}</span>
                  </button>
                ))}
              </div>

              {/* Generate Button or Loading State */}
              {!showResults && (
                <div className="text-center mb-6">
                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    variant="gradient"
                    size="lg"
                    className="w-full sm:w-auto px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold shadow-xl"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        <span>AI is working...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-3 h-5 w-5" />
                        <span>Transform with AI</span>
                        <ArrowRight className="ml-3 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Enhanced Loading Animation */}
              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-12"
                  >
                    <div className="relative mb-6">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                        <Sparkles className="h-10 w-10 text-white animate-pulse" />
                      </div>
                      <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full border-4 border-transparent border-t-blue-400 animate-spin"></div>
                      <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full border-4 border-transparent border-b-purple-400 animate-spin animate-reverse" style={{animationDelay: '0.5s'}}></div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="text-white font-semibold text-lg mb-2">AI is analyzing your content...</p>
                      <p className="text-gray-300 text-sm mb-4">Creating platform-optimized posts</p>
                      <div className="flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Placeholder when no results */}
              {!showResults && !isGenerating && (
                <div className="bg-surface/20 p-8 rounded-xl border-2 border-dashed border-border/50 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center">
                    <currentPlatform.icon className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-gray-300 font-medium mb-2">{currentPlatform.title} Preview</p>
                  <p className="text-gray-400 text-sm">Click "Transform with AI" to see the magic happen</p>
                </div>
              )}

              {/* Enhanced Results */}
              <AnimatePresence>
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="bg-surface/30 p-6 rounded-xl border border-border/50 shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${currentPlatform.color} flex items-center justify-center shadow-lg`}>
                            <currentPlatform.icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white text-lg">{currentPlatform.title}</h4>
                            <p className="text-gray-300 text-sm">Generated in 2.3 seconds</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => copyToClipboard(currentPlatform.content)}
                          variant={copySuccess ? "default" : "outline"}
                          size="sm"
                          className={`text-xs font-medium transition-all duration-200 ${
                            copySuccess ? 'bg-green-500 text-white border-green-500' : ''
                          }`}
                        >
                          {copySuccess ? (
                            <>
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="h-3 w-3 mr-1"
                              >
                                ✓
                              </motion.div>
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" />
                              Copy All
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="bg-gray-900/50 p-3 sm:p-4 rounded-lg max-h-60 sm:max-h-80 overflow-y-auto border border-gray-700">
                        <pre className="whitespace-pre-wrap text-xs sm:text-sm text-gray-200 leading-relaxed font-mono">
                          {currentPlatform.content}
                        </pre>
                      </div>
                      
                      {/* Success indicator */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 bg-green-500/20 border border-green-500/30 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 text-green-400">
                          <Sparkles className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            ✨ Perfect! Content optimized for {currentPlatform.title.toLowerCase()}
                          </span>
                        </div>
                      </motion.div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <Button
                          onClick={handleReset}
                          variant="outline"
                          className="flex-1"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Try Different Platform
                        </Button>
                        <Button
                          variant="gradient"
                          className="flex-1"
                          asChild
                        >
                          <a href="/auth">
                            <Play className="mr-2 h-4 w-4" />
                            Get Full Access
                          </a>
                        </Button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced CTA after demo */}
      {hasGenerated && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-8 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <h4 className="text-3xl font-bold mb-4 text-white">
                🎉 Pretty impressive, right?
              </h4>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                This is just one example. Create unlimited transformations with your own content, 
                <span className="font-semibold text-white"> plus get access to 15+ more platforms.</span>
              </p>
              
              {/* Feature highlights */}
              <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="text-2xl mb-2">⚡</div>
                  <p className="text-sm text-gray-300">Transform any content in 30 seconds</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="text-sm text-gray-300">15+ platform-specific formats</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="text-2xl mb-2">💎</div>
                  <p className="text-sm text-gray-300">Maintains your unique voice</p>
                </div>
              </div>
              
              <Button variant="gradient" size="xl" className="px-10 py-5 text-xl font-bold shadow-2xl" asChild>
                <a href="/auth">
                  Start Creating Now - It's Free
                  <ArrowRight className="ml-3 h-6 w-6" />
                </a>
              </Button>
              <p className="text-sm text-gray-400 mt-4">
                ✓ 3 free transformations ✓ No credit card required ✓ Cancel anytime
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
