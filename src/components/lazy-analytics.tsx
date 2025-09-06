'use client'

import { useEffect } from 'react'

export default function LazyAnalytics() {
  useEffect(() => {
    // Defer analytics loading
    const timer = setTimeout(() => {
      // Load Vercel Analytics
      const script = document.createElement('script')
      script.src = '/_vercel/insights/script.js'
      script.defer = true
      document.head.appendChild(script)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return null
}