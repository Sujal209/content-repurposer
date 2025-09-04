import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, checkRateLimit, sanitizeInput } from '@/lib/auth-utils'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createOpenRouterClient } from '@/lib/openrouter-client'
import { promptEngine, detectContentType, detectTone, type ContentType, type Platform, type Tone } from '@/lib/prompt-engine'
import { analyzeContent, generateImprovementTips, extractTopics, type ContentAnalysis } from '@/lib/content-analysis'

// Enhanced request body interface
interface TransformRequest {
  content: string
  formats: string[]
  preferences?: {
    contentType?: ContentType
    tone?: Tone
    customInstructions?: string
  }
}

export async function POST(request: NextRequest) {
  console.log('🔥 TRANSFORM API CALLED - Starting request processing')
  try {
    // 1. Authentication check
    console.log('🔍 Checking authentication...')
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      console.log('❌ Authentication failed:', authError)
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    console.log('✅ User authenticated:', user.id)

    // 2. Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const rateLimitKey = `transform:${user.id}:${clientIP}`
    const { allowed, remainingAttempts } = checkRateLimit(rateLimitKey, 10, 60 * 60 * 1000) // 10 requests per hour
    
    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + 60 * 60 * 1000).toISOString()
          }
        }
      )
    }

    // 4. Parse and validate request body
    let requestBody
    try {
      requestBody = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { content, formats, preferences = {} } = requestBody as TransformRequest

    // 5. Input validation
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      )
    }

    if (!formats || !Array.isArray(formats) || formats.length === 0) {
      return NextResponse.json(
        { error: 'At least one format must be specified' },
        { status: 400 }
      )
    }

    if (formats.length > 3) {
      return NextResponse.json(
        { error: 'Maximum 3 formats allowed per request' },
        { status: 400 }
      )
    }

    // 6. Sanitize input content
    const sanitizedContent = sanitizeInput(content)
    
    if (sanitizedContent.length < 50) {
      return NextResponse.json(
        { error: 'Content must be at least 50 characters long' },
        { status: 400 }
      )
    }

    if (sanitizedContent.length > 10000) {
      return NextResponse.json(
        { error: 'Content must be less than 10,000 characters' },
        { status: 400 }
      )
    }

    // 7. Validate formats
    const validFormats = ['twitter', 'linkedin', 'instagram']
    const invalidFormats = formats.filter((f: string) => !validFormats.includes(f))
    if (invalidFormats.length > 0) {
      return NextResponse.json(
        { error: `Invalid formats: ${invalidFormats.join(', ')}` },
        { status: 400 }
      )
    }

    // 7.1 Enforce daily plan limits using generation_limits table
    try {
      const supabaseLimits = await createServerSupabaseClient()
      const plan = (user.user_metadata?.plan as 'free' | 'pro' | 'enterprise') || 'free'
      const DAILY_LIMITS: Record<'free' | 'pro' | 'enterprise', number> = {
        free: parseInt(process.env.NEXT_PUBLIC_FREE_DAILY_LIMIT || '3', 10),
        pro: parseInt(process.env.NEXT_PUBLIC_PRO_DAILY_LIMIT || '200', 10),
        enterprise: parseInt(process.env.NEXT_PUBLIC_ENTERPRISE_DAILY_LIMIT || '2000', 10),
      }
      const today = new Date().toISOString().slice(0, 10)

      const { data: existingLimitRow, error: limitSelectError } = await supabaseLimits
        .from('generation_limits')
        .select('count')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle()

      if (limitSelectError && limitSelectError.code !== 'PGRST116') {
        console.warn('generation_limits select error:', limitSelectError)
      }

      const used = existingLimitRow?.count ?? 0
      const units = (Array.isArray(formats) ? formats.length : 1)
      const limit = DAILY_LIMITS[plan]
      const remaining = Math.max(limit - used, 0)

      if (units > remaining) {
        return NextResponse.json(
          {
            error: 'Daily generation limit exceeded',
            plan,
            limit,
            used,
            remaining,
          },
          {
            status: 429,
            headers: {
              'X-Usage-Limit': String(limit),
              'X-Usage-Used': String(used),
              'X-Usage-Remaining': String(remaining),
            },
          },
        )
      }

      // Store for later increment
      ;(request as any)._usageContext = { today, used, units }
    } catch (limitErr) {
      console.warn('Failed to enforce generation limits:', limitErr)
      // Fail-open: proceed, but log the issue
    }

    // 8. Check if OpenRouter API key is configured
    console.log('🔑 Checking OpenRouter API key configuration...')
    console.log('🔑 API key exists:', !!process.env.OPENROUTER_API_KEY)
    console.log('🔑 API key length:', process.env.OPENROUTER_API_KEY?.length || 0)
    
    // FORCE MOCK PATH FOR DEBUGGING - TEMPORARY
    // const FORCE_MOCK_MODE = true
    
    if (!process.env.OPENROUTER_API_KEY) {
      console.warn('🤖 Using mock data path - API key not configured or FORCE_MOCK_MODE enabled')
      const mockTransformations = formats.map((format: string) => ({
        format,
        content: getMockContent(format, sanitizedContent),
        analysis: analyzeContent(sanitizedContent, format as Platform),
        mock: true
      }))

      // 8.1 Persist mock transformations to Supabase
      try {
        const supabase = await createServerSupabaseClient()
        const rows = mockTransformations.map(t => ({
          user_id: user.id,
          title: t.format === 'twitter' ? 'Twitter Thread' : t.format === 'linkedin' ? 'LinkedIn Carousel' : 'Instagram Reels',
          content: t.content,
          content_type: t.format,
          content_analysis: t.analysis ? JSON.stringify(t.analysis) : null,
          created_at: new Date().toISOString(),
        }))
        
        console.log('💾 Saving mock content to database for user:', user.id)
        
        const { data, error } = await supabase.from('content_history').insert(rows).select()
        
        if (error) {
          console.error('Failed to save mock content:', error)
          console.error('Error code:', error.code)
          console.error('Error message:', error.message)
          console.error('Error details:', error.details)
          console.error('Error hint:', error.hint)
          console.error('Full error object:', JSON.stringify(error, null, 2))
          
          // Try to identify the specific issue
          if (error.code === '42P01') {
            console.error('Table does not exist!')
          } else if (error.code === '42703') {
            console.error('Column does not exist!')
          } else if (error.code === '23505') {
            console.error('Duplicate key violation!')
          }
          
          throw new Error(`Database insert failed: ${error.message}`)
        } else {
          console.log('Mock content saved successfully! Generated IDs:', data?.map(d => d.id))
          console.log('Inserted data:', JSON.stringify(data, null, 2))
        }

      // Increment generation_limits counter for today
      console.log('📊 Updating generation limits...')
      const usage = (request as any)._usageContext as { today: string; used: number; units: number } | undefined
      if (usage) {
        console.log('📊 Usage context:', usage)
        const newCount = usage.used + usage.units
        console.log('📊 New count will be:', newCount)
        
        // Try update first
        const { data: row, error: selErr } = await supabase
          .from('generation_limits')
          .select('count')
          .eq('user_id', user.id)
          .eq('date', usage.today)
          .maybeSingle()

        if (row) {
          console.log('📊 Updating existing limit row')
          const { error: updateError } = await supabase
            .from('generation_limits')
            .update({ count: newCount })
            .eq('user_id', user.id)
            .eq('date', usage.today)
          
          if (updateError) {
            console.error('📊 Failed to update generation limits:', updateError)
          } else {
            console.log('📊 Generation limits updated successfully')
          }
        } else {
          console.log('📊 Inserting new limit row')
          const { error: insertError } = await supabase
            .from('generation_limits')
            .insert({ user_id: user.id, date: usage.today, count: newCount })
          
          if (insertError) {
            console.error('📊 Failed to insert generation limits:', insertError)
          } else {
            console.log('📊 Generation limits inserted successfully')
          }
        }
      } else {
        console.warn('📊 No usage context found, skipping limits update')
      }
    } catch (persistErr) {
      console.error('💥 Failed to persist mock content:', persistErr)
      }

      console.log('✅ Returning mock response with', mockTransformations.length, 'transformations')
      console.log('✅ Mock response payload:', JSON.stringify({
        success: true,
        userId: user.id,
        mock: true,
        message: 'Demo mode - OpenRouter API key not configured'
      }, null, 2))
      
      return NextResponse.json({
        success: true,
        transformations: mockTransformations,
        userId: user.id,
        mock: true,
        message: 'Demo mode - OpenRouter API key not configured'
      })
    }

    // 9. Process transformations with OpenRouter and enhanced prompts
    const openRouterClient = createOpenRouterClient()
    
    // Auto-detect content type and tone if not provided
    const contentType = preferences.contentType || detectContentType(sanitizedContent)
    const tone = preferences.tone || detectTone(sanitizedContent)
    
    const transformations = await Promise.all(
      formats.map(async (format: string) => {
        const platform = format as Platform
        
        try {
          // Generate context-aware prompt with optimized parameters
          const promptResult = promptEngine.generateContextAwarePrompt({
            contentType,
            platform,
            tone,
            rawContent: sanitizedContent,
            customInstructions: preferences.customInstructions
          })

          // Generate content with OpenRouter using optimized temperature
          const generatedContent = await openRouterClient.generateContent(
            promptResult.systemMessage,
            promptResult.userPrompt,
            {
              temperature: promptResult.recommendedTemperature,
              max_tokens: 2000
            }
          )

          return {
            format,
            content: generatedContent,
            analysis: promptResult.contentAnalysis,
            improvementTips: promptResult.improvementTips,
            platformRecommendations: promptResult.platformRecommendations
          }
        } catch (apiError) {
          console.error(`OpenRouter error for format ${format}:`, apiError)
          // Fallback to mock content if API fails
          const analysis = analyzeContent(sanitizedContent, platform)
          return {
            format,
            content: getMockContent(format, sanitizedContent),
            analysis,
            improvementTips: generateImprovementTips(analysis),
            mock: true
          }
        }
      })
    )

    // 9.1 Persist transformations to Supabase (best effort) and increment usage
    try {
      const supabase = await createServerSupabaseClient()
      const rows = transformations.map(t => ({
        user_id: user.id,
        title: t.format === 'twitter' ? 'Twitter Thread' : t.format === 'linkedin' ? 'LinkedIn Carousel' : 'Instagram Reels',
        content: t.content,
        content_type: t.format,
        content_analysis: t.analysis ? JSON.stringify(t.analysis) : null,
        improvement_tips: t.improvementTips ? JSON.stringify(t.improvementTips) : null,
        created_at: new Date().toISOString(),
      }))
      if (rows.length > 0) {
        await supabase.from('content_history').insert(rows)
      }

      // Increment generation_limits counter for today
      const usage = (request as any)._usageContext as { today: string; used: number; units: number } | undefined
      if (usage) {
        const newCount = usage.used + usage.units
        // Try update first
        const { data: row, error: selErr } = await supabase
          .from('generation_limits')
          .select('count')
          .eq('user_id', user.id)
          .eq('date', usage.today)
          .maybeSingle()

        if (row) {
          await supabase
            .from('generation_limits')
            .update({ count: newCount })
            .eq('user_id', user.id)
            .eq('date', usage.today)
        } else {
          await supabase
            .from('generation_limits')
            .insert({ user_id: user.id, date: usage.today, count: newCount })
        }
      }
    } catch (persistErr) {
      console.warn('Failed to persist content_history or update generation_limits:', persistErr)
    }

    // 10. Return successful response with security headers and analysis
    return NextResponse.json(
      {
        success: true,
        transformations,
        userId: user.id, // Include user ID for tracking
        remainingRequests: remainingAttempts,
        contentAnalysis: transformations[0]?.analysis, // Include analysis for first format
        detectedContentType: contentType,
        detectedTone: tone
      },
      {
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': remainingAttempts.toString(),
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        }
      }
    )

  } catch (error) {
    console.error('API Error:', error)
    
    // Don't expose internal errors to client
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}

/**
 * Enhanced mock content generator that creates personalized content based on user's actual input
 */
function getMockContent(format: string, originalContent: string): string {
  // Analyze the original content to extract key information
  const contentAnalysis = analyzeContent(originalContent, format as Platform)
  const topics = extractTopics(originalContent)
  const keyPoints = extractKeyPoints(originalContent)
  const tone = detectTone(originalContent)
  const contentType = detectContentType(originalContent)
  
  // Extract the main theme/title from first sentence or paragraph
  const firstSentence = originalContent.split(/[.!?]/)[0]?.trim() || 'Key Insights'
  const mainTheme = firstSentence.length > 80 ? firstSentence.slice(0, 77) + '...' : firstSentence
  
  switch (format) {
    case 'twitter':
      return generatePersonalizedTwitterThread(originalContent, mainTheme, keyPoints, topics, contentAnalysis)
      
    case 'linkedin':
      return generatePersonalizedLinkedInCarousel(originalContent, mainTheme, keyPoints, topics, contentAnalysis)
      
    case 'instagram':
      return generatePersonalizedInstagramReel(originalContent, mainTheme, keyPoints, topics, contentAnalysis)
      
    default:
      return 'Content transformation not available for this format.'
  }
}


/**
 * Extract key points from content by finding important sentences
 */
function extractKeyPoints(content: string): string[] {
  const sentences = content.split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 150)
  
  // Look for sentences with important indicators
  const importantIndicators = [
    'key', 'important', 'crucial', 'essential', 'main', 'primary',
    'first', 'second', 'third', 'finally', 'however', 'therefore',
    'because', 'result', 'solution', 'problem', 'challenge',
    'benefit', 'advantage', 'strategy', 'method', 'approach'
  ]
  
  const scoredSentences = sentences.map(sentence => {
    const lowerSentence = sentence.toLowerCase()
    let score = 0
    
    // Score based on important indicators
    importantIndicators.forEach(indicator => {
      if (lowerSentence.includes(indicator)) score += 2
    })
    
    // Score based on numbers/statistics
    if (/\b\d+(\.\d+)?%?\b/.test(sentence)) score += 3
    
    // Score based on actionable language
    if (/\b(how to|step|guide|tip|way|method)\b/i.test(sentence)) score += 2
    
    return { sentence, score }
  })
  
  return scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(item => item.sentence)
    .filter(s => s.length > 0)
}

/**
 * Generate personalized Twitter thread based on content analysis
 */
function generatePersonalizedTwitterThread(content: string, mainTheme: string, keyPoints: string[], topics: string[], analysis: ContentAnalysis): string {
  const threadParts = [
    `1/ 🧵 ${mainTheme}\n\nA thread based on insights from the content you provided:`
  ]
  
  // Add key points as thread parts
  keyPoints.slice(0, 4).forEach((point, index) => {
    const tweetNumber = index + 2
    const emoji = ['💡', '🎯', '⚡', '🔥'][index] || '📍'
    threadParts.push(`${tweetNumber}/ ${emoji} ${point}`)
  })
  
  // Add insights based on content analysis
  if (analysis.engagement.factors.length > 0) {
    threadParts.push(`${keyPoints.length + 2}/ What makes this engaging:\n• ${analysis.engagement.factors.slice(0, 2).join('\n• ')}`)
  }
  
  // Add practical application
  if (topics.length > 0) {
    threadParts.push(`${keyPoints.length + 3}/ Key areas to focus on:\n${topics.slice(0, 3).map(topic => `• ${topic.charAt(0).toUpperCase() + topic.slice(1)}`).join('\n')}`)
  }
  
  // Add call to action based on content
  const cta = analysis.cta.phrases.length > 0 
    ? `${keyPoints.length + 4}/ ${analysis.cta.phrases[0]} What are your thoughts on this?`
    : `${keyPoints.length + 4}/ That's a wrap! What resonated most with you? Share your thoughts below! 🔄`
    
  threadParts.push(cta)
  
  return threadParts.join('\n\n')
}

/**
 * Generate personalized LinkedIn carousel based on content analysis
 */
function generatePersonalizedLinkedInCarousel(content: string, mainTheme: string, keyPoints: string[], topics: string[], analysis: ContentAnalysis): string {
  const slides = [
    `📊 SLIDE 1: ${mainTheme}\nTransformed from your original content`
  ]
  
  // Problem/Challenge slide if we can identify issues
  if (analysis.clarity.issues.length > 0) {
    slides.push(`🔍 SLIDE 2: Key Challenges\n• ${analysis.clarity.issues.slice(0, 3).join('\n• ')}`)
  }
  
  // Main points as slides
  keyPoints.slice(0, 3).forEach((point, index) => {
    const slideNumber = slides.length + 1
    const emoji = ['🎯', '⚡', '🏆'][index] || '💡'
    slides.push(`${emoji} SLIDE ${slideNumber}: Key Insight\n${point}`)
  })
  
  // Implementation slide
  if (analysis.engagement.suggestions.length > 0) {
    slides.push(`🚀 SLIDE ${slides.length + 1}: Next Steps\n• ${analysis.engagement.suggestions.slice(0, 3).join('\n• ')}`)
  }
  
  // Final takeaway
  const readingLevel = analysis.readability.readingLevel
  slides.push(`💡 SLIDE ${slides.length + 1}: Key Takeaway\nContent optimized for ${readingLevel.toLowerCase()} reading level with ${analysis.metrics.wordCount} words.`)
  
  return slides.join('\n\n')
}

/**
 * Generate personalized Instagram reel script based on content analysis
 */
function generatePersonalizedInstagramReel(content: string, mainTheme: string, keyPoints: string[], topics: string[], analysis: ContentAnalysis): string {
  const hook = keyPoints.length > 0 ? keyPoints[0].slice(0, 60) : mainTheme.slice(0, 60)
  const problem = analysis.clarity.issues.length > 0 ? analysis.clarity.issues[0] : 'Common challenges in this area'
  const solution = keyPoints.length > 1 ? keyPoints[1] : 'Here\'s the solution from the content'
  
  return `📱 INSTAGRAM REELS SCRIPT (60 seconds) - "${mainTheme.slice(0, 30)}..."

⏱️ 0:00-0:03 - HOOK:
[Close-up, direct eye contact]
"${hook}!"
[Text overlay: "${topics[0]?.toUpperCase() || 'IMPORTANT'}"] 

⏱️ 0:04-0:10 - PROBLEM:
[Concerned expression, gesture to emphasize]
"${problem}"
[Statistics from content: "${analysis.metrics.wordCount} words of insights"]

⏱️ 0:11-0:20 - SOLUTION INTRO:
[Confident posture, pointing gesture]
"${solution}"
[Text overlay: "THE SOLUTION"]

⏱️ 0:21-0:30 - KEY POINTS:
${keyPoints.slice(0, 3).map((point, i) => `"Point ${i + 1}: ${point.slice(0, 50)}..."`).join('\n')}

⏱️ 0:31-0:45 - IMPLEMENTATION:
"Here's how to apply this:"
${analysis.engagement.suggestions.slice(0, 2).map(suggestion => `"${suggestion.slice(0, 40)}..."`).join('\n')}

⏱️ 0:46-0:55 - RESULT/BENEFIT:
"Reading level: ${analysis.readability.readingLevel}"
"Engagement score: ${analysis.engagement.score}/100"
[Text: "PROVEN INSIGHTS"]

⏱️ 0:56-0:60 - CALL TO ACTION:
[Point down gesture]
"Save this for your ${topics[0] || 'strategy'}!"

🎵 Suggested Audio: Trending audio related to ${topics[0] || 'motivation'}

${analysis.hashtags.suggested.slice(0, 10).join(' ')}`
}
