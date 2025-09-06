'use client'

import { motion } from 'framer-motion'
import { 
  Cookie, 
  Settings, 
  Shield,
  BarChart,
  Globe,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Footer from '@/components/footer'

const cookieTypes = [
  {
    name: 'Strictly Necessary',
    purpose: 'Essential for the website to function properly',
    examples: ['User authentication', 'Active sessions', 'Security tokens', 'Content transformation state'],
    canDisable: false,
    duration: 'Session or 1 year',
    icon: Shield,
    color: 'bg-red-100 text-red-700'
  },
  {
    name: 'Functional',
    purpose: 'Remember your preferences and settings',
    examples: ['Content preferences', 'Platform settings (Twitter/LinkedIn/Instagram)', 'Dashboard layout', 'Transformation history'],
    canDisable: true,
    duration: 'Up to 1 year',
    icon: Settings,
    color: 'bg-blue-100 text-blue-700'
  },
  {
    name: 'Analytics',
    purpose: 'Help us understand how you use our service',
    examples: ['Transformation counts', 'Content type preferences', 'Feature usage patterns', 'AI performance metrics'],
    canDisable: true,
    duration: 'Up to 2 years',
    icon: BarChart,
    color: 'bg-green-100 text-green-700'
  },
  {
    name: 'Marketing',
    purpose: 'Used for advertising and marketing purposes',
    examples: ['Content marketing insights', 'User engagement tracking', 'Platform optimization data'],
    canDisable: true,
    duration: 'Up to 1 year',
    icon: Globe,
    color: 'bg-purple-100 text-purple-700'
  }
]

export default function CookiePolicyPage() {
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
                <Cookie className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">ContentCraft</h1>
            </Link>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => window.location.href = '/privacy'}>
                <Shield className="h-4 w-4 mr-2" />
                Privacy Policy
              </Button>
              <Button onClick={() => window.location.href = '/settings'}>
                <Settings className="h-4 w-4 mr-2" />
                Cookie Settings
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
              Cookie Policy
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto mb-6">
              Learn how ContentCraft uses cookies to enhance your AI content transformation experience and remember your preferences.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted">
              <span>Last updated: January 28, 2025</span>
              <span>•</span>
              <span>Effective: January 28, 2025</span>
            </div>
          </motion.div>

          {/* What Are Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Cookie className="h-6 w-6 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">What are Cookies?</h3>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      Cookies are small text files that are stored on your device when you visit a website. 
                      They help us remember your preferences, keep you logged in, and provide a better user experience. 
                      We also use similar technologies like local storage and session storage.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cookie Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-8 text-center">Types of Cookies We Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cookieTypes.map((type, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <type.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{type.name}</CardTitle>
                          <p className="text-sm text-muted">Duration: {type.duration}</p>
                        </div>
                      </div>
                      
                      <Badge className={type.color}>
                        {type.canDisable ? (
                          <div className="flex items-center gap-1">
                            <Settings className="h-3 w-3" />
                            Optional
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Required
                          </div>
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted mb-4">{type.purpose}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Examples:</h4>
                      <ul className="text-sm text-muted space-y-1">
                        {type.examples.map((example, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-primary rounded-full" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Third-Party Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Globe className="h-6 w-6 text-purple-600" />
                  <CardTitle>Third-Party Services</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted">
                  We work with trusted third-party services that may also set cookies. Here are the main services we use:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Supabase (Authentication)</h4>
                    <p className="text-sm text-muted mb-2">Secure user authentication and session management</p>
                    <a href="https://supabase.com/privacy" target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1">
                      View Supabase's Privacy Policy
                      <Globe className="h-3 w-3" />
                    </a>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">OpenRouter (AI Processing)</h4>
                    <p className="text-sm text-muted mb-2">Powers AI content transformations via OpenAI GPT-4</p>
                    <a href="https://openrouter.ai/privacy" target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1">
                      View OpenRouter's Privacy Policy
                      <Globe className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Managing Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-blue-600" />
                  <CardTitle>Managing Your Cookie Preferences</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      ContentCraft Settings
                    </h4>
                    <p className="text-sm text-muted mb-3">
                      You can manage your cookie preferences through our cookie settings page.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/settings'}>
                      <Settings className="h-4 w-4 mr-2" />
                      Cookie Settings
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-600" />
                      Browser Settings
                    </h4>
                    <p className="text-sm text-muted mb-3">
                      Most browsers allow you to control cookies through their settings. Note that disabling cookies may affect functionality.
                    </p>
                    <div className="space-y-1 text-xs text-muted">
                      <p>• Chrome: Settings → Privacy and security → Cookies</p>
                      <p>• Firefox: Settings → Privacy & Security → Cookies</p>
                      <p>• Safari: Preferences → Privacy → Cookies</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Impact of Disabling Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">Impact of Disabling Cookies</h4>
                    <p className="text-orange-700 text-sm mb-3">
                      If you disable cookies, some features of ContentCraft may not work properly:
                    </p>
                    <ul className="text-orange-700 text-sm space-y-1">
                      <li>• You'll need to log in for each session</li>
                      <li>• Content preferences won't be remembered</li>
                      <li>• Platform-specific settings will reset</li>
                      <li>• Transformation history won't be saved</li>
                      <li>• Usage tracking may not work properly</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-primary/20">
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Cookie className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold gradient-text mb-4">
                  Questions About Cookies?
                </h2>
                <p className="text-muted mb-8 max-w-md mx-auto">
                  If you have any questions about our use of cookies or this policy, we're here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => window.location.href = '/contact'}>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Us
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
