import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-utils'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getAuthenticatedUser()
    if (error || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()

    const plan = (user.user_metadata?.plan as 'free' | 'pro' | 'enterprise') || 'free'
    const DAILY_LIMITS: Record<'free' | 'pro' | 'enterprise', number> = {
      free: parseInt(process.env.NEXT_PUBLIC_FREE_DAILY_LIMIT || '3', 10),
      pro: parseInt(process.env.NEXT_PUBLIC_PRO_DAILY_LIMIT || '200', 10),
      enterprise: parseInt(process.env.NEXT_PUBLIC_ENTERPRISE_DAILY_LIMIT || '2000', 10),
    }
    const limit = DAILY_LIMITS[plan]

    const today = new Date().toISOString().slice(0, 10)
    const { data, error: qErr } = await supabase
      .from('generation_limits')
      .select('count')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle()

    if (qErr && qErr.code !== 'PGRST116') {
      console.warn('usage query error:', qErr)
    }

    const used = data?.count ?? 0
    const remaining = Math.max(limit - used, 0)

    return NextResponse.json(
      { success: true, plan, limit, used, remaining },
      {
        headers: {
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    )
  } catch (e) {
    console.error('Usage API error', e)
    return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 })
  }
}

