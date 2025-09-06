'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  Scale, 
  AlertTriangle,
  Shield,
  CreditCard,
  Users,
  Gavel,
  Mail,
  ExternalLink,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Footer from '@/components/footer'

export default function TermsOfServicePage() {
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
                <Scale className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">repuposemate</h1>
            </Link>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => window.location.href = '/privacy'}>
                <Shield className="h-4 w-4 mr-2" />
                Privacy Policy
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
            className="mb-12 text-center"
          >
            <h1 className="text-4xl font-bold gradient-text mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto mb-6">
              These terms govern your use of repuposemate's AI-powered content transformation service. Please read carefully before transforming your content.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted">
              <span>Last updated: January 28, 2025</span>
              <span>•</span>
              <span>Effective: January 28, 2025</span>
            </div>
          </motion.div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {/* Acceptance */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <CardTitle>1. Acceptance of Terms</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-muted">
                <p>By accessing or using repuposemate, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not use our service.</p>
                <p>We may update these terms from time to time. We'll notify you of any material changes via email or through our service. Your continued use constitutes acceptance of the updated terms.</p>
              </CardContent>
            </Card>

            {/* Service Description */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <CardTitle>2. Service Description</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-muted">
                <p>repuposemate transforms your blog posts, articles, and long-form content into engaging social media posts using advanced AI. We support Twitter threads, LinkedIn carousels, and Instagram Reels with platform-specific optimization.</p>
                <p>Our service includes real-time content analysis, readability scoring, engagement metrics, and content preferences customization. Usage limits apply based on your subscription plan.</p>
              </CardContent>
            </Card>

            {/* User Obligations */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-purple-600" />
                  <CardTitle>3. User Obligations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-muted">
                <h4 className="font-semibold text-foreground">You agree to:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate account information and keep it updated</li>
                  <li>Use the service only for lawful purposes</li>
                  <li>Not share your account credentials with others</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not attempt to reverse engineer or hack our service</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
                <h4 className="font-semibold text-foreground mt-6">Prohibited Uses:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Generating harmful, offensive, or illegal content for social media</li>
                  <li>Automated or bulk content generation beyond usage limits</li>
                  <li>Creating content that violates Twitter, LinkedIn, or Instagram policies</li>
                  <li>Transforming copyrighted content without proper rights</li>
                  <li>Using the service to create misleading or deceptive content</li>
                </ul>
              </CardContent>
            </Card>

            {/* Payment Terms */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-yellow-600" />
                  <CardTitle>4. Payment Terms</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-muted">
                <p>Paid subscriptions are billed in advance on a monthly or annual basis. All fees are non-refundable except where required by law or our refund policy.</p>
                <p>We offer a 30-day money-back guarantee for new paid subscriptions. Refund requests must be submitted within 30 days of initial payment.</p>
                <p>We reserve the right to change pricing with 30 days' notice to existing subscribers. Price changes will not affect your current billing cycle.</p>
                <p>Failure to pay may result in account suspension or termination.</p>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-indigo-600" />
                  <CardTitle>5. Intellectual Property</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-muted">
                <p>You retain complete ownership of all content you input into repuposemate. We claim no rights to your original content or generated transformations.</p>
                <p>You grant us a temporary, limited license to process your content solely for AI transformation. Content is processed in memory and immediately deleted after generation.</p>
                <p>repuposemate's AI algorithms, prompt engineering, and transformation technology are proprietary and protected by intellectual property laws.</p>
                <p>All generated social media content belongs to you. You're responsible for ensuring transformed content doesn't infringe third-party rights and complies with platform policies.</p>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                  <CardTitle>6. Limitation of Liability</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-muted">
                <p>repuposemate's AI transformations are provided "as is". We don't guarantee specific content quality, engagement rates, or transformation accuracy.</p>
                <p>We're not liable for how social media platforms respond to your generated content or any engagement outcomes.</p>
                <p>Our total liability is limited to the subscription fees you paid in the 12 months before any claim.</p>
                <p>You're solely responsible for reviewing, editing, and using generated content appropriately on social media platforms.</p>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <XCircle className="h-6 w-6 text-red-600" />
                  <CardTitle>7. Termination</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-muted">
                <p>You may terminate your account at any time through your account settings or by contacting us.</p>
                <p>We may suspend or terminate your account if you violate these terms, engage in harmful activities, or for other legitimate business reasons.</p>
                <p>Upon termination, your access will cease immediately. We may retain some data as required by law or for legitimate business purposes.</p>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Gavel className="h-6 w-6 text-gray-600" />
                  <CardTitle>8. Governing Law</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-muted">
                <p>These terms are governed by the laws of Delaware, United States, without regard to conflict of law principles.</p>
                <p>Any disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.</p>
                <p>If any provision of these terms is found unenforceable, the remainder shall continue in full force.</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-primary/20">
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold gradient-text mb-4">
                  Questions About These Terms?
                </h2>
                <p className="text-muted mb-8 max-w-md mx-auto">
                  If you have any questions about these Terms of Service, please don't hesitate to contact us.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => window.location.href = '/contact'}>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Legal Team
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => window.location.href = '/privacy'}>
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy Policy
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
