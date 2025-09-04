import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  errorMessage?: string
  isLoading?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessage, isLoading, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-lg border bg-surface/50 backdrop-blur-sm px-3 py-2 text-sm text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300',
              // Default styles
              'border-border hover:border-primary/50 focus-visible:border-primary focus-visible:shadow-[0_0_15px_rgba(0,212,255,0.3)]',
              // Error styles
              error && 'border-red-500/50 focus-visible:border-red-500 focus-visible:shadow-[0_0_15px_rgba(239,68,68,0.3)] bg-red-500/5',
              // Loading styles
              isLoading && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        {error && errorMessage && (
          <p className="mt-1 text-sm text-red-400 animate-fade-in">
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
