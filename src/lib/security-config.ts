/**
 * Security Configuration
 * Centralized security settings and utilities
 */

export const SECURITY_CONFIG = {
  // HTTPS enforcement
  FORCE_HTTPS: process.env.NODE_ENV === 'production',
  
  // CORS settings
  ALLOWED_ORIGINS: process.env.NODE_ENV === 'production' 
    ? [process.env.NEXT_PUBLIC_APP_URL!]
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://repurposematee.vercel.app'],
    
  // Rate limiting
  RATE_LIMITS: {
    API_REQUESTS: { max: 100, window: 15 * 60 * 1000 }, // 100 requests per 15 minutes
    AUTH_ATTEMPTS: { max: 5, window: 15 * 60 * 1000 },  // 5 auth attempts per 15 minutes
    TRANSFORM_REQUESTS: { max: 10, window: 60 * 60 * 1000 }, // 10 transforms per hour
  },
  
  // Session settings
  SESSION: {
    MAX_AGE: 24 * 60 * 60, // 24 hours
    REFRESH_THRESHOLD: 60 * 60, // Refresh if expires in 1 hour
  },
  
  // Input validation
  INPUT_LIMITS: {
    MAX_CONTENT_LENGTH: 10000,
    MAX_TITLE_LENGTH: 200,
    MAX_CUSTOM_INSTRUCTIONS: 500,
  }
} as const

/**
 * Security headers for all responses
 */
export function getSecurityHeaders() {
  return {
    // Prevent XSS attacks
    'X-XSS-Protection': '1; mode=block',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions policy
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    
    // HSTS (only in production with HTTPS)
    ...(SECURITY_CONFIG.FORCE_HTTPS && {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    }),
    
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.openai.com https://openrouter.ai https://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
  }
}

/**
 * CORS configuration
 */
export function getCorsHeaders(origin?: string) {
  const isAllowedOrigin = !origin || SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin)
  
  return {
    'Access-Control-Allow-Origin': isAllowedOrigin ? (origin || '*') : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24 hours
  }
}

/**
 * HTTPS redirect check
 */
export function shouldRedirectToHttps(request: { headers: { get: (name: string) => string | null } }) {
  if (!SECURITY_CONFIG.FORCE_HTTPS) return false
  
  const proto = request.headers.get('x-forwarded-proto')
  const host = request.headers.get('host')
  
  return proto !== 'https' && !host?.includes('localhost')
}