import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            ref={ref}
            {...props}
          />
          <div className={cn(
            'block bg-surface border-2 border-border w-14 h-8 rounded-full transition-all duration-300',
            props.checked && 'bg-primary border-primary',
            className
          )}>
            <div className={cn(
              'dot absolute left-1 top-1 bg-foreground w-6 h-6 rounded-full transition-all duration-300',
              props.checked && 'transform translate-x-6 bg-black'
            )} />
          </div>
        </div>
        {label && (
          <span className="ml-3 text-sm font-medium text-foreground">
            {label}
          </span>
        )}
      </label>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }