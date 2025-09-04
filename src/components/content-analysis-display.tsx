'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Brain, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Hash,
  MessageSquare,
  Clock,
  Eye,
  Lightbulb,
  ThumbsUp
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { ContentAnalysis } from '@/lib/content-analysis'

interface ContentAnalysisDisplayProps {
  analysis: ContentAnalysis | null
  className?: string
  isLoading?: boolean
  error?: string
}

export default function ContentAnalysisDisplay({ analysis, className = '', isLoading = false, error }: ContentAnalysisDisplayProps) {
  // Better color contrast for accessibility
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-800 dark:text-green-300'
    if (score >= 60) return 'text-orange-800 dark:text-orange-300'
    return 'text-red-800 dark:text-red-300'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-600'
    if (score >= 60) return 'bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-600'
    return 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-600'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return '#16A34A'
    if (score >= 60) return '#EA580C'
    return '#DC2626'
  }

  // Tooltip component for metrics
  const MetricTooltip = ({ title, description, value, label }: { title: string, description: string, value: number | string, label: string }) => (
    <div 
      className="group relative text-center p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-help"
      role="tooltip"
      aria-label={`${title}: ${description}`}
    >
      <div className="text-2xl font-bold text-gray-900" style={{ color: 'rgb(17, 24, 39)' }}>{value}</div>
      <div className="text-xs font-medium text-gray-600 mt-1">{label}</div>
      
      {/* Tooltip content */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
        <div className="font-medium">{title}</div>
        <div className="text-gray-300">{description}</div>
        {/* Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  )

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Analysis Failed</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        <Card className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B67FF] to-purple-600 flex items-center justify-center shadow-sm">
                <Brain className="h-4 w-4 text-white" />
              </div>
              Content Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Skeleton loading */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-white border border-gray-200">
                  <div className="w-16 h-8 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                  <div className="w-12 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (!analysis) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B67FF] to-purple-600 flex items-center justify-center shadow-sm">
              <Brain className="h-4 w-4 text-white" />
            </div>
            Content Analysis
          </CardTitle>
          <CardDescription className="text-gray-600">
            AI-powered insights about your content quality and engagement potential
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricTooltip
              title="Word Count"
              description="Total number of words in your content"
              value={analysis.metrics.wordCount}
              label="Words"
            />
            <MetricTooltip
              title="Reading Time"
              description="Estimated time to read at 200 words per minute"
              value={analysis.metrics.readingTimeMinutes}
              label="Min Read"
            />
            <MetricTooltip
              title="Sentence Count"
              description="Total number of sentences in your content"
              value={analysis.metrics.sentenceCount}
              label="Sentences"
            />
            <MetricTooltip
              title="Paragraph Count"
              description="Number of paragraphs that structure your content"
              value={analysis.metrics.paragraphCount}
              label="Paragraphs"
            />
          </div>



          {/* Hashtag Suggestions */}
          {analysis.hashtags.suggested.length > 0 && (
            <div className="p-5 rounded-xl border-2 border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#E6F0FF] flex items-center justify-center">
                  <Hash className="h-4 w-4 text-[#0B67FF]" />
                </div>
                <span className="font-semibold text-gray-900">Suggested Hashtags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.hashtags.suggested.slice(0, 8).map((hashtag, index) => (
                  <Badge key={index} variant="outline" className="text-sm font-medium border-[#CCE0FF] text-[#0B67FF] bg-[#E6F0FF]/30 hover:bg-[#E6F0FF] transition-colors">
                    {hashtag}
                  </Badge>
                ))}
                {analysis.hashtags.suggested.length > 8 && (
                  <Badge variant="secondary" className="text-sm font-medium">
                    +{analysis.hashtags.suggested.length - 8} more
                  </Badge>
                )}
              </div>
            </div>
          )}


        </CardContent>
      </Card>
    </motion.div>
  )
}
