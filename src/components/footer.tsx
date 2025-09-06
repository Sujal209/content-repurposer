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
              <img 
                src="/repurposemate-logo.png" 
                alt="RepurposeMate logo" 
                className="w-8 h-8 object-contain drop-shadow-lg"
              />
              <h3 className="text-lg font-bold text-heading">RepurposeMate</h3>
            </div>
            <p className="text-sm text-muted max-w-xs">
              Transform your long-form content into engaging social media posts with AI. 
              Perfect for indie makers and content creators.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com/RepurposeMate" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors" aria-label="RepurposeMate on Twitter">
                <Twitter className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="https://linkedin.com/company/RepurposeMate" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors" aria-label="RepurposeMate on LinkedIn">
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="https://github.com/RepurposeMate/api" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors" aria-label="RepurposeMate on GitHub">
                <Github className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link href="/contact" className="text-muted hover:text-primary transition-colors" aria-label="Contact us">
                <Mail className="h-4 w-4" aria-hidden="true" />
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
            © {new Date().getFullYear()} RepurposeMate. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-sm text-muted">
            <span>Built with</span>
            <Heart className="h-3 w-3 text-red-500" aria-hidden="true" />
            <span>for indie makers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
