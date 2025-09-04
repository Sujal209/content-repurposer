import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-utils'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const { user, error } = await getAuthenticatedUser()
    if (error || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()

    // Get recent transformations
    const { data: recentTransformations } = await supabase
      .from('content_history')
      .select('content_type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get usage breakdown by content type
    const { data: usageBreakdown } = await supabase
      .from('content_history')
      .select('content_type')
      .eq('user_id', user.id)

    const breakdown = usageBreakdown?.reduce((acc: any, item) => {
      acc[item.content_type] = (acc[item.content_type] || 0) + 1
      return acc
    }, {}) || {}

    // Get monthly usage (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: monthlyData } = await supabase
      .from('content_history')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', thirtyDaysAgo.toISOString())

    return NextResponse.json({
      success: true,
      analytics: {
        recentTransformations: recentTransformations?.map(t => ({
          type: t.content_type,
          date: new Date(t.created_at).toLocaleDateString(),
          status: 'Success'
        })) || [],
        usageBreakdown: {
          'Twitter Thread': breakdown['twitter'] || 0,
          'LinkedIn Carousel': breakdown['linkedin'] || 0,
          'Instagram Stories': breakdown['instagram'] || 0
        },
        monthlyUsage: monthlyData?.length || 0
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}