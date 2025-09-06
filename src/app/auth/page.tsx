'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Sparkles, Github } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProductionAuth } from '@/lib/auth-context-production'
import { useAuthRecovery } from '@/components/auth-recovery'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const { signIn, signUp, signInWithProvider } = useProductionAuth()
  const { clearSession } = useAuthRecovery()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfo('')

    // Client-side validation
    if (!email.trim()) {
      setError('Email is required')
      setLoading(false)
      return
    }

    if (!password.trim()) {
      setError('Password is required')
      setLoading(false)
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    // Password strength validation for signup
    if (!isLogin && password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    try {
      const { error } = isLogin 
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password)

      if (error) {
        setError(error)
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="data-lines" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface/5 to-background" />
      <div className="w-full max-w-md">
        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 relative z-10"
        >
          <button 
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors cursor-pointer bg-transparent border-0 p-0 font-inherit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-2">
                <img 
                  src="/repurposemate-logo.png" 
                  alt="ContentCraft logo" 
                  className="w-full h-full object-contain filter brightness-110"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-heading">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isLogin 
                  ? 'Sign in to your ContentCraft account' 
                  : 'Join thousands of creators transforming content'
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* OAuth Providers */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={async () => {
                    const { error } = await signInWithProvider('google')
                    if (error) setError(error)
                  }}
                >
                  {/* Simple G icon */}
                  <span className="h-4 w-4 flex items-center justify-center rounded-sm bg-white text-[#4285F4] font-bold">G</span>
                  Continue with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={async () => {
                    const { error } = await signInWithProvider('github')
                    if (error) setError(error)
                  }}
                >
                  <Github className="h-4 w-4" />
                  Continue with GitHub
                </Button>
                <div className="relative text-center">
                  <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-border" />
                  <span className="relative bg-card-bg px-3 text-xs text-muted">or continue with email</span>
                </div>
              </div>



              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 bg-red-50 p-3 rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Info Message */}
                {info && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-green-700 bg-green-50 p-3 rounded-lg"
                  >
                    {info}
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </form>

              {/* Toggle Auth Mode */}
              <div className="text-center pt-4 border-t border-border">
                <p className="text-muted">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin)
                      setError('')
                    }}
                    className="ml-1 text-primary hover:text-primary-dark font-medium transition-colors"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>

              {/* Free Trial Notice */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center bg-green-50 p-3 rounded-lg"
                >
                  <p className="text-sm text-green-700">
                    🎉 <strong>Free Trial:</strong> 3 content transformations included
                  </p>
                </motion.div>
              )}
              
              {/* Recovery Section */}
              {error && error.includes('rate limit') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center bg-yellow-50 p-3 rounded-lg border border-yellow-200"
                >
                  <p className="text-sm text-yellow-700 mb-2">
                    Having trouble signing in?
                  </p>
                  <Button
                    onClick={clearSession}
                    variant="outline"
                    size="sm"
                    className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                  >
                    Clear Session & Retry
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted mb-4">Trusted by 10,000+ content creators</p>
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Twitter Threads
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              LinkedIn Posts
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Instagram Stories
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
