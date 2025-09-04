'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Target, Users, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Footer from '@/components/footer'

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Transformation",
    description: "Advanced AI that understands context and tone to create engaging content for each platform."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Transform your content in seconds, not hours. Get 10+ social posts from one blog article."
  },
  {
    icon: Target,
    title: "Platform-Optimized",
    description: "Content tailored for Twitter threads, LinkedIn carousels, Instagram stories, and more."
  },
  {
    icon: Users,
    title: "Built for Creators",
    description: "Designed specifically for indie makers, solopreneurs, and content creators who need to scale."
  }
]

const benefits = [
  "Turn 1 blog post into 10+ social media posts",
  "Save 5+ hours per week on content creation",
  "Maintain your unique voice across platforms",
  "Increase engagement with platform-specific formats",
  "Scale your content without hiring a team"
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="data-lines" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface/10 to-background" />
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold gradient-text"
        >
          ContentCraft
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
        
          <Link href="/auth">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link href="/auth">
            <Button variant="gradient" size="lg">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transform Your 
            <span className="gradient-text"> Content </span>
            Into Viral Social Posts
          </h1>
          <p className="text-xl md:text-2xl text-muted mb-8 leading-relaxed">
            AI-powered content repurposing for indie makers and creators. 
            Turn your blog posts, videos, and podcasts into engaging social media content in seconds.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/auth">
              <Button variant="gradient" size="xl" className="animate-pulse-glow">
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-slate-400">No credit card required • 3 free transformations</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-heading">Why Content Creators Love ContentCraft</h2>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Stop spending hours manually adapting your content for different platforms. 
            Let AI do the heavy lifting while you focus on creating.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-surface/30 py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 text-heading">The Content Creation Problem</h2>
              <p className="text-xl text-muted mb-8">
                You create amazing long-form content, but adapting it for social media is time-consuming and expensive. 
                Generic tools don't understand your voice, and hiring help costs thousands.
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
                    <span className="text-lg text-foreground">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="glass p-8 transform-card">
                <CardHeader>
                  <CardTitle className="text-2xl text-center mb-4 text-heading">Transform This:</CardTitle>
                  <div className="bg-gray-100 p-4 rounded-lg mb-4 border border-gray-200">
                    <p className="text-sm text-gray-700 font-medium">"How to Build a SaaS Product in 2024: A Complete Guide..."</p>
                    <p className="text-xs text-gray-600 mt-2">2,500 word blog post</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <ArrowRight className="h-8 w-8 mx-auto text-purple-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-800">10 Twitter Thread</p>
                      <p className="text-xs text-blue-600">Viral-ready hooks + engaging content</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <p className="text-sm font-medium text-purple-800">LinkedIn Carousel</p>
                      <p className="text-xs text-purple-600">Professional slideshow format</p>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                      <p className="text-sm font-medium text-pink-800">Instagram Story Script</p>
                      <p className="text-xs text-pink-600">Visual storytelling format</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-white"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Scale Your Content?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of indie makers who've transformed their content strategy with AI.
              Start your free trial today.
            </p>
            <Link href="/auth">
              <Button variant="secondary" size="xl" className="bg-white text-purple-700 hover:bg-gray-100">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm mt-4 opacity-75">3 free transformations • No credit card required</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
