'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DropdownOption {
  value: string
  label: string
  icon?: React.ReactNode
  color?: string
}

interface CustomDropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function CustomDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select an option',
  className = ''
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition()
    }
    setIsOpen(!isOpen)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen(!isOpen)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const dropdownMenu = mounted && isOpen && dropdownPosition.width > 0 ? (
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        zIndex: 999999,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        background: '#0f172a',
        border: '1px solid rgba(148, 163, 184, 0.3)',
        backdropFilter: 'blur(16px)'
      }}
      role="listbox"
    >
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          onClick={() => {
            onChange(option.value)
            setIsOpen(false)
          }}
          style={{
            width: '100%',
            padding: '12px 16px',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.15s ease',
            fontSize: '14px',
            fontWeight: '500',
            background: value === option.value ? 'rgba(0, 212, 255, 0.15)' : 'transparent',
            color: value === option.value ? '#00d4ff' : '#e2e8f0',
            border: 'none',
            cursor: 'pointer',
            borderTop: index > 0 ? '1px solid rgba(148, 163, 184, 0.1)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (value !== option.value) {
              e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)'
              e.currentTarget.style.color = '#ffffff'
            }
          }}
          onMouseLeave={(e) => {
            if (value !== option.value) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#e2e8f0'
            }
          }}
          role="option"
          aria-selected={value === option.value}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {option.icon && (
              <span style={{ fontSize: '18px', lineHeight: 1 }}>{option.icon}</span>
            )}
            <span>{option.label}</span>
          </div>
          {value === option.value && (
            <Check style={{ width: '16px', height: '16px', color: '#00d4ff' }} />
          )}
        </button>
      ))}
    </div>
  ) : null

  return (
    <>
      <div className={`relative ${className}`}>
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          style={{
            background: selectedOption?.color ? undefined : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            color: selectedOption?.color ? '#ffffff' : '#f1f5f9',
            minWidth: '160px',
            padding: '0.75rem 3rem 0.75rem 1rem',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            position: 'relative',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.15)'
          }}
          className={`
            hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-cyan-500/50
            ${selectedOption?.color || ''}
          `}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {selectedOption?.icon && (
              <span style={{ fontSize: '1.125rem', lineHeight: 1 }}>{selectedOption.icon}</span>
            )}
            <span>{selectedOption?.label || placeholder}</span>
          </div>
          <ChevronDown 
            style={{
              position: 'absolute',
              right: '0.75rem',
              width: '1rem',
              height: '1rem',
              transition: 'transform 0.2s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              color: selectedOption?.color ? 'rgba(255, 255, 255, 0.8)' : '#94a3b8'
            }}
          />
        </button>
      </div>
      
      <AnimatePresence>
        {mounted && isOpen && dropdownPosition.width > 0 && createPortal(
          dropdownMenu,
          document.body
        )}
      </AnimatePresence>
    </>
  )
}
