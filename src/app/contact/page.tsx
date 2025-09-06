'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Send,
  CheckCircle,
  Clock,
  HelpCircle,
  Sparkles,
  ExternalLink,
  AlertCircle,
  Code
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
// Select component temporarily disabled to fix build issues
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Footer from '@/components/footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again or contact us directly at repurposemate@zohomail.in')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
        <div className="data-lines" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-surface/5 to-background" />
        
        <header className="border-b border-border bg-card-bg/80 backdrop-blur-xl relative z-10">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/repurposemate-logo.png" 
                alt="ContentCraft logo" 
                className="w-8 h-8 object-contain drop-shadow-lg"
              />
              <h1 className="text-xl font-bold gradient-text">ContentCraft</h1>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 py-16 flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-heading">Message Sent Successfully!</h1>
            <p className="text-muted mb-8">
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.location.href = '/'}>
                Back to Home
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/help'}>
                <HelpCircle className="h-4 w-4 mr-2" />
                Visit Help Center
              </Button>
            </div>
          </motion.div>
        </div>
        
        <Footer />
      </div>
    )
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
              <img 
                src="/repurposemate-logo.png" 
                alt="ContentCraft logo" 
                className="w-8 h-8 object-contain drop-shadow-lg"
              />
              <h1 className="text-xl font-bold gradient-text">ContentCraft</h1>
            </Link>
            
            <Button variant="outline" onClick={() => window.location.href = '/help'}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Help Center
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
              Get in Touch
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              Have a question, suggestion, or need help? We're here to support you. 
              Send us a message and we'll respond within 24 hours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name *</label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <select 
                        required 
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-surface/50 backdrop-blur-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-0 focus:border-primary focus:shadow-[0_0_15px_rgba(0,212,255,0.3)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:border-primary/50"
                      >
                        <option value="">Select a category</option>
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Support</option>
                        <option value="billing">Billing & Plans</option>
                        <option value="api">API Support</option>
                        <option value="feature">Feature Request</option>
                        <option value="bug">Bug Report</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Subject *</label>
                      <Input
                        required
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Message *</label>
                      <Textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Please provide as much detail as possible so we can help you effectively..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info & Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted">repurposemate@zohomail.in</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Response Time</p>
                      <p className="text-sm text-muted">Within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Support</p>
                      <p className="text-sm text-muted">Email support for all users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/help" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-4 w-4 text-primary" />
                      <span className="font-medium">Help Center</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted" />
                  </Link>
                  
                </CardContent>
              </Card>

              {/* Emergency Notice */}
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-800 mb-1">Security Issues</h4>
                      <p className="text-sm text-orange-700">
                        For security vulnerabilities, please email repurposemate@zohomail.in immediately.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* FAQ Quick Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Before you contact us...</CardTitle>
                <CardDescription>
                  Check out these common questions that might have your answer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium mb-2 text-heading">How do I reset my password?</h4>
                    <p className="text-sm text-muted mb-3">Click "Forgot Password" on the login page and follow the email instructions.</p>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/auth'}>
                      Go to Login
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium mb-2 text-heading">How do I upgrade my plan?</h4>
                    <p className="text-sm text-muted mb-3">Visit the Pricing page or go to Settings to change your subscription.</p>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/pricing'}>
                      View Pricing
                    </Button>
                  </div>
                  
                  
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium mb-2 text-heading">Billing questions?</h4>
                    <p className="text-sm text-muted mb-3">Find information about plans, billing cycles, and refunds in our help center.</p>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/help'}>
                      Help Center
                    </Button>
                  </div>
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
