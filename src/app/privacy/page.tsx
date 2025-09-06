'use client'

import { motion } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  Eye, 
  Database,
  Users,
  Globe,
  Mail,
  FileText,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Footer from '@/components/footer'

const sections = [
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    icon: Database,
    content: [
      {
        subtitle: 'Account Information',
        details: 'When you create an account, we collect your email address, name, and billing information for paid plans.'
      },
      {
        subtitle: 'Content Data',
        details: 'We process your blog posts, articles, and long-form content to generate social media transformations. Input content is processed in memory only and immediately deleted after transformation.'
      },
      {
        subtitle: 'Usage Data',
        details: 'We track transformation counts, content types processed, and feature usage to monitor your daily limits and improve our AI algorithms.'
      },
      {
        subtitle: 'Technical Data',
        details: 'We automatically collect IP addresses, browser information, device data, and cookies for security and functionality purposes.'
      }
    ]
  },
  {
    id: 'how-we-use-information',
    title: 'How We Use Your Information',
    icon: Eye,
    content: [
      {
        subtitle: 'AI Content Transformation',
        details: 'To transform your long-form content into Twitter threads, LinkedIn carousels, and Instagram Reels using our AI engine.'
      },
      {
        subtitle: 'Communication',
        details: 'To send you service updates, security alerts, and respond to your inquiries.'
      },
      {
        subtitle: 'Security',
        details: 'To protect our service from fraud, abuse, and security threats.'
      },
      {
        subtitle: 'Analytics',
        details: 'To understand usage patterns and improve our algorithms and user experience.'
      }
    ]
  },
  {
    id: 'data-sharing',
    title: 'Data Sharing and Disclosure',
    icon: Users,
    content: [
      {
        subtitle: 'Third-Party Services',
        details: 'We use trusted service providers for payment processing (Stripe), analytics (limited), and infrastructure (cloud hosting).'
      },
      {
        subtitle: 'Legal Requirements',
        details: 'We may disclose information when required by law, legal process, or to protect our rights and safety.'
      },
      {
        subtitle: 'Business Transfers',
        details: 'In the event of a merger or acquisition, your information may be transferred as part of the business assets.'
      },
      {
        subtitle: 'Zero Content Training',
        details: 'Your content is never used to train our AI models, stored in databases, or shared with OpenAI or any third parties. We maintain strict data isolation.'
      }
    ]
  },
  {
    id: 'data-security',
    title: 'Data Security',
    icon: Lock,
    content: [
      {
        subtitle: 'Encryption',
        details: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.'
      },
      {
        subtitle: 'Access Controls',
        details: 'Strict access controls limit employee access to user data on a need-to-know basis.'
      },
      {
        subtitle: 'Regular Audits',
        details: 'We conduct regular security audits and penetration testing to ensure data protection.'
      },
      {
        subtitle: 'Data Retention',
        details: 'Content is processed in memory and deleted immediately. Account data is retained while your account is active.'
      }
    ]
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    icon: Shield,
    content: [
      {
        subtitle: 'Access',
        details: 'You can request a copy of the personal data we hold about you.'
      },
      {
        subtitle: 'Correction',
        details: 'You can update or correct your account information at any time in your settings.'
      },
      {
        subtitle: 'Deletion',
        details: 'You can request deletion of your account and associated data. Some data may be retained for legal compliance.'
      },
      {
        subtitle: 'Data Portability',
        details: 'You can export your data in a machine-readable format.'
      }
    ]
  },
  {
    id: 'international-transfers',
    title: 'International Data Transfers',
    icon: Globe,
    content: [
      {
        subtitle: 'Global Infrastructure',
        details: 'Our services use cloud infrastructure that may process data in multiple countries to ensure optimal performance.'
      },
      {
        subtitle: 'Adequate Protection',
        details: 'We ensure all international transfers comply with applicable data protection laws and use appropriate safeguards.'
      },
      {
        subtitle: 'EU-US Framework',
        details: 'For EU users, we comply with applicable frameworks for lawful data transfers to the United States.'
      }
    ]
  }
]

export default function PrivacyPolicyPage() {
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
                <Shield className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">repuposemate</h1>
            </Link>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => window.location.href = '/terms'}>
                <FileText className="h-4 w-4 mr-2" />
                Terms of Service
              </Button>
              <Button onClick={() => window.location.href = '/contact'}>
                <Mail className="h-4 w-4 mr-2" />
                Contact Us
              </Button>
            </div>
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
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold gradient-text mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-muted max-w-2xl mx-auto mb-6">
                Your privacy is our priority. This policy explains how repuposemate collects, uses, and protects your data when transforming content with AI.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted">
                <span>Last updated: January 28, 2025</span>
                <span>•</span>
                <span>Effective: January 28, 2025</span>
              </div>
            </div>

            {/* Quick Summary */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">Privacy Summary</h3>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• We only collect data necessary for AI content transformation</li>
                      <li>• Your input content is processed temporarily and never stored</li>
                      <li>• We never use your content to train AI models or share with third parties</li>
                      <li>• Generated content belongs to you completely</li>
                      <li>• You control your data and can delete everything anytime</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Table of Contents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle>Table of Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sections.map((section, index) => (
                    <Link
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <section.icon className="h-4 w-4 text-primary" />
                      <span className="font-medium">{section.title}</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Policy Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 2) }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <section.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {section.content.map((item, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold mb-2">{item.subtitle}</h4>
                        <p className="text-muted leading-relaxed">{item.details}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact for Privacy Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-primary/20">
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold gradient-text mb-4">
                  Questions About Privacy?
                </h2>
                <p className="text-muted mb-8 max-w-md mx-auto">
                  If you have any questions about this Privacy Policy or how we handle your data, 
                  we're here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => window.location.href = '/contact'}>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Privacy Team
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => window.location.href = '/help'}>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help Center
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
