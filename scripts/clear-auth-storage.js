/**
 * Browser Console Script - Copy and paste this into your browser's console
 * to immediately clear all Supabase authentication storage and stop 429 errors
 */

(function() {
  console.log('🧹 Clearing all authentication storage...')
  
  // Clear localStorage
  const localKeysToRemove = Object.keys(localStorage).filter(key => 
    key.startsWith('sb-') || 
    key.includes('supabase') ||
    key.includes('auth-token') ||
    key.startsWith('auth.')
  )
  
  localKeysToRemove.forEach(key => {
    localStorage.removeItem(key)
    console.log(`Cleared localStorage key: ${key}`)
  })
  
  // Clear sessionStorage
  const sessionKeysToRemove = Object.keys(sessionStorage).filter(key => 
    key.startsWith('sb-') || 
    key.includes('supabase') ||
    key.includes('auth-token')
  )
  
  sessionKeysToRemove.forEach(key => {
    sessionStorage.removeItem(key)
    console.log(`Cleared sessionStorage key: ${key}`)
  })
  
  // Clear cookies
  document.cookie.split(";").forEach(cookie => {
    const eqPos = cookie.indexOf("=")
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
    if (name.startsWith('sb-') || name.includes('auth')) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`
      console.log(`Cleared cookie: ${name}`)
    }
  })
  
  console.log('✅ Auth storage cleanup completed!')
  console.log('🔄 Refreshing page to start fresh...')
  
  // Reload page after a short delay
  setTimeout(() => {
    window.location.reload()
  }, 1000)
})();
