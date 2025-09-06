export function logError(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    // Log to external service (Sentry, LogRocket, etc.)
    console.error('Production Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server',
    })
  } else {
    console.error('Development Error:', error, context)
  }
}

export function logPerformance(metric: string, value: number, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    console.log('Performance Metric:', {
      metric,
      value,
      context,
      timestamp: new Date().toISOString(),
    })
  }
}