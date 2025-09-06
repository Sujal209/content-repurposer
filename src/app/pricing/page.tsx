'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Check, 
  X, 
  Sparkles, 
  CreditCard, 
  Crown, 
  Building2,
  ArrowRight,
  Calculator,
  Zap,
  Users,
  Shield,
  HeadphonesIcon,
  LogOut,
  User,
  Mail
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProductionAuth } from '@/lib/auth-context-production'
import Footer from '@/components/footer'

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'month',
    description: 'Perfect for trying out RepurposeMate',
    icon: Sparkles,
    color: 'from-gray-500 to-gray-600',
    buttonText: 'Get Started Free',
    buttonVariant: 'outline' as const,
    popular: true,
    features: [
      { name: '3 daily credits', included: true },
      { name: 'All 3 content formats', included: true },
      { name: 'Content analysis & tips', included: true },
      { name: 'Content library', included: true },
      { name: 'Export & share options', included: true },
      { name: 'Email support', included: true },
      { name: 'API access', included: false },
      { name: 'Team collaboration', included: false },
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    period: 'month',
    description: 'Best for content creators and marketers',
    icon: Crown,
    color: 'from-blue-500 to-purple-600',
    buttonText: 'Coming Soon',
    buttonVariant: 'gradient' as const,
    popular: false,
    features: [
      { name: '200 daily credits', included: true },
      { name: 'All content formats', included: true },
      { name: 'Priority support', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Bulk operations', included: true },
      { name: 'Custom preferences', included: true },
      { name: 'API access', included: false },
      { name: 'Team collaboration', included: false },
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    period: 'month',
    description: 'For teams and agencies',
    icon: Building2,
    color: 'from-purple-500 to-pink-600',
    buttonText: 'Coming Soon',
    buttonVariant: 'outline' as const,
    popular: false,
    features: [
      { name: '2000+ daily credits', included: true },
      { name: 'All content formats', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Bulk operations', included: true },
      { name: 'Custom branding', included: true },
      { name: 'API access', included: true },
      { name: 'Team collaboration', included: true },
    ]
  }
]

export default function PricingPage() {
  const { user, signOut } = useProductionAuth()
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly')
  const [calculatorCredits, setCalculatorCredits] = useState(1000)

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const getAdjustedPrice = (basePrice: number) => {
    if (billingCycle === 'annually') {
      return Math.round(basePrice * 12 * 0.8) // 20% discount for annual
    }
    return basePrice
  }

  const calculateRecommendedPlan = (credits: number) => {
    if (credits <= 100) return 'free'
    if (credits <= 5000) return 'pro'
    return 'enterprise'
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Animated background elements */}
      <div className="data-lines" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface/5 to-background" />
      
      {/* Header */}
      <header className="border-b border-border bg-card-bg/80 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/repurposemate-logo.png" 
                alt="RepurposeMate logo" 
                className="w-8 h-8 object-contain drop-shadow-lg"
              />
              <h1 className="text-xl font-bold gradient-text">RepurposeMate</h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/dashboard')}
                    className="text-muted hover:text-foreground"
                  >
                    Dashboard
                  </Button>
                  <div className="hidden sm:flex items-center gap-2 text-sm text-muted">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">{user?.email}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => router.push('/auth')}>
                    Sign In
                  </Button>
                  <Button onClick={() => router.push('/auth')}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              Choose the perfect plan for your content creation needs. 
              Start free and scale as you grow.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-4 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annually')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'annually'
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Annual
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="relative mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                <Card className={`relative h-full ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                  <CardHeader className="text-center pb-8">
                    <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
                      <plan.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                    <div className="mt-6">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-foreground">
                          ${billingCycle === 'annually' ? getAdjustedPrice(plan.price) : plan.price}
                        </span>
                        <span className="text-muted">
                          /{billingCycle === 'annually' ? 'year' : 'month'}
                        </span>
                      </div>
                      {billingCycle === 'annually' && plan.price > 0 && (
                        <p className="text-xs text-muted mt-1">
                          ${plan.price}/month billed annually
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      variant={plan.buttonVariant}
                      className="w-full mb-6"
                      onClick={() => {
                        if (plan.id === 'free') {
                          router.push('/auth')
                        } else {
                          // Coming soon for paid plans
                          router.push('/contact')
                        }
                      }}
                    >
                      {plan.buttonText}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-gray-300 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted'}`}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
              ))}
            </div>

            {/* Coming Soon overlay covering the pricing cards */}
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-gradient-to-br from-[#1a0b2e]/85 via-[#2c1250]/85 to-[#1a0b2e]/85 backdrop-blur-[2px]">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center px-8 py-32 max-w-2xl min-h-[800px] flex flex-col justify-center"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-[#7C3AED] rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Coming Soon
                </h2>
                <p className="text-lg text-white/90 mb-8">
                  We're working on something special! Paid plans and advanced features will be available soon.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                  <Button
                    onClick={() => router.push('/contact')}
                    className="min-w-[200px] bg-gradient-to-r from-[#4776E6] via-[#8E54E9] to-[#FF6AD5] hover:opacity-90 transition-opacity"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Request Early Access
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => user ? router.push('/dashboard') : router.push('/auth')}
                    className="min-w-[200px] border-white/10 hover:bg-white/5 text-white"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Try Free Plan
                  </Button>
                </div>
                <p className="text-sm text-white/60">
                  Get notified when we launch • No credit card required
                </p>
              </motion.div>
            </div>
          </div>

      

          {/* Feature Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Feature Comparison</CardTitle>
                <CardDescription>
                  Compare all features across our plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Features</th>
                        <th className="text-center py-3 px-4 font-medium">Free</th>
                        <th className="text-center py-3 px-4 font-medium">Pro</th>
                        <th className="text-center py-3 px-4 font-medium">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { feature: 'Daily Credits', free: '3', pro: '200', enterprise: '2000+' },
                        { feature: 'Content Formats', free: 'All 3', pro: 'All 3', enterprise: 'All 3' },
                        { feature: 'Content Analysis', free: '✓', pro: '✓', enterprise: '✓' },
                        { feature: 'Content Library', free: '✓', pro: '✓', enterprise: '✓' },
                        { feature: 'Export Options', free: '✓', pro: '✓', enterprise: '✓' },
                        { feature: 'API Access', free: '✗', pro: '✗', enterprise: '✓' },
                        { feature: 'Team Collaboration', free: '✗', pro: '✗', enterprise: '✓' },
                        { feature: 'Support Level', free: 'Email', pro: 'Priority', enterprise: 'Dedicated' },
                      ].map((row, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-sm font-medium text-foreground">{row.feature}</td>
                          <td className="py-3 px-4 text-sm text-center text-muted">{row.free}</td>
                          <td className="py-3 px-4 text-sm text-center text-muted">{row.pro}</td>
                          <td className="py-3 px-4 text-sm text-center text-muted">{row.enterprise}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-heading mb-4">Frequently Asked Questions</h2>
              <p className="text-muted">Everything you need to know about our pricing</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "What are credits and how do they work?",
                  answer: "Credits are used each time you transform content. One transformation typically uses 1-3 credits depending on the output format and content length. Free users get 3 credits per day."
                },
                {
                  question: "Can I change plans anytime?",
                  answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll pro-rate any billing differences."
                },
                {
                  question: "When will paid plans be available?",
                  answer: "Paid plans are coming soon! Currently, we offer a free plan with 3 daily credits. Contact us to be notified when Pro and Enterprise plans launch."
                },
                {
                  question: "What happens if I exceed my daily credit limit?",
                  answer: "Free users get 3 credits per day. If you need more, contact us about upcoming paid plans or wait until the next day for your credits to reset."
                },
                {
                  question: "Do you offer discounts for annual billing?",
                  answer: "Yes! When paid plans launch, we'll offer 20% savings for annual billing. That's like getting 2.4 months free every year."
                },
                {
                  question: "Can I cancel my subscription anytime?",
                  answer: "Absolutely. When paid plans launch, you can cancel your subscription at any time from your account settings. Your plan remains active until the end of your billing period."
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-primary/20">
              <CardContent className="py-12">
                <h2 className="text-3xl font-bold gradient-text mb-4">
                  Ready to Transform Your Content?
                </h2>
                <p className="text-muted mb-8 max-w-md mx-auto">
                  Join content creators who are transforming their social media strategy with RepurposeMate
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => router.push('/auth')}>
                    Start Free Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => router.push('/contact')}>
                    Contact Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
