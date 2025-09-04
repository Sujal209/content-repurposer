/**
 * Sophisticated Prompt Engine for Content Transformation
 * Emotionally intelligent, platform-aware content repurposing strategist
 */

import { ContentAnalysis, analyzeContent, generateImprovementTips, getPlatformRecommendations, enhancedAnalyzeContent, type EnhancedContentAnalysis } from './content-analysis'

export type ContentType = 'blog' | 'video_script' | 'podcast_transcript' | 'article' | 'newsletter' | 'general'
export type Platform = 'twitter' | 'linkedin' | 'instagram'
export type Tone = 'casual' | 'professional' | 'humorous' | 'inspiring' | 'educational' | 'conversational'

export interface PromptParameters {
  contentType: ContentType
  platform: Platform
  tone: Tone
  rawContent: string
  customInstructions?: string
}

export interface PromptResult {
  systemMessage: string
  userPrompt: string
  contentAnalysis: ContentAnalysis
  improvementTips: string[]
  platformRecommendations: string[]
}

export class PromptEngine {
  /**
   * Core system message with structured prompting and clear constraints
   */
  private getBaseSystemMessage(): string {
    return `You are an expert content transformation specialist. Your role is to transform content while preserving its core value and adapting it perfectly for specific social media platforms.

## CORE EXPERTISE:
- Content psychology and engagement patterns
- Platform algorithm optimization
- Authentic voice preservation
- Strategic content structure
- Audience behavior analysis

## TRANSFORMATION PROCESS:
Follow this systematic approach:
1. **ANALYZE**: Extract key insights, themes, and value propositions
2. **ADAPT**: Restructure for platform-specific consumption patterns
3. **OPTIMIZE**: Apply engagement techniques while maintaining authenticity
4. **VALIDATE**: Ensure output meets quality and format requirements

## QUALITY REQUIREMENTS:
✅ MUST preserve the original's main insights and key points
✅ MUST follow exact platform formatting specifications
✅ MUST maintain the author's authentic voice and expertise
✅ MUST include specific, actionable content
✅ MUST optimize for engagement without being clickbait

❌ AVOID generic social media phrases ("game-changer", "mind-blown", etc.)
❌ AVOID losing the original content's depth and nuance
❌ AVOID exceeding platform character/format limits
❌ AVOID overly promotional or salesy language
❌ AVOID generic calls-to-action that don't relate to the content

## OUTPUT STANDARDS:
- Use data-driven content structure
- Include specific examples from the original content
- Maintain professional credibility
- Optimize for mobile consumption
- Ensure accessibility and inclusive language`
  }

  /**
   * Generate platform-specific instructions
   */
  private getPlatformInstructions(platform: Platform): string {
    switch (platform) {
      case 'twitter':
        return `
🐦 TWITTER THREAD FORMAT - STRICT REQUIREMENTS:

## EXACT OUTPUT FORMAT:
\`\`\`
1/ [Hook with emoji] [240-270 characters max]
[Optional line break for visual appeal]

2/ [Key insight 1] [240-270 characters max]
[Include specific example or data from original]

3/ [Key insight 2] [240-270 characters max] 
[Continue the narrative flow]

...

[Final tweet]/ [Call-to-action + engagement request]
[Hashtags: max 2-3, naturally integrated]
\`\`\`

## CONTENT PRESERVATION RULES:
✅ Extract 3-5 core insights from original content
✅ Include at least 2 specific examples/data points from source
✅ Maintain the original author's expertise and perspective
✅ Reference the original's key terminology and concepts

## ENGAGEMENT TECHNIQUES:
- Tweet 1: Hook that promises specific value
- Middle tweets: Build logical progression with examples
- Include 1-2 pattern interrupts (single words, questions)
- Final tweet: Specific call-to-action related to content theme

## CHARACTER COUNT VALIDATION:
- Each tweet MUST be 240-270 characters (including numbering)
- Test with longest probable display names in retweets
- Account for Twitter's link shortening in final count`

      case 'linkedin':
        return `
💼 LINKEDIN CAROUSEL FORMAT - PROFESSIONAL SPECIFICATIONS:

## EXACT OUTPUT FORMAT:
\`\`\`
SLIDE 1: [Professional emoji] [Hook Title - 25 chars max]
• [Value proposition - specific benefit]
• [Why this matters now - industry context]

SLIDE 2: [Emoji] [Section Title - 25 chars max]  
• [Insight 1 from original content]
• [Supporting data/example from source]
• [Why this works - professional context]

[Continue pattern for SLIDES 3-6]

SLIDE 7: [Key emoji] Key Takeaway
• [Main lesson learned]
• [Practical application]

SLIDE 8: [CTA emoji] Your Next Step
• [Specific action related to content]
• [Engagement question for comments]
\`\`\`

## CONTENT PRESERVATION RULES:
✅ Extract 4-6 professional insights from original
✅ Include specific data, examples, or case studies
✅ Maintain original author's expertise level
✅ Reference industry-specific terminology from source

## PROFESSIONAL REQUIREMENTS:
- Each slide: max 3 bullet points, 40 words per point
- Use business-focused emojis only: 📊📈💡🎯⚡🔑🏆💪🚀
- Include quantifiable benefits where possible
- Frame insights for career/business growth impact`

      case 'instagram':
        return `
📸 INSTAGRAM REELS FORMAT - VISUAL STORYTELLING SPECIFICATIONS:

## EXACT OUTPUT FORMAT:
\`\`\`
🎬 REELS SCRIPT: "[Title from original content - 30 chars max]"

⏱️ 0:00-0:03 HOOK:
[Visual: close-up/bold gesture]
"[Attention-grabbing statement from original]"
[Text overlay: "[KEY STAT/INSIGHT]"]

⏱️ 0:04-0:15 PROBLEM/CONTEXT:
[Visual: concerned expression/problem visualization]
"[Problem/challenge from original content]"
[Text: "[RELATABLE STRUGGLE]"]

⏱️ 0:16-0:45 SOLUTION/INSIGHTS:
[Visual transitions for each point]
"Point 1: [Key insight from original]"
[Text: "[BENEFIT 1]"]
"Point 2: [Supporting insight]"
[Text: "[BENEFIT 2]"]

⏱️ 0:46-0:60 CTA & ENGAGEMENT:
[Visual: direct camera address/pointing gesture]
"[Specific action related to content theme]"
"[Question to drive comments]"

🎵 AUDIO: [Suggest trending audio type based on content tone]
🏷️ HASHTAGS: [12-15 relevant hashtags including content theme]
\`\`\`

## CONTENT PRESERVATION RULES:
✅ Extract 2-3 visual-friendly insights from original
✅ Include specific outcomes/results mentioned in source
✅ Maintain original's educational/inspirational value
✅ Use original's terminology in text overlays

## VISUAL STORYTELLING REQUIREMENTS:
- Each segment: specific visual direction for creator
- Text overlays: key phrases for silent viewing
- Pattern interrupts: zoom, transition, or gesture changes
- Trending elements: audio type suggestion based on content theme`

      default:
        return ''
    }
  }

  /**
   * Generate tone-specific instructions
   */
  private getToneInstructions(tone: Tone): string {
    const toneMap: Record<Tone, string> = {
      casual: `
🗣️ CASUAL TONE GUIDELINES:
- Use everyday language and contractions (don't, can't, I'll)
- Include personal opinions and experiences
- Write like you're talking to a friend
- Use humor and personality naturally
- Keep it relatable and down-to-earth
- Include casual expressions and current slang appropriately`,

      professional: `
💼 PROFESSIONAL TONE GUIDELINES:
- Maintain authoritative yet approachable voice
- Use industry-appropriate terminology
- Focus on credibility and expertise
- Include data and evidence-based claims
- Write with confidence and clarity
- Avoid overly casual expressions while staying human`,

      humorous: `
😄 HUMOROUS TONE GUIDELINES:
- Include witty observations and light humor
- Use relatable situations and common frustrations
- Add playful elements without undermining the message
- Include funny analogies or comparisons
- Keep humor inclusive and audience-appropriate
- Balance entertainment with valuable insights`,

      inspiring: `
✨ INSPIRING TONE GUIDELINES:
- Use uplifting and motivational language
- Include empowering statements and possibilities
- Focus on growth, transformation, and potential
- Share success stories and positive outcomes
- Use aspirational language that encourages action
- Create emotional connection through shared dreams`,

      educational: `
🎓 EDUCATIONAL TONE GUIDELINES:
- Structure content with clear learning objectives
- Use step-by-step explanations and examples
- Include helpful tips and actionable insights
- Explain complex concepts in simple terms
- Provide context and background information
- Focus on knowledge transfer and skill building`,

      conversational: `
💬 CONVERSATIONAL TONE GUIDELINES:
- Write as if speaking directly to one person
- Use natural speech patterns and rhythm
- Include rhetorical questions and direct addresses
- Share thoughts and observations openly
- Create intimate, one-on-one feeling
- Use storytelling and personal anecdotes`
    }

    return toneMap[tone]
  }

  /**
   * Generate content type specific context
   */
  private getContentTypeContext(contentType: ContentType): string {
    const contextMap: Record<ContentType, string> = {
      blog: 'This content originated as a blog post - preserve the informational structure while adapting for social engagement.',
      video_script: 'This content was designed for video - maintain visual storytelling elements and spoken language flow.',
      podcast_transcript: 'This content came from audio - preserve conversational elements and spoken insights.',
      article: 'This is journalistic content - maintain credibility while increasing social media appeal.',
      newsletter: 'This content was designed for email - adapt the personal connection for social platforms.',
      general: 'This is general content - optimize based on the inherent characteristics you observe.'
    }

    return contextMap[contentType]
  }

  /**
   * Generate comprehensive prompt with content analysis
   */
  public generatePrompt(parameters: PromptParameters): PromptResult {
    // Analyze the content first
    const contentAnalysis = analyzeContent(parameters.rawContent, parameters.platform)
    const improvementTips = generateImprovementTips(contentAnalysis)
    const platformRecommendations = getPlatformRecommendations(parameters.platform, contentAnalysis, parameters.rawContent)

    // Build the system message
    const systemMessage = [
      this.getBaseSystemMessage(),
      this.getPlatformInstructions(parameters.platform),
      this.getToneInstructions(parameters.tone),
      `
📋 CONTENT CONTEXT:
${this.getContentTypeContext(parameters.contentType)}

📊 CONTENT ANALYSIS INSIGHTS:
- Readability Level: ${contentAnalysis.readability.readingLevel} (${contentAnalysis.readability.fleschScore.toFixed(1)} Flesch Score)
- Engagement Potential: ${contentAnalysis.engagement.score}/100
- Content Length: ${contentAnalysis.metrics.wordCount} words
- CTA Strength: ${contentAnalysis.cta.strength}
- Key Topics: ${contentAnalysis.hashtags.suggested.slice(0, 5).join(', ')}

🎯 OPTIMIZATION FOCUS:
${improvementTips.length > 0 ? improvementTips.join('\n') : 'Content is well-optimized for transformation'}

${platformRecommendations.length > 0 ? `
🚀 PLATFORM RECOMMENDATIONS:
${platformRecommendations.join('\n')}` : ''}

${parameters.customInstructions ? `
🎨 CUSTOM INSTRUCTIONS:
${parameters.customInstructions}` : ''}

REMEMBER: Your goal is to create content that feels native to the platform while preserving the author's unique voice and message. Focus on genuine engagement over superficial viral tactics.`
    ].join('\n')

    // Build the user prompt
    const userPrompt = `Transform the following ${parameters.contentType} content for ${parameters.platform} using a ${parameters.tone} tone:

ORIGINAL CONTENT:
"""
${parameters.rawContent}
"""

Please create engaging, platform-optimized content that maintains the author's voice while maximizing engagement potential for ${parameters.platform}.`

    return {
      systemMessage,
      userPrompt,
      contentAnalysis,
      improvementTips,
      platformRecommendations
    }
  }

  /**
   * Generate enhanced prompt with detailed content insights
   */
  public generateEnhancedPrompt(parameters: PromptParameters): PromptResult & { enhancedAnalysis: EnhancedContentAnalysis } {
    // Use enhanced analysis for better insight extraction
    const enhancedAnalysis = enhancedAnalyzeContent(parameters.rawContent, parameters.platform)
    const improvementTips = generateImprovementTips(enhancedAnalysis)
    const platformRecommendations = getPlatformRecommendations(parameters.platform, enhancedAnalysis, parameters.rawContent)

    // Build enhanced system message with key insights
    const systemMessage = [
      this.getBaseSystemMessage(),
      this.getPlatformInstructions(parameters.platform),
      this.getToneInstructions(parameters.tone),
      `
📋 CONTENT CONTEXT:
${this.getContentTypeContext(parameters.contentType)}

🧠 ENHANCED CONTENT ANALYSIS:
- Main Theme: ${enhancedAnalysis.mainThemes.mainTheme}
- Transformation Readiness: ${enhancedAnalysis.transformationReadiness.score}/100
- Key Insights Available: ${enhancedAnalysis.keyInsights.length}
- Readability: ${enhancedAnalysis.readability.readingLevel} (${enhancedAnalysis.readability.fleschScore.toFixed(1)} Flesch Score)
- Engagement Potential: ${enhancedAnalysis.engagement.score}/100

🔑 KEY INSIGHTS TO PRESERVE:
${enhancedAnalysis.keyInsights.slice(0, 5).map(insight => `• ${insight.slice(0, 80)}...`).join('\n')}

💡 VALUE PROPOSITIONS:
${enhancedAnalysis.mainThemes.valueProps.slice(0, 3).map(prop => `• ${prop.slice(0, 80)}...`).join('\n')}

💪 TRANSFORMATION STRENGTHS:
${enhancedAnalysis.transformationReadiness.strengths.map(strength => `✅ ${strength}`).join('\n')}

${enhancedAnalysis.transformationReadiness.challenges.length > 0 ? `
⚠️ TRANSFORMATION CHALLENGES:
${enhancedAnalysis.transformationReadiness.challenges.map(challenge => `🔶 ${challenge}`).join('\n')}` : ''}

🎯 OPTIMIZATION FOCUS:
${improvementTips.length > 0 ? improvementTips.join('\n') : 'Content is well-optimized for transformation'}

${platformRecommendations.length > 0 ? `
🚀 PLATFORM RECOMMENDATIONS:
${platformRecommendations.join('\n')}` : ''}

${parameters.customInstructions ? `
🎨 CUSTOM INSTRUCTIONS:
${parameters.customInstructions}` : ''}

CRITICAL: You MUST preserve the key insights and value propositions listed above. These are the core elements that make this content valuable.`
    ].join('\n')

    // Build enhanced user prompt with specific guidance
    const userPrompt = `Transform the following ${parameters.contentType} content for ${parameters.platform} using a ${parameters.tone} tone.

IMPORTANT: Focus on preserving the ${enhancedAnalysis.keyInsights.length} key insights and ${enhancedAnalysis.mainThemes.valueProps.length} value propositions identified in the analysis above.

ORIGINAL CONTENT:
"""
${parameters.rawContent}
"""

Main theme to preserve: "${enhancedAnalysis.mainThemes.mainTheme}"

Create engaging, platform-optimized content that maintains these core insights while maximizing engagement potential for ${parameters.platform}.`

    return {
      systemMessage,
      userPrompt,
      contentAnalysis: enhancedAnalysis,
      improvementTips,
      platformRecommendations,
      enhancedAnalysis
    }
  }

  /**
   * Generate context-aware prompt based on content characteristics
   */
  public generateContextAwarePrompt(parameters: PromptParameters): PromptResult & { enhancedAnalysis: EnhancedContentAnalysis; recommendedTemperature: number } {
    const enhancedAnalysis = enhancedAnalyzeContent(parameters.rawContent, parameters.platform)
    
    // Determine optimal temperature based on content characteristics
    let temperature = 0.7 // Default
    
    if (enhancedAnalysis.transformationReadiness.score < 50) {
      // Lower temperature for challenging content that needs careful handling
      temperature = 0.5
    } else if (parameters.tone === 'humorous' || parameters.tone === 'casual') {
      // Higher temperature for creative/casual content
      temperature = 0.8
    } else if (parameters.tone === 'professional' || enhancedAnalysis.readability.readingLevel === 'Difficult') {
      // Lower temperature for professional or complex content
      temperature = 0.6
    }
    
    // Adapt prompt strategy based on content characteristics
    let strategyAdjustments = ''
    
    if (enhancedAnalysis.keyInsights.length < 2) {
      strategyAdjustments += '\n\n⚠️ CONTENT STRATEGY ADJUSTMENT:\n- Focus on extracting implicit insights and value\n- Expand on subtle themes and implications\n- Create engaging hooks from available material'
    }
    
    if (enhancedAnalysis.transformationReadiness.score > 80) {
      strategyAdjustments += '\n\n✨ OPTIMIZATION OPPORTUNITY:\n- Content is highly transformable\n- Leverage strong insights for maximum impact\n- Use advanced engagement techniques'
    }
    
    if (enhancedAnalysis.metrics.wordCount > 1500) {
      strategyAdjustments += '\n\n📝 CONDENSATION STRATEGY:\n- Prioritize most impactful insights\n- Create compelling summaries\n- Focus on key actionable points'
    }
    
    // Generate enhanced prompt with strategy adjustments
    const baseResult = this.generateEnhancedPrompt({
      ...parameters,
      customInstructions: `${parameters.customInstructions || ''}${strategyAdjustments}`
    })
    
    return {
      ...baseResult,
      recommendedTemperature: temperature
    }
  }

  /**
   * Generate multiple prompts for A/B testing with different strategies
   */
  public generateVariations(parameters: PromptParameters, variationCount: number = 2): PromptResult[] {
    const variations: PromptResult[] = []
    const enhancedAnalysis = enhancedAnalyzeContent(parameters.rawContent, parameters.platform)

    // Create variations based on content characteristics
    const strategies = []
    
    if (enhancedAnalysis.engagement.score < 60) {
      strategies.push({ focus: 'engagement', instruction: 'Maximize engagement with compelling hooks and emotional connection' })
    }
    
    if (enhancedAnalysis.transformationReadiness.challenges.length > 0) {
      strategies.push({ focus: 'clarity', instruction: 'Prioritize clarity and simplification while maintaining value' })
    }
    
    if (enhancedAnalysis.keyInsights.length >= 3) {
      strategies.push({ focus: 'authority', instruction: 'Emphasize expertise and credibility using rich insights' })
    }
    
    strategies.push({ focus: 'storytelling', instruction: 'Use narrative techniques to make content more compelling' })
    
    for (let i = 0; i < Math.min(variationCount, strategies.length); i++) {
      const strategy = strategies[i]
      const variedParams = {
        ...parameters,
        customInstructions: `${parameters.customInstructions || ''}\n\nVARIATION STRATEGY: ${strategy.instruction}`
      }
      variations.push(this.generateEnhancedPrompt(variedParams))
    }

    return variations
  }

  /**
   * Estimate token usage for cost calculation
   */
  public estimateTokens(promptResult: PromptResult): { inputTokens: number; estimatedOutputTokens: number } {
    // Rough estimation: 1 token ≈ 0.75 words
    const systemTokens = Math.ceil(promptResult.systemMessage.length / 3)
    const userTokens = Math.ceil(promptResult.userPrompt.length / 3)
    const inputTokens = systemTokens + userTokens

    // Estimate output tokens based on platform
    const outputEstimates = {
      twitter: 800,  // ~10 tweets
      linkedin: 600, // ~6-8 slides
      instagram: 1000 // ~detailed script
    }

    return {
      inputTokens,
      estimatedOutputTokens: outputEstimates[promptResult.contentAnalysis.hashtags.extracted.length > 0 ? 
        Object.keys(outputEstimates)[0] as keyof typeof outputEstimates : 'twitter']
    }
  }
}

/**
 * Content type detection utility
 */
export function detectContentType(content: string): ContentType {
  const lowerContent = content.toLowerCase()

  // Check for video script indicators
  if (lowerContent.includes('[') && lowerContent.includes(']') && 
      (lowerContent.includes('fade in') || lowerContent.includes('cut to') || lowerContent.includes('voiceover'))) {
    return 'video_script'
  }

  // Check for podcast indicators
  if (lowerContent.includes('transcript') || 
      (lowerContent.includes('host:') || lowerContent.includes('guest:')) ||
      lowerContent.includes('welcome to the podcast')) {
    return 'podcast_transcript'
  }

  // Check for newsletter indicators
  if (lowerContent.includes('unsubscribe') || lowerContent.includes('newsletter') ||
      lowerContent.includes('this week') && lowerContent.includes('subscribe')) {
    return 'newsletter'
  }

  // Check for blog post indicators
  if (lowerContent.includes('introduction') || lowerContent.includes('conclusion') ||
      (content.split('\n').length > 10 && content.length > 1000)) {
    return 'blog'
  }

  // Check for article indicators
  if (lowerContent.includes('according to') || lowerContent.includes('research shows') ||
      lowerContent.includes('study found')) {
    return 'article'
  }

  return 'general'
}

/**
 * Tone detection utility
 */
export function detectTone(content: string): Tone {
  const lowerContent = content.toLowerCase()

  // Check for professional indicators
  if (lowerContent.includes('research') || lowerContent.includes('analysis') ||
      lowerContent.includes('methodology') || lowerContent.includes('furthermore')) {
    return 'professional'
  }

  // Check for educational indicators
  if (lowerContent.includes('learn') || lowerContent.includes('understand') ||
      lowerContent.includes('step') || lowerContent.includes('how to')) {
    return 'educational'
  }

  // Check for inspiring indicators
  if (lowerContent.includes('achieve') || lowerContent.includes('transform') ||
      lowerContent.includes('success') || lowerContent.includes('dream')) {
    return 'inspiring'
  }

  // Check for humorous indicators
  if (lowerContent.includes('lol') || lowerContent.includes('haha') ||
      lowerContent.includes('funny') || lowerContent.includes('joke')) {
    return 'humorous'
  }

  // Default to conversational
  return 'conversational'
}

/**
 * Platform optimization suggestions
 */
export function getPlatformOptimizations(platform: Platform): string[] {
  const optimizations: Record<Platform, string[]> = {
    twitter: [
      'Use Twitter-specific language and abbreviations',
      'Include relevant Twitter trends and hashtags',
      'Create tweetable quotes within the thread',
      'Use strategic emoji placement for visual breaks',
      'Design for mobile reading with short lines'
    ],
    linkedin: [
      'Frame content with professional relevance',
      'Include industry insights and business value',
      'Use LinkedIn-appropriate professional emojis',
      'Structure for business professionals scanning quickly',
      'Include actionable takeaways for career growth'
    ],
    instagram: [
      'Optimize for visual storytelling and mobile consumption',
      'Include trending audio and music suggestions',
      'Design for high replay value and saves',
      'Use Instagram-native language and current trends',
      'Create shareable moments and quotable content'
    ]
  }

  return optimizations[platform]
}

// Export a default instance
export const promptEngine = new PromptEngine()
