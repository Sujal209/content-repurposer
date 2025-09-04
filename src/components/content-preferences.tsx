'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Wand2, 
  Brain,
  Target,
  Palette,
  MessageSquare,
  BookOpen,
  Video,
  Mic,
  FileText,
  Sparkles,
  Zap,
  Repeat,
  Check,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { type ContentType, type Tone, detectContentType, detectTone } from '@/lib/prompt-engine'

export interface ContentPreferences {
  contentType?: ContentType
  tone?: Tone
}

interface ContentPreferencesProps {
  preferences: ContentPreferences
  onPreferencesChange: (preferences: ContentPreferences) => void
  selectedFormats: string[]
  inputContent: string
}

const contentTypeOptions = [
  { 
    value: 'blog', 
    label: 'Blog Post', 
    icon: FileText, 
    description: 'Long-form article or blog content',
    color: 'from-[#0B67FF] to-[#0052CC]',
    bgColor: 'bg-[#E6F0FF]',
    borderColor: 'border-[#CCE0FF]'
  },
  { 
    value: 'video_script', 
    label: 'Video Script', 
    icon: Video, 
    description: 'Video content or screenplay',
    color: 'from-[#EF4444] to-[#DC2626]',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  { 
    value: 'podcast_transcript', 
    label: 'Podcast', 
    icon: Mic, 
    description: 'Audio content or transcript',
    color: 'from-[#16A34A] to-[#15803D]',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  { 
    value: 'general', 
    label: 'General', 
    icon: FileText, 
    description: 'Other types of content',
    color: 'from-[#94A3B8] to-[#64748B]',
    bgColor: 'bg-[#F1F5F9]',
    borderColor: 'border-[#E2E8F0]'
  }
]

const toneOptions = [
  { 
    value: 'casual', 
    label: 'Casual', 
    icon: MessageSquare, 
    emoji: '😊',
    description: 'Friendly, relaxed, conversational',
    color: 'from-[#00C2A8] to-[#009B86]',
    bgColor: 'bg-[#E6FAF7]'
  },
  { 
    value: 'professional', 
    label: 'Professional', 
    icon: Target, 
    emoji: '💼',
    description: 'Authoritative, business-focused',
    color: 'from-[#0B67FF] to-[#0052CC]',
    bgColor: 'bg-[#E6F0FF]'
  },
  { 
    value: 'educational', 
    label: 'Educational', 
    icon: BookOpen, 
    emoji: '🎓',
    description: 'Informative, teaching-focused',
    color: 'from-[#00C2A8] to-[#009B86]',
    bgColor: 'bg-[#E6FAF7]'
  },
  { 
    value: 'conversational', 
    label: 'Conversational', 
    icon: MessageSquare, 
    emoji: '💬',
    description: 'Direct, personal, intimate',
    color: 'from-[#16A34A] to-[#15803D]',
    bgColor: 'bg-green-50'
  }
]

export default function ContentPreferences({ preferences, onPreferencesChange, selectedFormats, inputContent }: ContentPreferencesProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [autoDetected, setAutoDetected] = useState<{ contentType?: ContentType; tone?: Tone }>({})  
  
  // Check for reduced motion preference and maintain as a ref to prevent re-renders
  const prefersReducedMotion = useRef(false)
  
  // Track current active option for keyboard navigation
  const [activeSection, setActiveSection] = useState<'contentType' | 'tone' | 'presets' | null>(null)
  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState<number>(-1)
  
  // Refs for keyboard navigation
  const contentTypeOptionsRef = useRef<HTMLDivElement>(null)
  const toneOptionsRef = useRef<HTMLDivElement>(null)
  const presetsRef = useRef<HTMLDivElement>(null)
  
  // Initialize reduced motion preference
  useEffect(() => {
    prefersReducedMotion.current = typeof window !== 'undefined' && 
      (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      localStorage.getItem('reduce-motion') === 'true')
  }, [])
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, section: 'contentType' | 'tone' | 'presets', options: any[], currentIndex: number) => {
    const lastIndex = options.length - 1
    let newIndex = currentIndex
    
    switch (e.key) {
      case 'ArrowRight':
        newIndex = currentIndex < lastIndex ? currentIndex + 1 : 0
        e.preventDefault()
        break
      case 'ArrowLeft':
        newIndex = currentIndex > 0 ? currentIndex - 1 : lastIndex
        e.preventDefault()
        break
      case 'ArrowDown':
        if (section === 'contentType') {
          setActiveSection('tone')
          setKeyboardFocusIndex(0)
          setTimeout(() => toneOptionsRef.current?.querySelector('button')?.focus(), 50)
        } else if (section === 'tone') {
          setActiveSection('presets')
          setKeyboardFocusIndex(0)
          setTimeout(() => presetsRef.current?.querySelector('button')?.focus(), 50)
        }
        e.preventDefault()
        break
      case 'ArrowUp':
        if (section === 'tone') {
          setActiveSection('contentType')
          setKeyboardFocusIndex(0)
          setTimeout(() => contentTypeOptionsRef.current?.querySelector('button')?.focus(), 50)
        } else if (section === 'presets') {
          setActiveSection('tone')
          setKeyboardFocusIndex(0)
          setTimeout(() => toneOptionsRef.current?.querySelector('button')?.focus(), 50)
        }
        e.preventDefault()
        break
    }
    
    if (newIndex !== currentIndex && e.key.startsWith('Arrow')) {
      setKeyboardFocusIndex(newIndex)
      const buttons = e.currentTarget.querySelectorAll('button')
      if (buttons && buttons[newIndex]) {
        buttons[newIndex].focus()
      }
    }
  }

  // Reset component state when preferences are cleared externally
  React.useEffect(() => {
    if (Object.keys(preferences).length === 0 && inputContent === '') {
      setIsExpanded(false)
      setAutoDetected({})
    }
  }, [preferences, inputContent])

  // Auto-detect content type and tone when content changes
  React.useEffect(() => {
    if (inputContent.length > 100) {
      const detectedType = detectContentType(inputContent)
      const detectedTone = detectTone(inputContent)
      setAutoDetected({ contentType: detectedType, tone: detectedTone })
    } else {
      setAutoDetected({})
    }
  }, [inputContent])

  const updatePreferences = (updates: Partial<ContentPreferences>) => {
    onPreferencesChange({ ...preferences, ...updates })
  }


  const applyAutoDetected = (type: 'contentType' | 'tone') => {
    if (type === 'contentType' && autoDetected.contentType) {
      updatePreferences({ contentType: autoDetected.contentType })
    } else if (type === 'tone' && autoDetected.tone) {
      updatePreferences({ tone: autoDetected.tone })
    }
  }

  return (
    <Card 
      className="w-full bg-gradient-to-br from-white via-[#E6F0FF]/30 to-purple-50/30 border border-[#CCE0FF] shadow-lg hover:shadow-xl hover:border-[#0B67FF]/30 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#0B67FF]/20 focus-within:ring-offset-2"
      role="region"
      aria-label="Content Preferences Configuration"
      style={{ maxWidth: '100%', overflowX: 'hidden' }}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B67FF] to-purple-600 flex items-center justify-center shadow-lg" aria-hidden="true">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl bg-gradient-to-r from-[#0B67FF] to-purple-600 bg-clip-text text-transparent">
                Content Preferences
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs bg-gradient-to-r from-[#E6F0FF] to-purple-100 text-[#0B67FF] border-0">
                  <Sparkles className="h-3 w-3 mr-1" aria-hidden="true" />
                  AI-Powered
                </Badge>
                {autoDetected.contentType && (
                  <Badge variant="outline" className="text-xs text-[#16A34A] border-green-200">
                    <Brain className="h-3 w-3 mr-1" aria-hidden="true" />
                    Auto-detected
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted hover:text-foreground hover:bg-[#E6F0FF] hover:shadow-md transition-all duration-300 rounded-xl px-3 sm:px-4 py-2 focus:ring-2 focus:ring-[#0B67FF] focus:ring-offset-2 focus:outline-none"
            aria-expanded={isExpanded}
            aria-controls="content-preferences-panel"
            aria-label={isExpanded ? "Hide advanced content preferences" : "Show advanced content preferences"}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Less Options</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">More Options</span>
              </>
            )}
          </Button>
        </div>
        <CardDescription className="text-sm sm:text-base text-gray-600">
          Fine-tune how your content is transformed for each platform with AI-powered insights
        </CardDescription>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="content-preferences-panel"
            initial={prefersReducedMotion.current ? undefined : { height: 0, opacity: 0 }}
            animate={prefersReducedMotion.current ? undefined : { height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion.current ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: prefersReducedMotion.current ? 0 : 0.2 }}
            className="overflow-hidden"
            role="group"
            aria-label="Advanced content preferences options"
          >
            <CardContent className="space-y-8 pt-6">
              
              {/* Content Type Selection */}
              <motion.div 
                initial={prefersReducedMotion.current ? false : { opacity: 0, y: 10 }}
                animate={prefersReducedMotion.current ? false : { opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion.current ? 0 : 0.2 }}
                className="space-y-4 md:space-y-6"
                role="group"
                aria-labelledby="content-type-label"
              >
                <div className="flex items-center justify-between">
                  <label id="content-type-label" className="text-base sm:text-lg font-semibold flex items-center gap-3 text-heading">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B67FF] to-[#0052CC] flex items-center justify-center" aria-hidden="true">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    Content Type
                  </label>
                  {autoDetected.contentType && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyAutoDetected('contentType')}
                        className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-[#16A34A] hover:from-green-100 hover:to-emerald-100 hover:shadow-lg hover:border-green-300 transition-all duration-300 focus:ring-2 focus:ring-[#16A34A] focus:ring-offset-2"
                        aria-label={`Apply auto-detected content type: ${autoDetected.contentType}`}
                      >
                        <Wand2 className="h-3 w-3 mr-2" />
                        Use Detected: {autoDetected.contentType}
                      </Button>
                    </motion.div>
                  )}
                </div>
                
                {/* Content Type Grid */}
                <div 
                  ref={contentTypeOptionsRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                  role="radiogroup" 
                  aria-labelledby="content-type-label"
                  onKeyDown={(e) => handleKeyDown(e, 'contentType', contentTypeOptions, keyboardFocusIndex)}
                >
                  {contentTypeOptions.map((option, index) => {
                    const isSelected = preferences.contentType === option.value
                    return (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        whileHover={prefersReducedMotion.current ? undefined : { y: -2 }}
                        whileTap={prefersReducedMotion.current ? undefined : { scale: 0.98 }}
                        onClick={() => {
                          updatePreferences({ contentType: option.value as ContentType })
                          // Announce selection to screen readers
                          const announcement = document.getElementById('preferences-live-region')
                          if (announcement) {
                            announcement.textContent = `Selected content type: ${option.label}`
                          }
                        }}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mobile-touch-target ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/30'
                            : 'border-border hover:border-primary/50 hover:shadow-md hover:ring-2 hover:ring-primary/20'
                        }`}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${option.label}: ${option.description}`}
                        tabIndex={isSelected ? 0 : -1}
                      >
                        <div className="relative z-10">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center mb-3 mx-auto shadow-sm ${isSelected ? 'shadow-xl ring-2 ring-white' : 'group-hover:shadow-lg group-hover:ring-2 group-hover:ring-white/50'} transition-all duration-300 group-hover:scale-110`}>
                            <option.icon className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="font-semibold text-sm text-heading mb-1">{option.label}</h3>
                          <p className="text-xs text-gray-600 leading-relaxed">{option.description}</p>
                          {isSelected && (
                            <div
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                              aria-hidden="true"
                            >
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <div
                            className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-xl"
                          />
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>

              {/* Tone Selection */}
              <motion.div 
                initial={prefersReducedMotion.current ? false : { opacity: 0, y: 10 }}
                animate={prefersReducedMotion.current ? false : { opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion.current ? 0 : 0.2 }}
                className="space-y-4 md:space-y-6 mt-8"
                role="group"
                aria-labelledby="tone-label"
              >
                <div className="flex items-center justify-between">
                  <label id="tone-label" className="text-base sm:text-lg font-semibold flex items-center gap-3 text-heading">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center" aria-hidden="true">
                      <Palette className="h-4 w-4 text-white" />
                    </div>
                    Content Tone
                  </label>
                  {autoDetected.tone && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyAutoDetected('tone')}
                        className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-[#16A34A] hover:from-green-100 hover:to-emerald-100 hover:shadow-lg hover:border-green-300 transition-all duration-300 focus:ring-2 focus:ring-[#16A34A] focus:ring-offset-2"
                        aria-label={`Apply auto-detected tone: ${autoDetected.tone}`}
                      >
                        <Wand2 className="h-3 w-3 mr-2" />
                        Use Detected: {autoDetected.tone}
                      </Button>
                    </motion.div>
                  )}
                </div>
                <div 
                  ref={toneOptionsRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" 
                  role="radiogroup" 
                  aria-labelledby="tone-label"
                  onKeyDown={(e) => handleKeyDown(e, 'tone', toneOptions, keyboardFocusIndex)}
                >
                  {toneOptions.map((tone, index) => {
                    const isSelected = preferences.tone === tone.value
                    return (
                      <motion.button
                        key={tone.value}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        whileHover={prefersReducedMotion.current ? undefined : { y: -2 }}
                        whileTap={prefersReducedMotion.current ? undefined : { scale: 0.98 }}
                        onClick={() => {
                          updatePreferences({ tone: tone.value as Tone })
                          // Announce selection to screen readers
                          const announcement = document.getElementById('preferences-live-region')
                          if (announcement) {
                            announcement.textContent = `Selected content tone: ${tone.label}`
                          }
                        }}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 mobile-touch-target ${
                          isSelected
                            ? 'border-secondary bg-secondary/10 shadow-md ring-2 ring-secondary/30'
                            : 'border-border hover:border-secondary/50 hover:shadow-md hover:ring-2 hover:ring-secondary/20'
                        }`}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${tone.label}: ${tone.description}`}
                        tabIndex={isSelected ? 0 : -1}
                      >
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tone.color} flex items-center justify-center shadow-sm ${isSelected ? 'shadow-lg ring-2 ring-white' : 'group-hover:shadow-lg group-hover:ring-2 group-hover:ring-white/50'} transition-all duration-300 group-hover:scale-110`}>
                              <tone.icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-2xl">{tone.emoji}</span>
                          </div>
                          <h3 className="font-semibold text-sm text-heading mb-1">{tone.label}</h3>
                          <p className="text-xs text-gray-600 leading-relaxed">{tone.description}</p>
                          {isSelected && (
                            <div
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-secondary flex items-center justify-center"
                            >
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <div
                            className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-xl"
                          />
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>


              {/* AI Detection Results */}
              {autoDetected.contentType && autoDetected.tone && inputContent.length > 100 && (
                <div 
                  className="p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 hover:bg-gradient-to-br hover:from-slate-100 hover:to-gray-100 transition-all duration-200 group relative overflow-hidden mt-8"
                >
                  <h4 className="font-bold text-heading mb-4 flex items-center gap-3 ">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <span style={{ color: 'black' }}>AI Content Analysis</span>
                    <Badge className="bg-green-100 text-green-700 border-0">
                      <Check className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:ring-2 group-hover:ring-white/50 transition-all duration-300 group-hover:scale-110">
                          <FileText className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">Content Type</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 border-0 text-sm px-3 py-1">
                        {autoDetected.contentType?.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-500 flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:ring-2 group-hover:ring-white/50 transition-all duration-300 group-hover:scale-110">
                          <Palette className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">Tone Style</span>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700 border-0 text-sm px-3 py-1">
                        {autoDetected.tone}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Presets */}
              <div
                className="space-y-4 mt-8"
                ref={presetsRef}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <label className="text-lg font-semibold text-heading">
                    Quick Presets
                  </label>
                  <Badge variant="outline" className="text-xs text-indigo-600 border-indigo-200">
                    One-click setup
                  </Badge>
                </div>
                <div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  onKeyDown={(e) => handleKeyDown(e, 'presets', [{ config: {} }, { config: {} }, { config: {} }], keyboardFocusIndex)}
                >
                  {[
                    {
                      icon: '📊',
                      title: 'Business Content',
                      description: 'Professional, data-driven content',
                      gradient: 'from-blue-500 to-indigo-600',
                      bgGradient: 'from-blue-50 to-indigo-50',
                      borderColor: 'border-blue-200',
                      config: {
                        contentType: 'blog' as ContentType,
                        tone: 'professional' as Tone
                      }
                    },
                    {
                      icon: '🎯',
                      title: 'Viral Content',
                      description: 'Engaging, shareable social content',
                      gradient: 'from-pink-500 to-rose-600',
                      bgGradient: 'from-pink-50 to-rose-50',
                      borderColor: 'border-pink-200',
                      config: {
                        contentType: 'general' as ContentType,
                        tone: 'casual' as Tone
                      }
                    },
                    {
                      icon: '🎓',
                      title: 'Educational',
                      description: 'Informative, teaching-focused',
                      gradient: 'from-emerald-500 to-green-600',
                      bgGradient: 'from-emerald-50 to-green-50',
                      borderColor: 'border-emerald-200',
                      config: {
                        contentType: 'blog' as ContentType,
                        tone: 'educational' as Tone
                      }
                    }
                  ].map((preset, index) => (
                    <button
                      key={preset.title}
                      onClick={() => {
                        updatePreferences(preset.config)
                        // Announce selection to screen readers
                        const announcement = document.getElementById('preferences-live-region')
                        if (announcement) {
                          announcement.textContent = `Applied preset: ${preset.title}`
                        }
                      }}
                      className={`p-4 rounded-xl border-2 ${preset.borderColor} bg-gradient-to-br ${preset.bgGradient} hover:shadow-md hover:ring-2 hover:ring-current/20 transition-all duration-200 text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mobile-touch-target`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${preset.gradient} flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:ring-2 group-hover:ring-white/50 transition-all duration-300 group-hover:scale-110`}>
                          <span className="text-xl">{preset.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-bold" style={{ color: '#111827' }}>{preset.title}</h3>
                          <p className="text-xs" style={{ color: '#6B7280' }}>{preset.description}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-lg">
                        Click to apply preset
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset to Defaults */}
              <div 
                className="pt-6 mt-6 border-t border-blue-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Info className="h-4 w-4" />
                    <span>All settings will be applied to content generation</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      updatePreferences({
                        contentType: 'general',
                        tone: 'conversational'
                      })
                      // Announce to screen readers
                      const announcement = document.getElementById('preferences-live-region')
                      if (announcement) {
                        announcement.textContent = `Reset preferences to defaults`
                      }
                    }}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 hover:shadow-md rounded-xl px-4 py-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <Repeat className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </div>

            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Live region for accessibility announcements */}
      <div 
        id="preferences-live-region" 
        className="sr-only" 
        aria-live="polite"
        aria-atomic="true"
      ></div>
    </Card>
  )
}
