import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import React, { forwardRef } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 active:scale-95 relative overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-surface border border-primary text-white hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] focus-visible:ring-primary cyber-button',
        destructive:
          'bg-surface border border-red-500 text-red-100 hover:bg-red-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] focus-visible:ring-red-500',
        outline:
          'border border-border bg-surface/50 text-gray-100 hover:bg-surface hover:border-primary/50 focus-visible:ring-primary',
        secondary:
          'bg-surface border border-secondary text-pink-100 hover:bg-secondary/20 hover:shadow-[0_0_20px_rgba(255,0,128,0.3)] focus-visible:ring-secondary',
        ghost: 'text-gray-100 hover:bg-surface/50 hover:text-white focus-visible:ring-primary',
        link: 'text-cyan-300 underline-offset-4 hover:underline hover:shadow-[0_0_10px_rgba(0,212,255,0.2)] focus-visible:ring-primary hover:text-white',
        gradient:
          'bg-gradient-to-r from-primary via-secondary to-accent text-black font-bold shadow-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] focus-visible:ring-primary animate-cyber-glow',
        cyber:
          'bg-transparent border-2 border-primary text-white hover:bg-primary hover:text-black hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] focus-visible:ring-primary cyber-button font-bold uppercase tracking-wider',
      },
      size: {
        default: 'h-11 px-4 py-2 min-w-[44px]',
        sm: 'h-9 px-3 text-xs min-w-[44px]',
        lg: 'h-12 px-8 text-base min-w-[48px]',
        xl: 'h-14 px-10 text-lg min-w-[56px]',
        icon: 'h-11 w-11 min-w-[44px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  children?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>
      return React.cloneElement(child, {
        className: cn(buttonVariants({ variant, size, className }), child.props.className || ''),
        ...props,
        ref,
      } as any)
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
