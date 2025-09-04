'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import { createProductionClient, getCurrentSession, refreshSessionSafely, getRateLimitStatus } from './supabase-production'
import { isValidEmail } from './auth-utils-client'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signInWithProvider: (provider: 'google' | 'github') => Promise<{ error?: string }>
  signInWithMagicLink: (email: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  refreshSession: () => Promise<{ error?: string }>
  rateLimitStatus: () => any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function ProductionAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createProductionClient()
  const initializationAttempted = useRef(false)
  const lastAuthAttempt = useRef(0)
  const MIN_AUTH_INTERVAL = 5000 // 5 seconds minimum between auth attempts

  // Rate limiting for auth operations
  const canAttemptAuth = (): boolean => {
    const now = Date.now()
    const timeSinceLastAttempt = now - lastAuthAttempt.current
    return timeSinceLastAttempt >= MIN_AUTH_INTERVAL
  }

  const recordAuthAttempt = () => {
    lastAuthAttempt.current = Date.now()
  }

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      if (initializationAttempted.current) return
      initializationAttempted.current = true

      try {
        console.log('🔐 Initializing production authentication...')
        
        // First, try to get session without refresh
        const cachedSession = getCurrentSession()
        if (cachedSession?.user) {
          setUser(cachedSession.user)
          setLoading(false)
          console.log('✅ Using cached session')
          return
        }

        // If no cached session, try to get from Supabase
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.warn('Initial session fetch error:', error.message)
          if (!error.message?.includes('429')) {
            // Only log out if it's not a rate limit error
            setUser(null)
          }
        } else {
          setUser(session?.user ?? null)
        }
        
      } catch (err) {
        console.error('Auth initialization error:', err)
        setUser(null)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('🔄 Auth state changed:', event)
        
        try {
          if (event === 'SIGNED_OUT') {
            setUser(null)
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            setUser(session?.user ?? null)
          } else if (event === 'USER_UPDATED') {
            setUser(session?.user ?? null)
          }
        } catch (err) {
          console.warn('Auth state change error:', err)
        }
        
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    if (!canAttemptAuth()) {
      return { error: 'Please wait a moment before trying again' }
    }

    recordAuthAttempt()

    try {
      // Input validation
      if (!email?.trim() || !password?.trim()) {
        return { error: 'Email and password are required' }
      }

      if (!isValidEmail(email)) {
        return { error: 'Please enter a valid email address' }
      }

      console.log('🔐 Attempting sign in...')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        // Handle specific error types
        if (error.message?.includes('429')) {
          return { error: 'Too many requests. Please wait a moment and try again.' }
        }
        
        if (error.message?.includes('Invalid login credentials')) {
          return { error: 'Invalid email or password' }
        }
        
        console.warn('Sign in error:', error.message)
        return { error: error.message }
      }

      if (data.user) {
        setUser(data.user)
        console.log('✅ Sign in successful')
      }

      return { error: undefined }
    } catch (err) {
      console.error('Sign in error:', err)
      return { error: 'An unexpected error occurred during sign in' }
    }
  }

  const signUp = async (email: string, password: string) => {
    if (!canAttemptAuth()) {
      return { error: 'Please wait a moment before trying again' }
    }

    recordAuthAttempt()

    try {
      // Input validation
      if (!email?.trim() || !password?.trim()) {
        return { error: 'Email and password are required' }
      }

      if (!isValidEmail(email)) {
        return { error: 'Please enter a valid email address' }
      }

      if (password.length < 8) {
        return { error: 'Password must be at least 8 characters long' }
      }

      console.log('📝 Attempting sign up...')

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            created_at: new Date().toISOString()
          }
        }
      })

      if (error) {
        if (error.message?.includes('429')) {
          return { error: 'Too many requests. Please wait a moment and try again.' }
        }
        
        console.warn('Sign up error:', error.message)
        return { error: error.message }
      }

      console.log('✅ Sign up successful')
      return { error: undefined }
    } catch (err) {
      console.error('Sign up error:', err)
      return { error: 'An unexpected error occurred during sign up' }
    }
  }

  const signInWithProvider = async (provider: 'google' | 'github') => {
    if (!canAttemptAuth()) {
      return { error: 'Please wait a moment before trying again' }
    }

    recordAuthAttempt()

    try {
      const redirectTo = `${window.location.origin}/dashboard`
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      })
      
      if (error) {
        if (error.message?.includes('429')) {
          return { error: 'Too many requests. Please wait a moment and try again.' }
        }
        return { error: error.message }
      }
      
      return { error: undefined }
    } catch (err) {
      console.error('OAuth sign in error:', err)
      return { error: 'Failed to sign in with provider' }
    }
  }

  const signInWithMagicLink = async (email: string) => {
    if (!canAttemptAuth()) {
      return { error: 'Please wait a moment before trying again' }
    }

    recordAuthAttempt()

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
        if (error.message?.includes('429')) {
          return { error: 'Too many requests. Please wait a moment and try again.' }
        }
        return { error: error.message }
      }
      
      return { error: undefined }
    } catch (err) {
      console.error('Magic link error:', err)
      return { error: 'Failed to send magic link' }
    }
  }

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...')
      await supabase.auth.signOut()
      setUser(null)
      console.log('✅ Sign out successful')
    } catch (err) {
      console.error('Sign out error:', err)
      // Force clear user state even if signout fails
      setUser(null)
    }
  }

  const refreshSession = async () => {
    try {
      console.log('🔄 Manual session refresh requested...')
      const { session, error } = await refreshSessionSafely()
      
      if (error) {
        if (error.message?.includes('Rate limited')) {
          return { error: 'Please wait before refreshing again' }
        }
        return { error: error.message }
      }
      
      if (session?.user) {
        setUser(session.user)
        console.log('✅ Manual session refresh successful')
      }
      
      return { error: undefined }
    } catch (err) {
      console.error('Manual refresh error:', err)
      return { error: 'Failed to refresh session' }
    }
  }

  const rateLimitStatus = () => {
    return getRateLimitStatus()
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithProvider,
    signInWithMagicLink,
    signOut,
    refreshSession,
    rateLimitStatus
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useProductionAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useProductionAuth must be used within a ProductionAuthProvider')
  }
  return context
}
