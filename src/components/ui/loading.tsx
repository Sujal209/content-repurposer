import { motion } from 'framer-motion'
import { Loader2, Sparkles } from 'lucide-react'

interface LoadingProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Loading({ text = 'Loading...', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center gap-2"
    >
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      <span className="text-gray-600">{text}</span>
    </motion.div>
  )
}

export function FullPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold gradient-text mb-2">RepurposeMate</h2>
        <Loading text="Loading your workspace..." />
      </motion.div>
    </div>
  )
}
