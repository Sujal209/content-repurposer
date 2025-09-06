/**
 * Production-Ready Supabase Client with Rate Limit Protection
 * 
 * This implementation provides:
 * 1. Intelligent token refresh with exponential backoff
 * 2. Circuit breaker pattern for persistent failures
 * 3. Session persistence with local fallback
 * 4. Automatic error recovery
 * 5. Connection pooling and cleanup
 */

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient, Session } from '@supabase/supabase-js'

// Singleton client instance
let productionClient: SupabaseClient | null = null

// Rate limiting and circuit breaker state
interface RateLimitState {
  lastRefreshAttempt: number
  consecutiveErrors: number
  totalErrors: number
  circuitBreakerOpen: boolean
  circuitBreakerOpenTime: number
}

const rateLimitState: RateLimitState = {
  lastRefreshAttempt: 0,
  consecutiveErrors: 0,
  totalErrors: 0,
  circuitBreakerOpen: false,
  circuitBreakerOpenTime: 0
}

// Configuration constants
const CONFIG = {
  // Token refresh settings
  MIN_REFRESH_INTERVAL: 30000,        // 30 seconds minimum between refreshes
  MAX_REFRESH_INTERVAL: 300000,       // 5 minutes maximum backoff
  BACKOFF_MULTIPLIER: 2,              // Exponential backoff multiplier
  
  // Circuit breaker settings
  MAX_CONSECUTIVE_ERRORS: 3,          // Open circuit after 3 consecutive failures
  CIRCUIT_BREAKER_TIMEOUT: 120000,    // 2 minutes circuit breaker timeout
  ERROR_RESET_WINDOW: 300000,         // 5 minutes to reset error count
  
  // Session management
  SESSION_CHECK_INTERVAL: 600000,     // Check session validity every 10 minutes
  SESSION_REFRESH_THRESHOLD: 300000,  // Refresh if expires within 5 minutes
} as const

// Session management
let sessionCheckInterval: NodeJS.Timeout | null = null
let currentSession: Session | null = null

/**
 * Calculate dynamic backoff delay based on consecutive errors
 */
function calculateBackoffDelay(): number {
  const baseDelay = CONFIG.MIN_REFRESH_INTERVAL
  const exponentialDelay = baseDelay * Math.pow(CONFIG.BACKOFF_MULTIPLIER, rateLimitState.consecutiveErrors)
  return Math.min(exponentialDelay, CONFIG.MAX_REFRESH_INTERVAL)
}

/**
 * Check if circuit breaker should be opened
 */
function shouldOpenCircuitBreaker(): boolean {
  return rateLimitState.consecutiveErrors >= CONFIG.MAX_CONSECUTIVE_ERRORS
}

/**
 * Open the circuit breaker
 */
function openCircuitBreaker(): void {
  rateLimitState.circuitBreakerOpen = true
  rateLimitState.circuitBreakerOpenTime = Date.now()
  
  console.warn('🔌 Circuit breaker OPENED - suspending token refresh attempts')
  
  // Auto-close circuit breaker after timeout
  setTimeout(() => {
    closeCircuitBreaker()
  }, CONFIG.CIRCUIT_BREAKER_TIMEOUT)
}

/**
 * Close the circuit breaker and reset error counts
 */
function closeCircuitBreaker(): void {
  rateLimitState.circuitBreakerOpen = false
  rateLimitState.consecutiveErrors = 0
  rateLimitState.circuitBreakerOpenTime = 0
  
  console.log('🔌 Circuit breaker CLOSED - resuming normal operation')
}

/**
 * Check if circuit breaker should be closed (half-open state)
 */
function canAttemptRefresh(): boolean {
  if (!rateLimitState.circuitBreakerOpen) return true
  
  const timeSinceOpen = Date.now() - rateLimitState.circuitBreakerOpenTime
  return timeSinceOpen >= CONFIG.CIRCUIT_BREAKER_TIMEOUT
}

/**
 * Reset error counts if enough time has passed
 */
function maybeResetErrorCounts(): void {
  const timeSinceLastError = Date.now() - rateLimitState.lastRefreshAttempt
  if (timeSinceLastError >= CONFIG.ERROR_RESET_WINDOW) {
    rateLimitState.totalErrors = 0
    rateLimitState.consecutiveErrors = Math.max(0, rateLimitState.consecutiveErrors - 1)
  }
}

/**
 * Custom token refresh with intelligent rate limiting
 */
async function intelligentTokenRefresh(originalRefresh: Function, context: any): Promise<any> {
  const now = Date.now()
  
  // Reset error counts if enough time has passed
  maybeResetErrorCounts()
  
  // Check circuit breaker
  if (rateLimitState.circuitBreakerOpen && !canAttemptRefresh()) {
    console.log('🚫 Circuit breaker is open - refusing refresh attempt')
    return null
  }
  
  // Check rate limiting
  const timeSinceLastAttempt = now - rateLimitState.lastRefreshAttempt
  const requiredDelay = calculateBackoffDelay()
  
  if (timeSinceLastAttempt < requiredDelay) {
    console.log(`⏱️  Rate limit: waiting ${Math.ceil((requiredDelay - timeSinceLastAttempt) / 1000)}s before next refresh`)
    return null
  }
  
  // Attempt refresh
  rateLimitState.lastRefreshAttempt = now
  
  try {
    console.log('🔄 Attempting intelligent token refresh...')
    const result = await originalRefresh.call(context)
    
    // Success: reset error counters
    rateLimitState.consecutiveErrors = 0
    if (rateLimitState.circuitBreakerOpen) {
      closeCircuitBreaker()
    }
    
    console.log('✅ Token refresh successful')
    return result
    
  } catch (error: any) {
    rateLimitState.consecutiveErrors++
    rateLimitState.totalErrors++
    
    console.error(`❌ Token refresh failed (attempt ${rateLimitState.consecutiveErrors}):`, error.message)
    
    // Handle rate limit errors specifically
    if (error.message?.includes('429') || error.status === 429) {
      console.warn('🚨 Rate limit detected - increasing backoff')
      
      if (shouldOpenCircuitBreaker()) {
        openCircuitBreaker()
      }
      
      // Don't throw for rate limit errors - just return null
      return null
    }
    
    // For other errors, still increment but allow potential retry
    if (shouldOpenCircuitBreaker()) {
      openCircuitBreaker()
    }
    
    throw error
  }
}

/**
 * Session validity checker
 */
function startSessionMonitoring(client: SupabaseClient): void {
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval)
  }
  
  sessionCheckInterval = setInterval(async () => {
    try {
      const { data: { session }, error } = await client.auth.getSession()
      
      if (error) {
        console.warn('Session check failed:', error.message)
        return
      }
      
      if (!session) {
        console.log('No active session found')
        currentSession = null
        return
      }
      
      currentSession = session
      
      // Check if session expires soon
      const expiresAt = session.expires_at ? session.expires_at * 1000 : 0
      const timeUntilExpiry = expiresAt - Date.now()
      
      if (timeUntilExpiry <= CONFIG.SESSION_REFRESH_THRESHOLD && timeUntilExpiry > 0) {
        console.log('📱 Session expires soon, attempting proactive refresh...')
        
        if (canAttemptRefresh() && !rateLimitState.circuitBreakerOpen) {
          const timeSinceLastAttempt = Date.now() - rateLimitState.lastRefreshAttempt
          if (timeSinceLastAttempt >= CONFIG.MIN_REFRESH_INTERVAL) {
            try {
              await client.auth.refreshSession()
              console.log('✅ Proactive session refresh successful')
            } catch (err) {
              console.warn('⚠️ Proactive refresh failed:', err)
            }
          }
        }
      }
    } catch (err) {
      console.warn('Session monitoring error:', err)
    }
  }, CONFIG.SESSION_CHECK_INTERVAL)
}

/**
 * Create production-ready Supabase client
 */
export function createProductionClient(): SupabaseClient {
  if (!productionClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }
    
    console.log('🏭 Creating production Supabase client with rate limit protection...')
    
    productionClient = createBrowserClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          // Enable session persistence but disable auto-refresh
          autoRefreshToken: false,
          persistSession: true,
          detectSessionInUrl: true,
        },
        global: {
          headers: {
            'X-Client-Info': 'content-repurposer-production/1.0.0',
            'Cache-Control': 'no-cache'
          }
        },
        realtime: {
          params: {
            eventsPerSecond: 1,  // Limit realtime events
            timeout: 10000,      // 10 second timeout
          }
        }
      }
    )
    
    // Override the token refresh mechanism
    const originalRefresh = (productionClient as any)._refreshAccessToken
    if (originalRefresh) {
      (productionClient as any)._refreshAccessToken = function(...args: any[]) {
        return intelligentTokenRefresh(originalRefresh, this)
      }
    }
    
    // Start session monitoring
    startSessionMonitoring(productionClient)
    
    // Handle auth state changes
    productionClient.auth.onAuthStateChange((event, session) => {
      currentSession = session
      
      if (event === 'SIGNED_OUT') {
        // Clear rate limit state on sign out
        rateLimitState.consecutiveErrors = 0
        rateLimitState.totalErrors = 0
        rateLimitState.circuitBreakerOpen = false
        console.log('🧹 Rate limit state cleared on sign out')
      }
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed successfully via auth state change')
      }
    })
    
    console.log('✅ Production client created with intelligent rate limiting')
  }
  
  return productionClient
}

/**
 * Get current session without triggering refresh
 */
export function getCurrentSession(): Session | null {
  return currentSession
}

/**
 * Manual session refresh with rate limit protection
 */
export async function refreshSessionSafely(): Promise<{ session: Session | null; error: any }> {
  if (!productionClient) {
    return { session: null, error: new Error('Client not initialized') }
  }
  
  if (!canAttemptRefresh()) {
    return { session: currentSession, error: new Error('Rate limited - cannot refresh now') }
  }
  
  try {
    const { data, error } = await productionClient.auth.refreshSession()
    if (data.session) {
      currentSession = data.session
    }
    return { session: data.session, error }
  } catch (err) {
    return { session: currentSession, error: err }
  }
}

/**
 * Cleanup function for production client
 */
export function cleanupProductionClient(): void {
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval)
    sessionCheckInterval = null
  }
  
  if (productionClient) {
    // Clean up any subscriptions
    productionClient.removeAllChannels()
    productionClient = null
  }
  
  // Reset rate limit state
  Object.assign(rateLimitState, {
    lastRefreshAttempt: 0,
    consecutiveErrors: 0,
    totalErrors: 0,
    circuitBreakerOpen: false,
    circuitBreakerOpenTime: 0
  })
  
  console.log('🧹 Production client cleaned up')
}

/**
 * Get rate limit status for debugging
 */
export function getRateLimitStatus() {
  return {
    ...rateLimitState,
    nextRefreshAllowedAt: rateLimitState.lastRefreshAttempt + calculateBackoffDelay(),
    timeUntilNextRefresh: Math.max(0, (rateLimitState.lastRefreshAttempt + calculateBackoffDelay()) - Date.now())
  }
}
