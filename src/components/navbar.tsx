'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  CreditCard,
  BookOpen,
  Home
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useProductionAuth } from '@/lib/auth-context-production'

interface NavbarProps {
  plan?: string
  remainingToday?: number
  dailyLimit?: number
}

export default function Navbar({ plan = 'free', remainingToday = 0, dailyLimit = 3 }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { user, signOut } = useProductionAuth()
  const router = useRouter()
  const mobileMenuRef = React.useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out failed:', error)
    } finally {
      setIsSigningOut(false)
      setIsMobileMenuOpen(false)
    }
  }

  // Focus management for mobile menu
  React.useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      // Focus first interactive element in mobile menu
      const firstButton = mobileMenuRef.current.querySelector('button')
      if (firstButton) {
        (firstButton as HTMLButtonElement).focus()
      }
    }
  }, [isMobileMenuOpen])

  // Handle escape key to close mobile menu
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMobileMenuOpen])

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Library', href: '/history', icon: BookOpen },
    { name: 'Pricing', href: '/pricing', icon: CreditCard },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card-bg/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="/repurposemate-logo.png" 
                alt="repuposemate logo" 
                className="w-10 h-10 object-contain drop-shadow-lg"
              />
              <h1 className="text-xl font-bold gradient-text">repuposemate</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navigationItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation(item.href)}
                  className="text-muted hover:text-foreground"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Button>
              ))}
            </div>

            {/* Desktop User Info and Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Plan and Usage Badge */}
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-primary/20 text-primary border border-primary/30">
                  {plan.toUpperCase()}
                </span>
                <span className="px-2 py-1 rounded bg-surface text-muted border border-border">
                  {remainingToday}/{dailyLimit}
                </span>
              </div>

              {/* User Email */}
              {user?.email && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline max-w-[150px] truncate">{user.email}</span>
                </div>
              )}

              {/* Sign Out */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-muted hover:text-foreground disabled:opacity-50"
              >
                {isSigningOut ? (
                  <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4 mr-2" />
                )}
                {isSigningOut ? 'Signing Out...' : 'Sign Out'}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-muted hover:text-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border bg-card-bg/95 backdrop-blur-xl"
              role="menu"
              aria-labelledby="mobile-menu-button"
            >
              <div className="px-4 py-4 space-y-3">
                {/* User Info */}
                {user?.email && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50">
                    <img 
                      src="/repurposemate-logo.png" 
                      alt="repuposemate" 
                      className="w-10 h-10 object-contain drop-shadow-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 text-xs rounded bg-primary/20 text-primary border border-primary/30">
                          {plan.toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 text-xs rounded bg-surface text-muted border border-border">
                          {remainingToday}/{dailyLimit} left
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Items */}
                <div className="space-y-1">
                  {navigationItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.href)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-surface/50 transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-muted" />
                      <span className="text-foreground">{item.name}</span>
                    </button>
                  ))}
                </div>

                {/* Sign Out */}
                <div className="pt-3 border-t border-border">
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                  >
                    {isSigningOut ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <LogOut className="h-5 w-5" />
                    )}
                    <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-16" />
    </>
  )
}
