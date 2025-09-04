/**
 * Generate secure CSRF token
 */
function generateCSRFToken(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// CSRF token storage (in-memory for demo - use session storage in production)
const csrfTokens = new Map<string, { token: string; expires: number; used: boolean }>()

/**
 * Generate a new CSRF token for a user session
 */
export function generateCSRFTokenForSession(sessionId: string): string {
  const token = generateCSRFToken()
  const expires = Date.now() + (60 * 60 * 1000) // 1 hour
  
  csrfTokens.set(sessionId, {
    token,
    expires,
    used: false
  })
  
  return token
}

/**
 * Validate CSRF token for a user session
 */
export async function validateCSRFToken(sessionId: string, providedToken: string | null): Promise<{ valid: boolean; error?: string }> {
  if (!providedToken) {
    return { valid: false, error: 'CSRF token is required' }
  }

  const stored = csrfTokens.get(sessionId)
  
  if (!stored) {
    return { valid: false, error: 'Invalid session or CSRF token not found' }
  }
  
  // Check if token has expired
  if (Date.now() > stored.expires) {
    csrfTokens.delete(sessionId)
    return { valid: false, error: 'CSRF token has expired' }
  }
  
  // Check if token has already been used (prevent replay attacks)
  if (stored.used) {
    return { valid: false, error: 'CSRF token has already been used' }
  }
  
  // Validate token
  if (stored.token !== providedToken) {
    return { valid: false, error: 'Invalid CSRF token' }
  }
  
  // Mark token as used
  stored.used = true
  csrfTokens.set(sessionId, stored)
  
  return { valid: true }
}

/**
 * Clean up expired CSRF tokens
 */
export function cleanupExpiredTokens(): void {
  const now = Date.now()
  
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (now > data.expires) {
      csrfTokens.delete(sessionId)
    }
  }
}

// Run cleanup every 15 minutes
setInterval(cleanupExpiredTokens, 15 * 60 * 1000)
