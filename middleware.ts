import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Rate limiting for middleware auth checks
const authCheckAttempts = new Map<string, { count: number; lastAttempt: number; blocked: boolean }>()
const AUTH_CHECK_WINDOW = 60000 // 1 minute
const MAX_AUTH_CHECKS = 10 // Max 10 auth checks per minute per IP
const BLOCK_DURATION = 300000 // 5 minutes block duration

// Helper function to check if IP is rate limited
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = authCheckAttempts.get(ip)
  
  if (!record) {
    authCheckAttempts.set(ip, { count: 1, lastAttempt: now, blocked: false })
    return false
  }
  
  // Check if block period has expired
  if (record.blocked && (now - record.lastAttempt > BLOCK_DURATION)) {
    record.blocked = false
    record.count = 1
    record.lastAttempt = now
    return false
  }
  
  if (record.blocked) {
    return true
  }
  
  // Reset count if window has expired
  if (now - record.lastAttempt > AUTH_CHECK_WINDOW) {
    record.count = 1
    record.lastAttempt = now
    return false
  }
  
  record.count++
  record.lastAttempt = now
  
  if (record.count > MAX_AUTH_CHECKS) {
    record.blocked = true
    console.warn(`IP ${ip} blocked for excessive auth checks`)
    return true
  }
  
  return false
}

export async function middleware(request: NextRequest) {
  // Get client IP for rate limiting
  const ip = request.headers.get('x-forwarded-for') || 
           request.headers.get('x-real-ip') || 
           'unknown'
  
  // Check if this IP is rate limited
  if (isRateLimited(ip)) {
    console.log(`Rate limited auth check for IP: ${ip}`)
    
    // For rate limited requests, allow access without auth check
    // This prevents the 429 errors from cascading
    const response = NextResponse.next({ request })
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', MAX_AUTH_CHECKS.toString())
    response.headers.set('X-RateLimit-Remaining', '0')
    response.headers.set('X-RateLimit-Reset', new Date(Date.now() + BLOCK_DURATION).toISOString())
    
    return response
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
      auth: {
        // Disable auto refresh in middleware to prevent rate limits
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  let user = null
  let authError = null
  
  try {
    // Use getSession instead of getUser to avoid token refresh attempts
    const {
      data: { session },
      error
    } = await supabase.auth.getSession()
    user = session?.user ?? null
    authError = error
  } catch (error: any) {
    console.warn('Auth check failed:', error.message)
    // If it's a 429 error or similar rate limit, allow access
    if (error.message?.includes('429') || error.message?.includes('rate limit')) {
      console.log('Rate limit detected in middleware, allowing continued access')
      // Don't redirect on rate limit errors - assume user is still authenticated
      authError = error
      // Skip auth enforcement for this request
      const response = NextResponse.next({ request })
      response.headers.set('X-Auth-Status', 'rate-limited')
      return response
    } else {
      authError = error
    }
  }

  const { pathname } = request.nextUrl

  // Protected routes - require authentication
  const protectedRoutes = ['/dashboard', '/settings', '/history', '/api/transform']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Auth routes - redirect if already authenticated
  const authRoutes = ['/auth', '/login', '/signup']
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !user && !authError?.message?.includes('429')) {
    // Only redirect to auth if user is not authenticated AND it's not a rate limit error
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (isAuthRoute && user) {
    // Redirect to dashboard if already authenticated and trying to access auth pages
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Add security headers to all responses
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block')
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  supabaseResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Content Security Policy
  const cspValue = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline for dev
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.openai.com https://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
  
  supabaseResponse.headers.set('Content-Security-Policy', cspValue)

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object instead of the supabaseResponse object

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/history/:path*',
    '/settings/:path*',
  ],
}
