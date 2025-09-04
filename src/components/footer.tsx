'use client'

import Link from 'next/link'
import { Sparkles, Twitter, Linkedin, Github, Mail, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card-bg/50 backdrop-blur-xl mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-heading">ContentCraft</h3>
            </div>
            <p className="text-sm text-muted max-w-xs">
              Transform your long-form content into engaging social media posts with AI. 
              Perfect for indie makers and content creators.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://twitter.com/contentcraft" className="text-muted hover:text-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="https://linkedin.com/company/contentcraft" className="text-muted hover:text-primary transition-colors">
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link href="https://github.com/contentcraft/api" className="text-muted hover:text-primary transition-colors">
                <Github className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="text-muted hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold text-heading">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/auth" className="text-sm text-muted hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-sm text-muted hover:text-primary transition-colors">
                  Content Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-heading">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm text-muted hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-sm text-muted hover:text-primary transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-heading">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-muted hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted">
            © {new Date().getFullYear()} ContentCraft. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-sm text-muted">
            <span>Built with</span>
            <Heart className="h-3 w-3 text-red-500" />
            <span>for indie makers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
