'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Trophy,
  Star,
  ExternalLink,
  Twitter,
  Linkedin,
  Github,
  BookOpen,
  Lightbulb,
  Shield,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Footer from '@/components/footer'

const communityStats = [
  { label: 'Active Members', value: '5,000+', icon: Users },
  { label: 'Content Created', value: '50k+', icon: BookOpen },
  { label: 'Success Stories', value: '200+', icon: Trophy },
  { label: 'Community Rating', value: '4.9/5', icon: Star }
]

const communityLinks = [
  {
    title: 'Discord Server',
    description: 'Join our active Discord community for real-time discussions, tips, and support',
    icon: MessageCircle,
    link: 'https://discord.gg/RepurposeMate',
    members: '3,500+ members',
    isActive: true
  },
  {
    title: 'Reddit Community',
    description: 'Share your success stories, ask questions, and get feedback from fellow creators',
    icon: Users,
    link: 'https://reddit.com/r/RepurposeMate',
    members: '1,200+ members',
    isActive: true
  },
  {
    title: 'Twitter Community',
    description: 'Follow us for updates, tips, and engage with other RepurposeMate users',
    icon: Twitter,
    link: 'https://twitter.com/RepurposeMate',
    members: '8,000+ followers',
    isActive: true
  },
  {
    title: 'LinkedIn Group',
    description: 'Professional networking and business-focused content discussion',
    icon: Linkedin,
    link: 'https://linkedin.com/groups/RepurposeMate',
    members: '2,500+ members',
    isActive: true
  }
]

const guidelines = [
  {
    title: 'Be Respectful',
    description: 'Treat all community members with kindness and respect',
    icon: Heart
  },
  {
    title: 'Share Knowledge',
    description: 'Help others by sharing your experiences and insights',
    icon: Lightbulb
  },
  {
    title: 'Stay On Topic',
    description: 'Keep discussions relevant to content creation and marketing',
    icon: BookOpen
  },
  {
    title: 'No Spam',
    description: 'Avoid excessive self-promotion and irrelevant content',
    icon: Shield
  },
  {
    title: 'Be Constructive',
    description: 'Provide helpful feedback and constructive criticism',
    icon: CheckCircle
  },
  {
    title: 'Follow Platform Rules',
    description: 'Respect the specific rules of each community platform',
    icon: Users
  }
]

const featuredContent = [
  {
    type: 'Success Story',
    title: 'How Sarah grew her Twitter from 500 to 10K followers',
    author: 'Sarah Chen',
    engagement: '156 likes • 34 comments',
    link: '#'
  },
  {
    type: 'Tutorial',
    title: 'Advanced RepurposeMate: Customizing output for different audiences',
    author: 'Mike Rodriguez',
    engagement: '89 likes • 22 comments',
    link: '#'
  },
  {
    type: 'Tip',
    title: 'Best practices for LinkedIn carousel posts using RepurposeMate',
    author: 'Emma Thompson',
    engagement: '203 likes • 45 comments',
    link: '#'
  }
]

export default function CommunityPage() {
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
                alt="RepurposeMate logo" 
                className="w-8 h-8 object-contain drop-shadow-lg"
              />
              <h1 className="text-xl font-bold gradient-text">RepurposeMate</h1>
            </Link>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => window.location.href = '/help'}>
                <BookOpen className="h-4 w-4 mr-2" />
                Help Center
              </Button>
              <Button onClick={() => window.open('https://discord.gg/RepurposeMate', '_blank')}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Join Discord
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold gradient-text mb-4">
              Join the RepurposeMate Community
            </h1>
            <p className="text-xl text-muted max-w-3xl mx-auto mb-8">
              Connect with thousands of content creators, marketers, and entrepreneurs who are 
              transforming their content strategy with AI. Share tips, get inspired, and grow together.
            </p>
          </motion.div>

          {/* Community Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {communityStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-sm text-muted">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Community Platforms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Where to Find Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communityLinks.map((community, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <community.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {community.title}
                            {community.isActive && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                Active
                              </Badge>
                            )}
                          </CardTitle>
                          <p className="text-sm text-muted">{community.members}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => window.open(community.link, '_blank')}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      {community.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Community Guidelines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Community Guidelines</CardTitle>
                <CardDescription>
                  Help us maintain a positive and productive environment for everyone
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guidelines.map((guideline, index) => (
                    <div key={index} className="text-center p-4">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                        <guideline.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold mb-2">{guideline.title}</h4>
                      <p className="text-sm text-muted">{guideline.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Featured Community Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Community Content</h2>
              <Button variant="outline" onClick={() => window.open('https://discord.gg/RepurposeMate', '_blank')}>
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {featuredContent.map((content, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="secondary">{content.type}</Badge>
                          <span className="text-sm text-muted">by {content.author}</span>
                        </div>
                        <h3 className="font-semibold mb-2">{content.title}</h3>
                        <p className="text-sm text-muted">{content.engagement}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => window.open(content.link, '_blank')}>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Join CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-primary/20">
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold gradient-text mb-4">
                  Ready to Join Our Community?
                </h2>
                <p className="text-muted mb-8 max-w-md mx-auto">
                  Connect with like-minded creators, share your wins, and learn from the best. 
                  Our community is here to help you succeed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => window.open('https://discord.gg/RepurposeMate', '_blank')}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Join Discord Community
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => window.location.href = '/contact'}>
                    Contact Moderators
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
