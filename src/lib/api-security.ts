/**
 * API Security Utilities
 * Centralized security functions for API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSecurityHeaders, getCorsHeaders, SECURITY_CONFIG } from './security-config'
import { enhancedRateLimit, validateOrigin } from './auth-utils'

/**
 * Security middleware for API routes
 */
export function withApiSecurity(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      // 1. CORS validation
      const origin = request.headers.get('origin')
      if (origin && !SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin)) {
        return new NextResponse(JSON.stringify({ error: 'Origin not allowed' }), {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            ...getSecurityHeaders()
          }
        })
      }

      // 2. Rate limiting
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                 request.headers.get('x-real-ip') || 
                 request.ip || 'unknown'
      
      const rateLimitKey = `api:${ip}:${request.nextUrl.pathname}`
      const { allowed, remainingAttempts, blocked } = enhancedRateLimit(
        rateLimitKey,
        SECURITY_CONFIG.RATE_LIMITS.API_REQUESTS.max,
        SECURITY_CONFIG.RATE_LIMITS.API_REQUESTS.window
      )

      if (!allowed) {
        return new NextResponse(JSON.stringify({ 
          error: blocked ? 'IP temporarily blocked' : 'Rate limit exceeded',
          retryAfter: Math.ceil(SECURITY_CONFIG.RATE_LIMITS.API_REQUESTS.window / 1000)
        }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': SECURITY_CONFIG.RATE_LIMITS.API_REQUESTS.max.toString(),
            'X-RateLimit-Remaining': '0',
            'Retry-After': Math.ceil(SECURITY_CONFIG.RATE_LIMITS.API_REQUESTS.window / 1000).toString(),
            ...getSecurityHeaders(),
            ...getCorsHeaders(origin)
          }
        })
      }

      // 3. Execute handler
      const response = await handler(request)

      // 4. Add security headers to response
      const securityHeaders = getSecurityHeaders()
      const corsHeaders = getCorsHeaders(origin)
      
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      // 5. Add rate limit headers
      response.headers.set('X-RateLimit-Limit', SECURITY_CONFIG.RATE_LIMITS.API_REQUESTS.max.toString())
      response.headers.set('X-RateLimit-Remaining', remainingAttempts.toString())

      return response

    } catch (error) {
      console.error('API Security Error:', error)
      
      return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...getSecurityHeaders(),
          ...getCorsHeaders(request.headers.get('origin'))
        }
      })
    }
  }
}

/**
 * Validate API request method
 */
export function validateMethod(request: NextRequest, allowedMethods: string[]) {
  if (!allowedMethods.includes(request.method)) {
    throw new Error(`Method ${request.method} not allowed`)
  }
}

/**
 * Validate Content-Type header
 */
export function validateContentType(request: NextRequest, expectedType = 'application/json') {
  const contentType = request.headers.get('content-type')
  if (request.method !== 'GET' && !contentType?.includes(expectedType)) {
    throw new Error('Invalid Content-Type header')
  }
}

/**
 * Create secure API response
 */
export function createSecureResponse(
  data: any, 
  status = 200, 
  origin?: string | null
) {
  return NextResponse.json(data, {
    status,
    headers: {
      ...getSecurityHeaders(),
      ...getCorsHeaders(origin)
    }
  })
}

/**
 * Create error response with security headers
 */
export function createErrorResponse(
  message: string, 
  status = 400, 
  origin?: string | null
) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        ...getSecurityHeaders(),
        ...getCorsHeaders(origin)
      }
    }
  )
}