import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-utils'
import { generateCSRFTokenForSession } from '@/lib/csrf'

export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const { user, error } = await getAuthenticatedUser()
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Generate CSRF token for this user session
    const token = generateCSRFTokenForSession(user.id)

    return NextResponse.json({
      token,
      expires: Date.now() + (60 * 60 * 1000) // 1 hour
    }, {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      }
    })

  } catch (error) {
    console.error('CSRF token generation error:', error)
    
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}
