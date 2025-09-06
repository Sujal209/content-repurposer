'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Book,
  Video,
  MessageCircle,
  Zap,
  Settings,
  CreditCard,
  Shield,
  ExternalLink,
  ArrowRight,
  PlayCircle,
  FileText,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Footer from '@/components/footer'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I get started with repuposemate?',
    answer: 'Getting started is easy! Sign up for a free account, paste your long-form content into the dashboard, select your desired output formats (Twitter Threads, LinkedIn Carousels, Instagram Reels), and click Transform. Our AI will generate engaging social media posts optimized for each platform.',
    category: 'Getting Started'
  },
  {
    id: '2',
    question: 'What types of content work best with repuposemate?',
    answer: 'repuposemate works excellently with blog posts, articles, newsletters, case studies, tutorials, and any long-form written content. The ideal length is between 500-10,000 characters for best transformation results.',
    category: 'Getting Started'
  },
  {
    id: '3',
    question: 'How many credits do I get with each plan?',
    answer: 'Free plan: 3 credits per day. Pro plan: 200 credits per day. Enterprise plan: 2000+ credits per day with custom limits available. Each transformation typically uses 1-3 credits depending on the output format.',
    category: 'Billing'
  },
  {
    id: '4',
    question: 'Can I edit the generated content before posting?',
    answer: 'Absolutely! All generated content is fully editable. You can modify the text, adjust the tone, add hashtags, or make any changes before copying to your social media platforms.',
    category: 'Features'
  },
  {
    id: '5',
    question: 'Is there an API available for developers?',
    answer: 'API access is currently available for Enterprise plans. Contact our support team for detailed information about API integration, authentication, and usage limits.',
    category: 'API'
  },
  {
    id: '6',
    question: 'How do I upgrade or downgrade my plan?',
    answer: 'You can change your plan anytime from the Settings page. Upgrades take effect immediately, while downgrades will apply at the end of your current billing cycle.',
    category: 'Billing'
  },
  {
    id: '7',
    question: 'What languages does repuposemate support?',
    answer: 'Currently, repuposemate works best with English content. We\'re working on expanding language support and will announce new languages as they become available.',
    category: 'Features'
  },
  {
    id: '8',
    question: 'Can I cancel my subscription at any time?',
    answer: 'Yes, you can cancel your subscription at any time from the Settings page. You\'ll continue to have access to paid features until the end of your current billing period.',
    category: 'Billing'
  },
  {
    id: '9',
    question: 'How secure is my content data?',
    answer: 'We take security seriously. All content is encrypted in transit and at rest. We don\'t store your transformed content permanently, and we never use your data to train AI models. See our Privacy Policy for full details.',
    category: 'Security'
  },
  {
    id: '10',
    question: 'What if I\'m not satisfied with the generated content?',
    answer: 'If you\'re not happy with a transformation, you can regenerate it using your available credits. You can also adjust your content preferences and try different settings to get better results.',
    category: 'Support'
  }
]

const tutorials = [
  {
    title: 'Quick Start Guide',
    description: 'Get up and running with repuposemate in under 5 minutes',
    duration: '3 min read',
    icon: Zap,
    link: '#'
  },
  {
    title: 'Optimizing Your Content',
    description: 'Learn best practices for input content to get better results',
    duration: '5 min read',
    icon: Book,
    link: '#'
  },
  {
    title: 'Video Tutorial: First Transformation',
    description: 'Watch how to create your first social media posts',
    duration: '4 min watch',
    icon: Video,
    link: '#'
  }
]

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(faqData.map(item => item.category)))]
  
  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Animated background */}
      <div className="data-lines" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface/5 to-background" />
      
      {/* Header */}
      <header className="border-b border-border bg-card-bg/80 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">repuposemate</h1>
            </Link>
            
            <Button variant="outline" onClick={() => window.location.href = '/contact'}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold gradient-text mb-4">
              How can we help you?
            </h1>
            <p className="text-xl text-muted mb-8">
              Find answers to common questions and learn how to get the most out of repuposemate
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted" />
              <Input
                placeholder="Search for help..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/contact'}>
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Contact Support</CardTitle>
                <CardDescription>
                  Get personalized help from our team
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/community'}>
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Community</CardTitle>
                <CardDescription>
                  Connect with other repuposemate users
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Tutorials Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-heading">Getting Started Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tutorials.map((tutorial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <tutorial.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                          <p className="text-sm text-muted">{tutorial.duration}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => window.location.href = tutorial.link}>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      {tutorial.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-heading">Frequently Asked Questions</h2>
              
              {/* Category Filter */}
              <div className="flex gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="border border-border">
                  <CardHeader
                    className="cursor-pointer hover:bg-surface/50 transition-colors"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                        <p className="text-sm text-muted mt-1">{faq.category}</p>
                      </div>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-muted" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted" />
                      )}
                    </div>
                  </CardHeader>
                  
                  {expandedFAQ === faq.id && (
                    <CardContent className="pt-0">
                      <p className="text-muted leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted">No FAQ items found matching your search.</p>
              </div>
            )}
          </motion.div>

          {/* Still Need Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-primary/20">
              <CardContent className="py-12 text-center">
                <h3 className="text-2xl font-bold mb-4 text-heading">Still need help?</h3>
                <p className="text-muted mb-6 max-w-md mx-auto">
                  Can't find what you're looking for? Our support team is here to help you succeed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => window.location.href = '/contact'}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => window.location.href = '/community'}>
                    <Users className="h-4 w-4 mr-2" />
                    Join Community
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
