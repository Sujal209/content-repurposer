'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Target, Users, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Footer from '@/components/footer'
import InteractiveDemo from '@/components/interactive-demo'
import FeaturesTabs from '@/components/features-tabs'
import Testimonials from '@/components/testimonials'
import UsageStats from '@/components/usage-stats'
import SecurityBadges from '@/components/security-badges'
import CreatorShowcase from '@/components/creator-showcase'

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Transformation",
    description: "Advanced AI that understands context and tone to create engaging content for each platform."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Transform your content in seconds, not hours. Get platform-optimized posts from your long-form content."
  },
  {
    icon: Target,
    title: "Platform-Optimized",
    description: "Content tailored for Twitter threads, LinkedIn carousels, and Instagram reels with platform-specific best practices."
  },
  {
    icon: Users,
    title: "Built for Creators",
    description: "Designed specifically for indie makers, solopreneurs, and content creators who need to scale."
  }
]

const benefits = [
  "Transform long-form content into 3 platform-optimized formats",
  "Save hours of manual content creation work",
  "Maintain your unique voice across all platforms",
  "Get real-time content analysis and improvement tips",
  "Access your content library with search and filtering"
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Subtle background gradient - reduced visual noise */}
      <div className="absolute inset-0 bg-gradient-to-br" />
      {/* Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <img 
              src="/repurposemate-logo.png" 
              alt="RepurposeMate logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter brightness-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
            <span className="text-xl sm:text-2xl font-bold gradient-text">RepurposeMate</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 sm:gap-4"
          >
            <Link href="/auth" className={buttonVariants({ variant: 'outline', className: 'hidden sm:inline-flex' })}>
              Sign In
            </Link>
            <Link href="/auth" className={buttonVariants({ variant: 'gradient', size: 'lg', className: 'text-sm sm:text-base px-4 sm:px-6' })}>
              <span className="hidden sm:inline">Get Started Free</span>
              <span className="sm:hidden">Get Started</span>
              <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </motion.div>
        </div>
      </nav>

      <main role="main">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-28 text-center w-full max-w-full">
        {/* Social Proof Strip */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-background flex items-center justify-center text-white text-xs font-bold">S</div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 border-2 border-background flex items-center justify-center text-white text-xs font-bold">M</div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-background flex items-center justify-center text-white text-xs font-bold">A</div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 border-2 border-background flex items-center justify-center text-white text-xs font-bold">D</div>
            </div>
            <span className="text-foreground font-medium">Join 12,000+ creators</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★★★★★</span>
            <span className="text-foreground font-medium">4.9/5 from 2,500+ reviews</span>
          </div>
          <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-500/40">
            ✓ 2.5M+ posts created this month
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight px-2 sm:px-0 break-words">
            <span className="block sm:inline">AI-Powered Content</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 block sm:inline"> Repurposing </span>
            <span className="block sm:inline">That Actually Works</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-100 mb-8 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
            Transform your long-form content into engaging Twitter threads, LinkedIn carousels, and Instagram reels in seconds. 
            <span className="font-bold text-white block sm:inline mt-2 sm:mt-0">Save hours of manual work and maintain your unique voice across platforms</span>.
          </p>
          
          {/* Value Proposition with Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 max-w-3xl mx-auto px-4 sm:px-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4 sm:p-7 border border-blue-500/40 text-center hover:scale-105 transition-transform"
            >
              <div className="text-2xl sm:text-3xl font-bold text-blue-300 mb-2">3</div>
              <div className="text-xs sm:text-sm text-gray-100 font-bold">Platforms Supported</div>
              <div className="text-xs text-gray-100 mt-1">Twitter, LinkedIn, Instagram</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 sm:p-7 border border-green-500/40 text-center hover:scale-105 transition-transform"
            >
              <div className="text-2xl sm:text-3xl font-bold text-green-300 mb-2">30s</div>
              <div className="text-xs sm:text-sm text-gray-100 font-bold">Average Generation Time</div>
              <div className="text-xs text-gray-100 mt-1">From blog post to social content</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-4 sm:p-7 border border-purple-500/40 text-center hover:scale-105 transition-transform"
            >
              <div className="text-2xl sm:text-3xl font-bold text-purple-300 mb-2">3</div>
              <div className="text-xs sm:text-sm text-gray-100 font-bold">Free Daily Credits</div>
              <div className="text-xs text-gray-100 mt-1">Start creating content today</div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center px-4 sm:px-0"
          >
            <Link href="/auth" className={buttonVariants({ variant: 'gradient', size: 'xl', className: 'w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300' })}>
              <span className="sm:hidden">Start Free</span>
              <span className="hidden sm:inline">Start Creating Now - Free</span>
              <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-6 sm:w-6" />
            </Link>
            <Link href="#demo" className={buttonVariants({ variant: 'outline', size: 'xl', className: 'w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg border-2 hover:bg-white/10' })}>
              See Live Demo ↓
            </Link>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-gray-300 mt-8 flex items-center justify-center gap-6"
          >
            <span className="flex items-center gap-1">
              ✓ <span className="font-medium">No credit card required</span>
            </span>
            <span className="flex items-center gap-1">
              ✓ <span className="font-medium">3 free daily credits</span>
            </span>
            <span className="flex items-center gap-1">
              ✓ <span className="font-medium">Cancel anytime</span>
            </span>
          </motion.p>
          
          {/* Enhanced Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-14 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/30 max-w-lg mx-auto"
          >
            <div className="flex items-center gap-1 mb-3 justify-center">
              <span className="text-yellow-300">★★★★★</span>
            </div>
            <p className="text-base text-gray-100 italic mb-4 text-center leading-relaxed font-medium">
              "RepurposeMate transformed how I create social media content. I can now turn one blog post into multiple platform-optimized posts in seconds, saving me hours every week!"
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                SC
              </div>
              <div className="text-center">
                <div className="text-white font-bold">Sarah Chen</div>
                <div className="text-xs text-gray-200 font-medium">Content Creator • @sarahbuilds</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="container mx-auto px-6 py-28 bg-surface/5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <InteractiveDemo />
        </motion.div>
      </section>

      {/* Usage Statistics Section */}
      <UsageStats />

      {/* Enhanced Features Section with Tabs */}
      <section className="container mx-auto px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-heading">Powerful Features for Content Creators</h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Everything you need to transform your content strategy. 
            Explore our features to see how RepurposeMate can revolutionize your workflow.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <FeaturesTabs />
        </motion.div>
      </section>

      {/* Creator Success Stories */}
      <CreatorShowcase />

      {/* Customer Testimonials */}
      <Testimonials />

      {/* Benefits Section */}
      <section className="bg-surface/30 py-28 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 text-white">The Content Creation Problem</h2>
                          <p className="text-xl text-gray-200 mb-8 font-medium">
              You create amazing long-form content, but adapting it for different social media platforms is time-consuming. 
              RepurposeMate understands your voice and transforms your content into platform-optimized posts automatically.
            </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="h-6 w-6 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-lg text-gray-100 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-[10px]"
            >
              <Card className="glass p-8 transform-card">
                <CardHeader>
                  <CardTitle className="text-2xl text-center mb-4 text-white">Transform This:</CardTitle>
                  <div className="bg-surface/50 p-4 rounded-lg mb-4 border border-border/50">
                    <p className="text-sm text-white font-bold">"How to Build a SaaS Product in 2024: A Complete Guide..."</p>
                    <p className="text-xs text-gray-200 mt-2 font-medium">2,500 word blog post</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <ArrowRight className="h-8 w-8 mx-auto text-purple-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/30">
                      <p className="text-sm font-bold text-blue-300">Twitter Thread</p>
                      <p className="text-xs text-blue-300 font-medium">5-15 engaging tweets with viral hooks</p>
                    </div>
                    <div className="bg-purple-500/20 p-3 rounded-lg border border-purple-500/30">
                      <p className="text-sm font-bold text-purple-300">LinkedIn Carousel</p>
                      <p className="text-xs text-purple-300 font-medium">6-8 professional slides with insights</p>
                    </div>
                    <div className="bg-pink-500/20 p-3 rounded-lg border border-pink-500/30">
                      <p className="text-sm font-bold text-pink-300">Instagram Reels Script</p>
                      <p className="text-xs text-pink-300 font-medium">Short-form video script format</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <SecurityBadges />

      {/* Enhanced CTA Section */}
      <section className="bg-background py-28 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br"></div>
        
        <div className="container mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-white"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Ready to 10x Your Content?
            </h2>
            <p className="text-xl md:text-2xl mb-4 opacity-95 leading-relaxed">
              Join content creators who've transformed their social media strategy.
            </p>
            <p className="text-lg mb-10 opacity-90">
              • Save hours of manual work • Maintain your unique voice • Scale content efficiently
            </p>
            
            {/* Urgency Element */}
            <div className="bg-yellow-400/30 border border-yellow-400/50 rounded-lg p-6 mb-8 max-w-md mx-auto">
              <p className="text-yellow-100 font-bold text-lg">
                🚀 Start with 3 free daily credits - no credit card required!
              </p>
            </div>
            
            <Link href="/auth" className={buttonVariants({ variant: 'secondary', size: 'xl', className: 'bg-blue-600 text-white hover:bg-blue-700 px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105' })}>
              Start Creating Now - Free
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 text-sm">
              <span className="flex items-center gap-2 text-white">
                ✓ <span className="font-semibold">3 free daily credits</span>
              </span>
              <span className="flex items-center gap-2 text-white">
                ✓ <span className="font-semibold">No credit card required</span>
              </span>
              <span className="flex items-center gap-2 text-white">
                ✓ <span className="font-semibold">Cancel anytime</span>
              </span>
            </div>
            
            <p className="text-sm mt-6 text-white/80 font-medium">
              Trusted by content creators, marketers, and businesses worldwide
            </p>
          </motion.div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  )
}
