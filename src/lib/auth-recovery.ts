/**
 * Auth Recovery Utilities
 * Handles persistent 429 errors and auth state recovery
 */

export const clearAuthStorage = () => {
  if (typeof window === 'undefined') return
  
  try {
    // Clear all Supabase-related localStorage items
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.startsWith('sb-') || 
      key.includes('supabase') ||
      key.includes('auth-token') ||
      key.startsWith('auth.')
    )
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
      console.log(`Cleared storage key: ${key}`)
    })
    
    // Clear sessionStorage as well
    const sessionKeysToRemove = Object.keys(sessionStorage).filter(key => 
      key.startsWith('sb-') || 
      key.includes('supabase') ||
      key.includes('auth-token')
    )
    
    sessionKeysToRemove.forEach(key => {
      sessionStorage.removeItem(key)
    })
    
    console.log('✅ Cleared all auth storage')
  } catch (error) {
    console.warn('Failed to clear auth storage:', error)
  }
}

export const forceAuthReset = async () => {
  if (typeof window === 'undefined') return
  
  // Clear storage
  clearAuthStorage()
  
  // Clear cookies related to auth
  document.cookie.split(";").forEach(cookie => {
    const eqPos = cookie.indexOf("=")
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
    if (name.startsWith('sb-') || name.includes('auth')) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`
    }
  })
  
  console.log('🔄 Force auth reset completed')
  
  // Reload the page to start fresh
  window.location.reload()
}

// Rate limiting for error recovery
let lastRecoveryAttempt = 0
const RECOVERY_THROTTLE_MS = 30000 // 30 seconds

export const handleAuthError = (error: any) => {
  const now = Date.now()
  
  if (error?.message?.includes('429') || error?.status === 429) {
    console.warn('🚨 429 Rate limit detected')
    
    // Immediately clear auth storage on first 429 error
    clearAuthStorage()
    
    // Only attempt full recovery once every 30 seconds
    if (now - lastRecoveryAttempt > RECOVERY_THROTTLE_MS) {
      lastRecoveryAttempt = now
      console.log('🔧 Attempting full auth recovery...')
      
      // Show user-friendly message with recovery action
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('auth-rate-limit', {
          detail: {
            message: 'Authentication service is temporarily rate-limited. We\'re clearing your session to help resolve this.',
            action: 'recovery',
            recovery: () => forceAuthReset()
          }
        })
        window.dispatchEvent(event)
      }
    } else {
      // Show immediate feedback for subsequent 429 errors
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('auth-rate-limit', {
          detail: {
            message: 'Please wait a moment before trying again.',
            action: 'wait'
          }
        })
        window.dispatchEvent(event)
      }
    }
    
    return true // Error was handled
  }
  
  return false // Error not handled
}
