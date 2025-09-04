/**
 * Client-side authentication utilities
 */

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim().toLowerCase())
}

/**
 * Validates password strength
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' }
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' }
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' }
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }

  if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' }
  }

  return { valid: true }
}

/**
 * Rate limiting store (in-memory for demo - use Redis in production)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Rate limiting function
 */
export function checkRateLimit(
  identifier: string, 
  maxAttempts: number = 5, 
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remainingAttempts: number; resetTime: number } {
  const now = Date.now()
  const key = `rate_limit:${identifier}`
  
  const existing = rateLimitStore.get(key)
  
  if (!existing || now > existing.resetTime) {
    // Reset or initialize
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remainingAttempts: maxAttempts - 1, resetTime: now + windowMs }
  }
  
  if (existing.count >= maxAttempts) {
    return { allowed: false, remainingAttempts: 0, resetTime: existing.resetTime }
  }
  
  // Increment count
  existing.count += 1
  rateLimitStore.set(key, existing)
  
  return { 
    allowed: true, 
    remainingAttempts: maxAttempts - existing.count, 
    resetTime: existing.resetTime 
  }
}
