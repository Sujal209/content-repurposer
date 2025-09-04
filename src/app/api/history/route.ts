import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-utils'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  console.log('History API called')
  try {
    // 1. Authenticate user
    console.log('Checking authentication...')
    const { user, error } = await getAuthenticatedUser()
    if (error || !user) {
      console.log('Authentication failed:', error)
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    console.log('User authenticated:', user.id)

    // 2. Get query parameters
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform') || 'all'
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'date'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    // 3. Create Supabase client
    console.log('Creating Supabase client...')
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      console.error('Failed to create Supabase client')
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // 4. Build query with user isolation - match existing schema
    console.log('Building database query...')
    let query = supabase
      .from('content_history')
      .select('id, title, content, content_type, created_at')
      .eq('user_id', user.id) // CRITICAL: Only fetch user's own content

    // 5. Apply platform filter
    if (platform && platform !== 'all') {
      query = query.eq('content_type', platform)
    }

    // 6. Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    // 7. Apply sorting
    const ascending = sortOrder === 'asc'
    if (sortBy === 'title') {
      query = query.order('title', { ascending, nullsFirst: false })
    } else {
      query = query.order('created_at', { ascending })
    }

    // 8. Apply pagination
    query = query.range(offset, offset + limit - 1)

    console.log('Executing database query...')
    // 9. Execute query
    const { data, error: queryError } = await query

    if (queryError) {
      console.error('History query error:', queryError)
      return NextResponse.json({ error: 'Failed to fetch content history', details: queryError.message }, { status: 500 })
    }

    console.log('Query successful, found', data?.length || 0, 'items')

    // 10. Get total count for pagination (simplified)
    const { count: totalCount, error: countError } = await supabase
      .from('content_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (countError) {
      console.warn('Count query error:', countError)
    }

    // 11. Return response with security headers
    return NextResponse.json(
      {
        success: true,
        data: data || [],
        pagination: {
          total: totalCount || 0,
          limit,
          offset,
          hasMore: (totalCount || 0) > offset + limit
        },
        userId: user.id // For debugging/verification
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=60',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY'
        }
      }
    )

  } catch (error) {
    console.error('History API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { user, error } = await getAuthenticatedUser()
    if (error || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // 2. Get item ID from request
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('id')

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    // 3. Create Supabase client
    const supabase = await createServerSupabaseClient()

    // 4. Delete item (with user isolation for security)
    const { error: deleteError } = await supabase
      .from('content_history')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id) // CRITICAL: Only allow deletion of user's own content

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
    }

    // 5. Return success response
    return NextResponse.json(
      { success: true, message: 'Content deleted successfully' },
      {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY'
        }
      }
    )

  } catch (error) {
    console.error('Delete API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
