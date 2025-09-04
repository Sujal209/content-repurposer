'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { clearAuthStorage, forceAuthReset } from '@/lib/auth-recovery'

interface RateLimitEvent extends CustomEvent {
  detail: {
    message: string
    action: 'wait' | 'recovery'
    recovery?: () => void
  }
}

export function AuthRecoveryHandler() {
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertAction, setAlertAction] = useState<'wait' | 'recovery'>('wait')
  const [countdown, setCountdown] = useState(30)
  const [recoveryFunction, setRecoveryFunction] = useState<(() => void) | null>(null)

  useEffect(() => {
    const handleRateLimit = (event: RateLimitEvent) => {
      setAlertMessage(event.detail.message)
      setAlertAction(event.detail.action)
      setShowAlert(true)
      
      if (event.detail.recovery) {
        setRecoveryFunction(() => event.detail.recovery)
      }
      
      // Start countdown for wait action
      if (event.detail.action === 'wait') {
        setCountdown(30)
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer)
              setShowAlert(false)
              return 30
            }
            return prev - 1
          })
        }, 1000)
      }
    }

    // Listen for auth rate limit events
    window.addEventListener('auth-rate-limit', handleRateLimit as EventListener)
    
    return () => {
      window.removeEventListener('auth-rate-limit', handleRateLimit as EventListener)
    }
  }, [])

  const handleManualRecovery = () => {
    console.log('🔧 Manual auth recovery initiated')
    clearAuthStorage()
    setShowAlert(false)
    
    // Reload page after a short delay
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  const handleForceReset = () => {
    if (recoveryFunction) {
      recoveryFunction()
    } else {
      forceAuthReset()
    }
    setShowAlert(false)
  }

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-md"
          >
            <Card className="shadow-2xl border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Authentication Issue Detected
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {alertMessage}
                    </p>
                    
                    {alertAction === 'wait' && (
                      <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-yellow-800">
                          Auto-dismissing in {countdown} seconds...
                        </p>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {alertAction === 'recovery' ? (
                        <Button
                          onClick={handleForceReset}
                          className="flex items-center gap-2"
                          variant="default"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Reset Authentication
                        </Button>
                      ) : (
                        <Button
                          onClick={handleManualRecovery}
                          className="flex items-center gap-2"
                          variant="outline"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Clear Session & Retry
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => setShowAlert(false)}
                        variant="ghost"
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Export a hook for manual auth recovery
export function useAuthRecovery() {
  const clearSession = () => {
    console.log('🔧 Manual session clear initiated')
    clearAuthStorage()
    window.location.reload()
  }
  
  const resetAuth = () => {
    console.log('🔄 Manual auth reset initiated')
    forceAuthReset()
  }
  
  return {
    clearSession,
    resetAuth
  }
}
