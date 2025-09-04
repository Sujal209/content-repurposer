import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 active:scale-95 relative overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-surface border border-primary text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] focus-visible:ring-primary cyber-button',
        destructive:
          'bg-surface border border-red-500 text-red-400 hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] focus-visible:ring-red-500',
        outline:
          'border border-border bg-surface/50 text-foreground hover:bg-surface hover:border-primary/50 focus-visible:ring-primary',
        secondary:
          'bg-surface border border-secondary text-secondary hover:bg-secondary/10 hover:shadow-[0_0_20px_rgba(255,0,128,0.3)] focus-visible:ring-secondary',
        ghost: 'text-foreground hover:bg-surface/50 hover:text-primary focus-visible:ring-primary',
        link: 'text-primary underline-offset-4 hover:underline hover:shadow-[0_0_10px_rgba(0,212,255,0.2)] focus-visible:ring-primary',
        gradient:
          'bg-gradient-to-r from-primary via-secondary to-accent text-black font-bold shadow-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] focus-visible:ring-primary animate-cyber-glow',
        cyber:
          'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] focus-visible:ring-primary cyber-button font-bold uppercase tracking-wider',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
