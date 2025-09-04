/**
 * Immediate Auth Storage Cleanup Script
 * 
 * This script will clear all Supabase authentication storage that might be
 * causing 429 rate limiting errors. Run this in your browser console
 * on your auth page to immediately fix the issue.
 */

function clearAllAuthStorage() {
  console.log('🧹 Starting comprehensive auth storage cleanup...')
  
  // Clear localStorage
  const localStorageKeysToRemove = Object.keys(localStorage).filter(key => 
    key.startsWith('sb-') || 
    key.includes('supabase') ||
    key.includes('auth-token') ||
    key.startsWith('auth.') ||
    key.includes('session') ||
    key.includes('user')
  )
  
  console.log(`Found ${localStorageKeysToRemove.length} localStorage keys to remove:`, localStorageKeysToRemove)
  
  localStorageKeysToRemove.forEach(key => {
    localStorage.removeItem(key)
    console.log(`✅ Cleared localStorage key: ${key}`)
  })
  
  // Clear sessionStorage
  const sessionStorageKeysToRemove = Object.keys(sessionStorage).filter(key => 
    key.startsWith('sb-') || 
    key.includes('supabase') ||
    key.includes('auth-token') ||
    key.startsWith('auth.') ||
    key.includes('session')
  )
  
  console.log(`Found ${sessionStorageKeysToRemove.length} sessionStorage keys to remove:`, sessionStorageKeysToRemove)
  
  sessionStorageKeysToRemove.forEach(key => {
    sessionStorage.removeItem(key)
    console.log(`✅ Cleared sessionStorage key: ${key}`)
  })
  
  // Clear all cookies
  const cookies = document.cookie.split(';')
  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
    if (name.startsWith('sb-') || 
        name.includes('supabase') || 
        name.includes('auth') ||
        name.includes('session')) {
      // Clear for all possible paths and domains
      const domains = ['', `.${window.location.hostname}`, window.location.hostname]
      const paths = ['/', '/auth', '/dashboard']
      
      domains.forEach(domain => {
        paths.forEach(path => {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};domain=${domain};`
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};`
        })
      })
      console.log(`✅ Cleared cookie: ${name}`)
    }
  })
  
  // Clear IndexedDB (Supabase might use this)
  if ('indexedDB' in window) {
    indexedDB.databases().then(databases => {
      databases.forEach(db => {
        if (db.name.includes('supabase') || db.name.includes('auth')) {
          indexedDB.deleteDatabase(db.name)
          console.log(`✅ Cleared IndexedDB: ${db.name}`)
        }
      })
    }).catch(e => console.log('Could not clear IndexedDB:', e))
  }
  
  console.log('🎉 Auth storage cleanup completed!')
  console.log('🔄 Refreshing page in 2 seconds...')
  
  // Reload the page after a short delay
  setTimeout(() => {
    window.location.reload()
  }, 2000)
}

// Auto-run the cleanup
clearAllAuthStorage()

console.log(`
🚀 AUTH STORAGE CLEARED! 

This script has removed all authentication-related data from:
- localStorage
- sessionStorage  
- cookies
- IndexedDB (if any)

The page will reload automatically. After reload, try logging in again.

If you still experience issues, you can:
1. Wait 5-10 minutes for Supabase rate limits to reset
2. Try using a different email temporarily
3. Use the "Clear Session & Retry" button that now appears on errors
`)
