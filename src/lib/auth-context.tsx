'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createSimpleClient } from './supabase-simple'
import { isValidEmail, checkRateLimit } from './auth-utils-client'
import { handleAuthError } from './auth-recovery'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signInWithProvider: (provider: 'google' | 'github') => Promise<{ error?: string }>
  signInWithMagicLink: (email: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  // Use simple client temporarily to avoid 429 errors
  const supabase = createSimpleClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    try {
      // Simple client doesn't need auth flow state management
      
      // Input validation
      if (!email?.trim() || !password?.trim()) {
        return { error: 'Email and password are required' }
      }

      if (!isValidEmail(email)) {
        return { error: 'Please enter a valid email address' }
      }

      // Rate limiting for login attempts
      const rateLimitKey = `login:${email.toLowerCase()}`
      const { allowed } = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000) // 5 attempts per 15 minutes
      
      if (!allowed) {
        return { error: 'Too many login attempts. Please try again in 15 minutes.' }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        // Handle 429 rate limit errors specifically
        if (error.message?.includes('429') || error.message?.includes('rate limit')) {
          handleAuthError(error)
          return { error: 'Authentication service is temporarily overloaded. Please wait a moment and try again.' }
        }
        
        // Log security events
        console.warn(`Failed login attempt for email: ${email}`, {
          error: error.message,
          timestamp: new Date().toISOString()
        })
        return { error: error.message }
      }

      return { error: undefined }
    } catch (err) {
      console.error('Sign in error:', err)
      return { error: 'An unexpected error occurred during sign in' }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      // Simple client doesn't need auth flow state management
      
      // Input validation
      if (!email?.trim() || !password?.trim()) {
        return { error: 'Email and password are required' }
      }

      if (!isValidEmail(email)) {
        return { error: 'Please enter a valid email address' }
      }

      // Password strength validation (basic)
      if (password.length < 8) {
        return { error: 'Password must be at least 8 characters long' }
      }

      // Rate limiting for signup attempts
      const rateLimitKey = `signup:${email.toLowerCase()}`
      const { allowed } = checkRateLimit(rateLimitKey, 3, 60 * 60 * 1000) // 3 attempts per hour
      
      if (!allowed) {
        return { error: 'Too many signup attempts. Please try again later.' }
      }

      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            created_at: new Date().toISOString()
          }
        }
      })

      if (error) {
        console.warn(`Failed signup attempt for email: ${email}`, {
          error: error.message,
          timestamp: new Date().toISOString()
        })
        return { error: error.message }
      }

      return { error: undefined }
    } catch (err) {
      console.error('Sign up error:', err)
      return { error: 'An unexpected error occurred during sign up' }
    }
  }

  const signInWithProvider = async (provider: 'google' | 'github') => {
    try {
      const redirectTo = `${window.location.origin}/dashboard`
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          // You can set queryParams if needed, e.g.,
          // queryParams: { prompt: 'consent' }
        },
      })
      if (error) {
        return { error: error.message }
      }
      return { error: undefined }
    } catch (err) {
      console.error('OAuth sign in error:', err)
      return { error: 'Failed to sign in with provider' }
    }
  }

  const signInWithMagicLink = async (email: string) => {
    try {
      if (!email?.trim()) {
        return { error: 'Email is required' }
      }
      if (!isValidEmail(email)) {
        return { error: 'Please enter a valid email address' }
      }
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) {
        return { error: error.message }
      }
      return { error: undefined }
    } catch (err) {
      console.error('Magic link error:', err)
      return { error: 'Failed to send magic link' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithProvider,
    signInWithMagicLink,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
