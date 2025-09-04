import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-utils'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const { user, error } = await getAuthenticatedUser()
    if (error || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()
    
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          preferences: {
            theme: 'system',
            notifications: { email: true, push: false, marketing: false }
          }
        })
        .select()
        .single()

      if (createError) {
        return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
      }
      profile = newProfile
    } else if (profileError) {
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      profile: { ...profile, plan: user.user_metadata?.plan || 'free' }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user, error } = await getAuthenticatedUser()
    if (error || !user) {
      console.error('Auth error in profile PUT:', error)
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { avatar_url, preferences, full_name } = await request.json()
    const supabase = await createServerSupabaseClient()
    
    const updateData: any = { updated_at: new Date().toISOString() }
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url
    if (preferences !== undefined) updateData.preferences = preferences
    if (full_name !== undefined) updateData.full_name = full_name

    console.log('Updating profile for user:', user.id, 'with data:', updateData)

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)

    if (updateError) {
      console.error('Supabase update error:', updateError)
      return NextResponse.json({ error: `Database error: ${updateError.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 })
  }
}