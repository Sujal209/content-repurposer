import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    // Check database connection
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.from('content_history').select('id').limit(1)
    
    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    // Check environment variables
    const requiredEnvs = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ]
    
    const missingEnvs = requiredEnvs.filter(env => !process.env[env])
    
    if (missingEnvs.length > 0) {
      throw new Error(`Missing environment variables: ${missingEnvs.join(', ')}`)
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: 'configured'
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}