import { createServerSupabaseClient } from './supabase-server'
import { NextRequest } from 'next/server'

export interface AuthUser {
  id: string
  email: string
  user_metadata?: Record<string, unknown>
}

export interface AuthResult {
  user: AuthUser | null
  error: string | null
}

/**
 * Server-side authentication check
 * Returns user if authenticated, null otherwise
 */
export async function getAuthenticatedUser(request?: NextRequest): Promise<AuthResult> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Authentication error:', error.message)
      return { user: null, error: error.message }
    }

    if (!user) {
      return { user: null, error: 'Not authenticated' }
    }

    // Return sanitized user data
    return {
      user: {
        id: user.id,
        email: user.email || '',
        user_metadata: user.user_metadata
      },
      error: null
    }
  } catch (error) {
    console.error('Auth check failed:', error)
    return { user: null, error: 'Authentication check failed' }
  }
}

// Import client-side utilities for server use
export { isValidEmail, checkRateLimit } from './auth-utils-client'

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent basic XSS
    .trim()
    .slice(0, 10000) // Limit length to prevent DoS
}

/**
 * Generate secure CSRF token
 */
export function generateCSRFToken(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
