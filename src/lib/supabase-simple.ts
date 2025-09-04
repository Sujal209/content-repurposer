/**
 * Simplified Supabase Client - Emergency Mode
 * 
 * This client disables all automatic token refresh and persistence
 * to prevent 429 rate limiting issues during development
 */

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let simpleClient: SupabaseClient | null = null

export const createSimpleClient = () => {
  if (!simpleClient) {
    console.log('🔧 Creating simplified Supabase client (no auto-refresh)')
    
    simpleClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          // Disable all automatic features that could cause rate limiting
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
        global: {
          headers: {
            'X-Client-Info': 'content-repurposer-simple/1.0.0',
            'Cache-Control': 'no-cache'
          }
        },
        // Disable realtime to prevent extra connections
        realtime: {
          params: {
            eventsPerSecond: 1
          }
        }
      }
    )
    
    // Completely disable the refresh mechanism
    if (simpleClient && (simpleClient as any)._refreshAccessToken) {
      (simpleClient as any)._refreshAccessToken = async () => {
        console.log('🚫 Token refresh disabled in simple mode')
        return null
      }
    }
    
    console.log('✅ Simple client created successfully')
  }
  
  return simpleClient
}

// Export a reset function
export const resetSimpleClient = () => {
  if (simpleClient) {
    console.log('🔄 Resetting simple client')
    simpleClient = null
  }
}
