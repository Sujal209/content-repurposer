/**
 * Content Analysis Utilities
 * Provides comprehensive content analysis including readability, engagement, and quality metrics
 */

export interface ContentAnalysis {
  readability: {
    fleschScore: number
    readingLevel: string
    avgWordsPerSentence: number
    avgSyllablesPerWord: number
  }
  engagement: {
    score: number
    factors: string[]
    suggestions: string[]
  }
  clarity: {
    score: number
    issues: string[]
    improvements: string[]
  }
  hashtags: {
    extracted: string[]
    suggested: string[]
  }
  metrics: {
    wordCount: number
    sentenceCount: number
    paragraphCount: number
    readingTimeMinutes: number
  }
  cta: {
    phrases: string[]
    strength: 'weak' | 'moderate' | 'strong'
    suggestions: string[]
  }
}

/**
 * Calculate Flesch Reading Ease Score
 */
export function calculateFleschScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = text.split(/\s+/).filter(w => w.length > 0)
  const syllables = words.reduce((total, word) => total + countSyllables(word), 0)

  if (sentences.length === 0 || words.length === 0) return 0

  const avgWordsPerSentence = words.length / sentences.length
  const avgSyllablesPerWord = syllables / words.length

  // Flesch Reading Ease formula
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
  return Math.max(0, Math.min(100, score))
}

/**
 * Count syllables in a word
 */
export function countSyllables(word: string): number {
  word = word.toLowerCase()
  if (word.length <= 3) return 1
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')
  
  const matches = word.match(/[aeiouy]{1,2}/g)
  return matches ? matches.length : 1
}

/**
 * Get reading level from Flesch score
 */
export function getReadingLevel(fleschScore: number): string {
  if (fleschScore >= 90) return 'Very Easy'
  if (fleschScore >= 80) return 'Easy'
  if (fleschScore >= 70) return 'Fairly Easy'
  if (fleschScore >= 60) return 'Standard'
  if (fleschScore >= 50) return 'Fairly Difficult'
  if (fleschScore >= 30) return 'Difficult'
  return 'Very Difficult'
}

/**
 * Calculate engagement score based on various factors
 */
export function calculateEngagementScore(text: string): { score: number; factors: string[]; suggestions: string[] } {
  const factors: string[] = []
  const suggestions: string[] = []
  let score = 50 // Base score

  // Check for questions
  const questionMarks = (text.match(/\?/g) || []).length
  if (questionMarks > 0) {
    score += 10
    factors.push('Contains engaging questions')
  } else {
    suggestions.push('Add questions to increase engagement')
  }

  // Check for emotional words
  const emotionalWords = [
    'amazing', 'incredible', 'shocking', 'surprising', 'revolutionary', 
    'breakthrough', 'powerful', 'inspiring', 'transformative', 'game-changing',
    'love', 'hate', 'excited', 'frustrated', 'passionate', 'thrilled'
  ]
  const emotionalCount = emotionalWords.filter(word => 
    text.toLowerCase().includes(word)
  ).length
  
  if (emotionalCount > 0) {
    score += emotionalCount * 5
    factors.push('Uses emotional language')
  } else {
    suggestions.push('Add emotional words to create stronger connection')
  }

  // Check for numbers and statistics
  const numbersCount = (text.match(/\b\d+(\.\d+)?%?\b/g) || []).length
  if (numbersCount > 0) {
    score += numbersCount * 3
    factors.push('Includes numbers and statistics')
  } else {
    suggestions.push('Add specific numbers or statistics for credibility')
  }

  // Check for action words
  const actionWords = [
    'discover', 'learn', 'master', 'achieve', 'transform', 'create', 
    'build', 'grow', 'improve', 'optimize', 'unlock', 'reveal'
  ]
  const actionCount = actionWords.filter(word => 
    text.toLowerCase().includes(word)
  ).length
  
  if (actionCount > 0) {
    score += actionCount * 4
    factors.push('Contains action-oriented language')
  } else {
    suggestions.push('Use more action words to motivate readers')
  }

  // Check for personal pronouns (first person)
  const personalPronouns = text.match(/\b(I|my|me|mine|we|our|us)\b/gi) || []
  if (personalPronouns.length > 0) {
    score += 8
    factors.push('Uses personal storytelling')
  } else {
    suggestions.push('Add personal stories or experiences')
  }

  // Check length appropriateness
  const wordCount = text.split(/\s+/).length
  if (wordCount >= 100 && wordCount <= 1000) {
    score += 5
    factors.push('Optimal content length')
  } else if (wordCount < 100) {
    suggestions.push('Content might be too short - add more detail')
  } else {
    suggestions.push('Content might be too long - consider breaking into sections')
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    factors,
    suggestions
  }
}

/**
 * Assess content clarity
 */
export function assessClarity(text: string): { score: number; issues: string[]; improvements: string[] } {
  const issues: string[] = []
  const improvements: string[] = []
  let score = 70 // Base clarity score

  // Check for overly long sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const longSentences = sentences.filter(s => s.split(/\s+/).length > 25)
  
  if (longSentences.length > 0) {
    score -= longSentences.length * 5
    issues.push(`${longSentences.length} sentences are too long (>25 words)`)
    improvements.push('Break long sentences into shorter, clearer ones')
  }

  // Check for passive voice indicators
  const passiveIndicators = ['was', 'were', 'been', 'being', 'is being', 'are being']
  const passiveCount = passiveIndicators.filter(indicator => 
    text.toLowerCase().includes(indicator)
  ).length
  
  if (passiveCount > 3) {
    score -= 10
    issues.push('Frequent use of passive voice')
    improvements.push('Use more active voice for clarity and impact')
  }

  // Check for jargon and complex words
  const complexWords = [
    'utilize', 'facilitate', 'implement', 'leverage', 'paradigm',
    'synergy', 'optimize', 'streamline', 'enhance', 'methodology'
  ]
  const jargonCount = complexWords.filter(word => 
    text.toLowerCase().includes(word)
  ).length
  
  if (jargonCount > 2) {
    score -= jargonCount * 3
    issues.push('Contains business jargon')
    improvements.push('Replace jargon with simpler, clearer terms')
  }

  // Check for transition words
  const transitions = [
    'however', 'therefore', 'moreover', 'furthermore', 'consequently',
    'additionally', 'meanwhile', 'nevertheless', 'first', 'second', 'finally'
  ]
  const transitionCount = transitions.filter(word => 
    text.toLowerCase().includes(word)
  ).length
  
  if (transitionCount > 0) {
    score += transitionCount * 2
  } else {
    improvements.push('Add transition words to improve flow')
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    issues,
    improvements
  }
}

/**
 * Extract key entities and topics from text
 */
function extractContentEntities(text: string): { topics: string[], entities: string[], themes: string[] } {
  const lowercaseText = text.toLowerCase()
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = lowercaseText.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length > 2)
  
  // Common stop words to exclude
  const stopWords = new Set([
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then',
    'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any',
    'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'only',
    'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should',
    'now', 'also', 'from', 'they', 'them', 'their', 'what', 'which', 'who',
    'this', 'that', 'these', 'those', 'his', 'her', 'him', 'she', 'you', 'your',
    'our', 'we', 'us', 'my', 'me', 'i', 'am', 'is', 'are', 'was', 'were',
    'being', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'would',
    'could', 'should', 'may', 'might', 'must', 'shall', 'will', 'can'
  ])
  
  // Extract meaningful words with frequency
  const wordFreq: Record<string, number> = {}
  words.forEach(word => {
    if (!stopWords.has(word) && word.length > 3) {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    }
  })
  
  // Get top keywords by frequency
  const topWords = Object.entries(wordFreq)
    .filter(([word, freq]) => freq >= 2 || word.length > 6)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([word]) => word)
  
  // Detect topics and themes based on semantic patterns
  const topics: string[] = []
  const entities: string[] = []
  const themes: string[] = []
  
  // Technology & Business Keywords
  const techPatterns = [
    'ai', 'artificial intelligence', 'machine learning', 'automation', 'digital',
    'software', 'technology', 'innovation', 'startup', 'app', 'platform',
    'data', 'analytics', 'cloud', 'cyber', 'tech', 'programming', 'coding'
  ]
  
  const businessPatterns = [
    'business', 'entrepreneur', 'startup', 'company', 'corporate', 'finance',
    'marketing', 'sales', 'strategy', 'growth', 'revenue', 'profit', 'investment',
    'management', 'leadership', 'team', 'productivity', 'efficiency', 'success'
  ]
  
  const healthPatterns = [
    'health', 'fitness', 'wellness', 'nutrition', 'exercise', 'diet', 'workout',
    'mental', 'mindfulness', 'meditation', 'lifestyle', 'wellbeing', 'medical'
  ]
  
  const educationPatterns = [
    'education', 'learning', 'training', 'skill', 'knowledge', 'study', 'course',
    'teaching', 'tutorial', 'guide', 'tips', 'advice', 'howto', 'development'
  ]
  
  const creativePatterns = [
    'design', 'creative', 'art', 'photography', 'writing', 'content', 'brand',
    'visual', 'aesthetic', 'style', 'inspiration', 'creative'
  ]
  
  // Check for patterns in text
  techPatterns.forEach(pattern => {
    if (lowercaseText.includes(pattern) || topWords.includes(pattern)) {
      topics.push('technology')
      entities.push(pattern)
    }
  })
  
  businessPatterns.forEach(pattern => {
    if (lowercaseText.includes(pattern) || topWords.includes(pattern)) {
      topics.push('business')
      entities.push(pattern)
    }
  })
  
  healthPatterns.forEach(pattern => {
    if (lowercaseText.includes(pattern) || topWords.includes(pattern)) {
      topics.push('health')
      entities.push(pattern)
    }
  })
  
  educationPatterns.forEach(pattern => {
    if (lowercaseText.includes(pattern) || topWords.includes(pattern)) {
      topics.push('education')
      entities.push(pattern)
    }
  })
  
  creativePatterns.forEach(pattern => {
    if (lowercaseText.includes(pattern) || topWords.includes(pattern)) {
      topics.push('creative')
      entities.push(pattern)
    }
  })
  
  // Detect themes from sentence structure
  if (lowercaseText.includes('how to') || lowercaseText.includes('guide') || lowercaseText.includes('steps')) {
    themes.push('tutorial')
  }
  if (lowercaseText.includes('tips') || lowercaseText.includes('advice') || lowercaseText.includes('suggestions')) {
    themes.push('tips')
  }
  if (lowercaseText.includes('review') || lowercaseText.includes('comparison') || lowercaseText.includes('vs')) {
    themes.push('review')
  }
  if (lowercaseText.includes('news') || lowercaseText.includes('update') || lowercaseText.includes('announcement')) {
    themes.push('news')
  }
  
  return {
    topics: [...new Set(topics)],
    entities: [...new Set(entities)],
    themes: [...new Set(themes)]
  }
}

/**
 * Generate smart hashtags based on content analysis
 */
function generateSmartHashtags(contentAnalysis: { topics: string[], entities: string[], themes: string[] }, platform: string): string[] {
  const hashtags: string[] = []
  
  // Topic-based hashtags
  const topicHashtags: Record<string, string[]> = {
    technology: ['#Tech', '#Innovation', '#Digital', '#AI', '#TechTips', '#Automation', '#DigitalTransformation'],
    business: ['#Business', '#Entrepreneurship', '#StartupLife', '#BusinessTips', '#Leadership', '#Strategy', '#Growth'],
    health: ['#Health', '#Wellness', '#Fitness', '#HealthyLiving', '#Nutrition', '#MentalHealth', '#Wellbeing'],
    education: ['#Learning', '#Education', '#SkillDevelopment', '#Knowledge', '#Training', '#Study', '#PersonalGrowth'],
    creative: ['#Design', '#Creativity', '#Art', '#ContentCreation', '#Branding', '#Visual', '#Inspiration']
  }
  
  // Theme-based hashtags
  const themeHashtags: Record<string, string[]> = {
    tutorial: ['#HowTo', '#Tutorial', '#StepByStep', '#Guide', '#Learning', '#DIY'],
    tips: ['#Tips', '#Advice', '#LifeHacks', '#ProTips', '#Insights', '#Wisdom'],
    review: ['#Review', '#Comparison', '#Analysis', '#Evaluation', '#TestResults'],
    news: ['#News', '#Update', '#Breaking', '#Latest', '#Trending', '#NewAlert']
  }
  
  // Add topic hashtags
  contentAnalysis.topics.forEach(topic => {
    const topicTags = topicHashtags[topic] || []
    hashtags.push(...topicTags.slice(0, 3))
  })
  
  // Add theme hashtags
  contentAnalysis.themes.forEach(theme => {
    const themeTags = themeHashtags[theme] || []
    hashtags.push(...themeTags.slice(0, 2))
  })
  
  // Generate hashtags from key entities
  contentAnalysis.entities.forEach(entity => {
    if (entity.length > 3 && entity.length < 15) {
      const cleanEntity = entity.replace(/[^a-zA-Z0-9]/g, '')
      if (cleanEntity.length > 3) {
        hashtags.push(`#${cleanEntity.charAt(0).toUpperCase() + cleanEntity.slice(1)}`)
      }
    }
  })
  
  return [...new Set(hashtags)]
}

/**
 * Configuration for AI-powered hashtag generation
 */
interface AIHashtagConfig {
  enabled: boolean
  apiKey?: string
  model?: string
  maxRetries?: number
  timeout?: number
}

/**
 * AI-powered hashtag generation using external API
 */
async function generateAIHashtags(
  text: string, 
  platform: string, 
  config: AIHashtagConfig
): Promise<string[]> {
  if (!config.enabled || !config.apiKey) {
    return []
  }

  const maxLength = Math.min(500, text.length) // Limit text length for API efficiency
  const truncatedText = text.substring(0, maxLength)
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model || 'mistral-small-3.2-24b',
        messages: [
          {
            role: 'system',
            content: `You are a social media hashtag expert. Generate relevant, trending hashtags for ${platform} posts. Focus on a mix of broad reach and niche targeting. Return only hashtags separated by commas, no explanations.`
          },
          {
            role: 'user',
            content: `Generate 8-12 relevant hashtags for this ${platform} content: "${truncatedText}"`
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      console.warn(`AI hashtag API error: ${response.status}`)
      return []
    }

    const data = await response.json()
    const hashtagText = data.choices?.[0]?.message?.content || ''
    
    // Parse and clean hashtags
    const hashtags = hashtagText
      .split(/[,\n\r]+/)
      .map((tag: string) => tag.trim().replace(/^#?/, '#'))
      .filter((tag: string) => tag.length > 2 && tag.length < 30)
      .filter((tag: string) => /^#[a-zA-Z0-9_]+$/.test(tag))
    
    return hashtags.slice(0, 12)
  } catch (error) {
    console.warn('AI hashtag generation failed:', error)
    return []
  }
}

/**
 * Hybrid hashtag analysis with AI enhancement option
 */
export async function analyzeHashtags(
  text: string, 
  platform: 'twitter' | 'linkedin' | 'instagram',
  aiConfig: AIHashtagConfig = { enabled: false }
): Promise<{ extracted: string[]; suggested: string[]; aiGenerated: string[]; source: 'local' | 'ai' | 'hybrid' }> {
  // Extract existing hashtags
  const extracted = (text.match(/#[a-zA-Z0-9_]+/g) || []).map(tag => tag.toLowerCase())

  // Generate local rule-based hashtags
  const contentAnalysis = extractContentEntities(text)
  let localSuggested = generateSmartHashtags(contentAnalysis, platform)
  
  // Add platform-specific hashtags based on content relevance
  const platformSpecific: Record<string, string[]> = {
    twitter: [
      ...(contentAnalysis.themes.includes('news') ? ['#TwitterNews', '#Breaking'] : []),
      ...(contentAnalysis.themes.includes('tips') ? ['#TwitterTips', '#Thread'] : []),
      ...(contentAnalysis.topics.includes('business') ? ['#BusinessTwitter'] : []),
      ...(contentAnalysis.topics.includes('technology') ? ['#TechTwitter'] : [])
    ],
    linkedin: [
      ...(contentAnalysis.topics.includes('business') ? ['#LinkedIn', '#Professional', '#Career', '#Business'] : []),
      ...(contentAnalysis.topics.includes('education') ? ['#ProfessionalDevelopment', '#Learning'] : []),
      ...(contentAnalysis.themes.includes('tips') ? ['#CareerAdvice', '#ProfessionalTips'] : []),
      '#Networking', '#Industry'
    ],
    instagram: [
      ...(contentAnalysis.topics.includes('creative') ? ['#InstagramCreators', '#ContentCreator', '#Visual'] : []),
      ...(contentAnalysis.topics.includes('health') ? ['#InstaHealth', '#Lifestyle'] : []),
      ...(contentAnalysis.themes.includes('tips') ? ['#LifeTips', '#InspirationalQuotes'] : []),
      '#Daily', '#Motivation'
    ]
  }

  localSuggested.push(...platformSpecific[platform].slice(0, 3))
  
  // Clean and deduplicate local suggestions
  localSuggested = [...new Set(localSuggested)].filter(tag => 
    !extracted.includes(tag.toLowerCase())
  )
  
  // Try AI generation if enabled
  let aiGenerated: string[] = []
  let finalSuggested = localSuggested
  let source: 'local' | 'ai' | 'hybrid' = 'local'
  
  if (aiConfig.enabled) {
    try {
      aiGenerated = await generateAIHashtags(text, platform, aiConfig)
      
      if (aiGenerated.length > 0) {
        // Merge AI and local suggestions intelligently
        const combinedHashtags = [...localSuggested, ...aiGenerated]
        
        // Remove duplicates and existing hashtags
        const uniqueHashtags = [...new Set(combinedHashtags)].filter(tag => 
          !extracted.includes(tag.toLowerCase())
        )
        
        // Prioritize AI suggestions but keep some local ones for platform optimization
        const prioritizedAI = aiGenerated.slice(0, 8)
        const topLocal = localSuggested.slice(0, 4)
        
        finalSuggested = [...new Set([...prioritizedAI, ...topLocal])]
        source = 'hybrid'
      }
    } catch (error) {
      console.warn('AI hashtag generation failed, falling back to local:', error)
      source = 'local'
    }
  }
  
  // Sort by relevance (prioritize content-specific over generic)
  finalSuggested.sort((a, b) => {
    const aIsGeneric = ['#Daily', '#Motivation', '#Tips'].includes(a)
    const bIsGeneric = ['#Daily', '#Motivation', '#Tips'].includes(b)
    if (aIsGeneric && !bIsGeneric) return 1
    if (!aIsGeneric && bIsGeneric) return -1
    return 0
  })
  
  // Limit based on platform best practices
  const maxHashtags = platform === 'instagram' ? 15 : platform === 'twitter' ? 5 : 8
  
  return {
    extracted,
    suggested: finalSuggested.slice(0, maxHashtags),
    aiGenerated,
    source
  }
}

/**
 * Legacy sync version for backward compatibility
 */
export function analyzeHashtagsSync(text: string, platform: 'twitter' | 'linkedin' | 'instagram'): { extracted: string[]; suggested: string[] } {
  // Extract existing hashtags
  const extracted = (text.match(/#[a-zA-Z0-9_]+/g) || []).map(tag => tag.toLowerCase())

  // Perform intelligent content analysis
  const contentAnalysis = extractContentEntities(text)
  
  // Generate smart hashtags based on content
  let suggested = generateSmartHashtags(contentAnalysis, platform)
  
  // Add platform-specific hashtags based on content relevance
  const platformSpecific: Record<string, string[]> = {
    twitter: [
      ...(contentAnalysis.themes.includes('news') ? ['#TwitterNews', '#Breaking'] : []),
      ...(contentAnalysis.themes.includes('tips') ? ['#TwitterTips', '#Thread'] : []),
      ...(contentAnalysis.topics.includes('business') ? ['#BusinessTwitter'] : []),
      ...(contentAnalysis.topics.includes('technology') ? ['#TechTwitter'] : [])
    ],
    linkedin: [
      ...(contentAnalysis.topics.includes('business') ? ['#LinkedIn', '#Professional', '#Career', '#Business'] : []),
      ...(contentAnalysis.topics.includes('education') ? ['#ProfessionalDevelopment', '#Learning'] : []),
      ...(contentAnalysis.themes.includes('tips') ? ['#CareerAdvice', '#ProfessionalTips'] : []),
      '#Networking', '#Industry'
    ],
    instagram: [
      ...(contentAnalysis.topics.includes('creative') ? ['#InstagramCreators', '#ContentCreator', '#Visual'] : []),
      ...(contentAnalysis.topics.includes('health') ? ['#InstaHealth', '#Lifestyle'] : []),
      ...(contentAnalysis.themes.includes('tips') ? ['#LifeTips', '#InspirationalQuotes'] : []),
      '#Daily', '#Motivation'
    ]
  }

  // Add relevant platform-specific tags
  suggested.push(...platformSpecific[platform].slice(0, 3))
  
  // Remove duplicates and filter out existing ones
  suggested = [...new Set(suggested)].filter(tag => 
    !extracted.includes(tag.toLowerCase())
  )
  
  // Sort by relevance (prioritize content-specific over generic)
  suggested.sort((a, b) => {
    const aIsGeneric = ['#Daily', '#Motivation', '#Tips'].includes(a)
    const bIsGeneric = ['#Daily', '#Motivation', '#Tips'].includes(b)
    if (aIsGeneric && !bIsGeneric) return 1
    if (!aIsGeneric && bIsGeneric) return -1
    return 0
  })
  
  // Limit based on platform best practices
  const maxHashtags = platform === 'instagram' ? 15 : platform === 'twitter' ? 5 : 8
  
  return {
    extracted,
    suggested: suggested.slice(0, maxHashtags)
  }
}

/**
 * Detect Call-to-Action phrases
 */
export function analyzeCTA(text: string): { phrases: string[]; strength: 'weak' | 'moderate' | 'strong'; suggestions: string[] } {
  const ctaPhrases = [
    'click here', 'learn more', 'get started', 'sign up', 'subscribe',
    'follow me', 'share this', 'comment below', 'tell me', 'what do you think',
    'try this', 'download', 'join us', 'book now', 'contact us',
    'retweet', 'like if', 'save this', 'tag someone', 'dm me'
  ]

  const foundPhrases = ctaPhrases.filter(phrase => 
    text.toLowerCase().includes(phrase)
  )

  let strength: 'weak' | 'moderate' | 'strong' = 'weak'
  const suggestions: string[] = []

  if (foundPhrases.length === 0) {
    strength = 'weak'
    suggestions.push('Add a clear call-to-action to encourage engagement')
    suggestions.push('Ask a question to prompt responses')
    suggestions.push('Invite readers to share their thoughts')
  } else if (foundPhrases.length <= 2) {
    strength = 'moderate'
    suggestions.push('Consider adding a secondary call-to-action')
  } else {
    strength = 'strong'
  }

  return {
    phrases: foundPhrases,
    strength,
    suggestions
  }
}

/**
 * Comprehensive content analysis
 */
export function analyzeContent(text: string, platform: 'twitter' | 'linkedin' | 'instagram'): ContentAnalysis {
  const words = text.split(/\s+/).filter(w => w.length > 0)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)

  const fleschScore = calculateFleschScore(text)
  const engagement = calculateEngagementScore(text)
  const clarity = assessClarity(text)
  const hashtags = analyzeHashtagsSync(text, platform)
  const cta = analyzeCTA(text)

  return {
    readability: {
      fleschScore,
      readingLevel: getReadingLevel(fleschScore),
      avgWordsPerSentence: sentences.length > 0 ? words.length / sentences.length : 0,
      avgSyllablesPerWord: words.length > 0 ? words.reduce((total, word) => total + countSyllables(word), 0) / words.length : 0
    },
    engagement,
    clarity,
    hashtags,
    metrics: {
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      readingTimeMinutes: Math.ceil(words.length / 200) // Average reading speed
    },
    cta
  }
}

/**
 * Generate content improvement tips based on analysis
 */
export function generateImprovementTips(analysis: ContentAnalysis): string[] {
  const tips: string[] = []

  // Readability tips
  if (analysis.readability.fleschScore < 60) {
    tips.push('🔍 Simplify language: Use shorter sentences and common words for better readability')
  }

  if (analysis.readability.avgWordsPerSentence > 20) {
    tips.push('✂️ Break up long sentences: Aim for 15-20 words per sentence')
  }

  // Engagement tips
  if (analysis.engagement.score < 60) {
    tips.push('⚡ Boost engagement: Add personal stories, questions, or emotional language')
  }

  // Clarity tips
  if (analysis.clarity.score < 70) {
    tips.push('💡 Improve clarity: Use active voice and concrete examples')
  }

  // CTA tips
  if (analysis.cta.strength === 'weak') {
    tips.push('📢 Add call-to-action: Include a clear next step for readers')
  }

  // Length tips
  if (analysis.metrics.wordCount < 100) {
    tips.push('📝 Expand content: Add more detail and examples for better transformation')
  } else if (analysis.metrics.wordCount > 1500) {
    tips.push('✨ Consider breaking into parts: Very long content might work better as a series')
  }

  return tips
}

/**
 * Platform-specific content recommendations
 */
export function getPlatformRecommendations(platform: 'twitter' | 'linkedin' | 'instagram', analysis: ContentAnalysis, text: string): string[] {
  const recommendations: string[] = []

  switch (platform) {
    case 'twitter':
      if (analysis.metrics.wordCount > 800) {
        recommendations.push('🐦 Twitter: Content is long - perfect for a detailed thread')
      }
      if (analysis.hashtags.suggested.length > 5) {
        recommendations.push('🏷️ Twitter: Limit hashtags to 2-3 for better engagement')
      }
      break

    case 'linkedin':
      if (analysis.engagement.score < 70) {
        recommendations.push('💼 LinkedIn: Add professional insights and industry context')
      }
      if (!text.toLowerCase().includes('professional') && !text.toLowerCase().includes('career')) {
        recommendations.push('🎯 LinkedIn: Consider adding career or professional angle')
      }
      break

    case 'instagram':
      if (analysis.cta.strength === 'weak') {
        recommendations.push('📸 Instagram: Add strong visual cues and engagement prompts')
      }
      if (analysis.hashtags.suggested.length < 10) {
        recommendations.push('🏷️ Instagram: Use more hashtags (10-15) for maximum reach')
      }
      break
  }

  return recommendations
}

/**
 * Extract key topics and themes from content
 */
export function extractTopics(text: string): string[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4)

  // Simple frequency analysis for key topics
  const wordFreq: Record<string, number> = {}
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })

  // Get most frequent meaningful words
  const stopWords = new Set([
    'about', 'after', 'again', 'against', 'almost', 'alone', 'along', 'already',
    'also', 'although', 'always', 'among', 'another', 'anyone', 'anything',
    'anywhere', 'around', 'because', 'become', 'before', 'being', 'between',
    'both', 'could', 'every', 'everything', 'everywhere', 'from', 'getting',
    'into', 'itself', 'make', 'many', 'most', 'much', 'never', 'only',
    'other', 'should', 'since', 'some', 'something', 'somewhere', 'still',
    'such', 'take', 'than', 'that', 'their', 'them', 'there', 'these',
    'they', 'this', 'those', 'through', 'very', 'want', 'well', 'were',
    'what', 'when', 'where', 'which', 'while', 'with', 'would', 'your'
  ])

  return Object.entries(wordFreq)
    .filter(([word, freq]) => freq > 1 && !stopWords.has(word))
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word)
}

/**
 * Extract key insights and actionable points from content
 */
export function extractKeyInsights(text: string): string[] {
  const sentences = text.split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20)
  
  // Look for actionable insights, tips, and key statements
  const insightIndicators = [
    'key', 'important', 'crucial', 'essential', 'critical', 'vital',
    'tip', 'strategy', 'approach', 'method', 'technique', 'way',
    'result', 'outcome', 'benefit', 'advantage', 'impact',
    'learn', 'discover', 'find', 'realize', 'understand',
    'should', 'must', 'need', 'require', 'recommend'
  ]
  
  const scoredInsights = sentences.map(sentence => {
    const lowerSentence = sentence.toLowerCase()
    let score = 0
    
    // Score based on insight indicators
    insightIndicators.forEach(indicator => {
      if (lowerSentence.includes(indicator)) score += 2
    })
    
    // Boost score for sentences with numbers/data
    if (/\b\d+(\.\d+)?%?\b/.test(sentence)) score += 3
    
    // Boost score for "how to" and instructional content
    if (/\b(how to|step|guide|process)\b/i.test(sentence)) score += 3
    
    // Boost score for comparative statements
    if (/\b(better|best|more|less|versus|compared|than)\b/i.test(sentence)) score += 1
    
    return { sentence, score }
  })
  
  return scoredInsights
    .filter(item => item.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(item => item.sentence)
    .filter(s => s.length > 0 && s.length < 200) // Filter reasonable lengths
}

/**
 * Extract main themes and value propositions
 */
export function extractMainThemes(text: string): { mainTheme: string; subThemes: string[]; valueProps: string[] } {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 50)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20)
  
  // Extract main theme from first meaningful sentence or paragraph
  const mainTheme = sentences[0]?.trim().slice(0, 100) || 'Content insights'
  
  // Look for sub-themes in headings and topic sentences
  const subThemes: string[] = []
  const lines = text.split('\n')
  
  lines.forEach(line => {
    const trimmed = line.trim()
    // Detect potential headings (short lines with meaningful content)
    if (trimmed.length > 10 && trimmed.length < 80 && 
        !trimmed.includes('.') && 
        (trimmed.match(/^[A-Z]/) || trimmed.includes(':'))) {
      subThemes.push(trimmed)
    }
  })
  
  // Extract value propositions (benefits, outcomes, results)
  const valueIndicators = [
    'benefit', 'advantage', 'result', 'outcome', 'achieve', 'gain',
    'improve', 'increase', 'boost', 'enhance', 'optimize',
    'save', 'reduce', 'eliminate', 'solve', 'fix'
  ]
  
  const valueProps = sentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase()
    return valueIndicators.some(indicator => lowerSentence.includes(indicator))
  }).slice(0, 5)
  
  return {
    mainTheme,
    subThemes: subThemes.slice(0, 5),
    valueProps
  }
}

/**
 * Enhanced content quality assessment
 */
export interface EnhancedContentAnalysis extends ContentAnalysis {
  keyInsights: string[]
  mainThemes: {
    mainTheme: string
    subThemes: string[]
    valueProps: string[]
  }
  transformationReadiness: {
    score: number
    strengths: string[]
    challenges: string[]
  }
}

/**
 * Comprehensive enhanced content analysis
 */
export function enhancedAnalyzeContent(text: string, platform: 'twitter' | 'linkedin' | 'instagram'): EnhancedContentAnalysis {
  const baseAnalysis = analyzeContent(text, platform)
  const keyInsights = extractKeyInsights(text)
  const mainThemes = extractMainThemes(text)
  
  // Assess transformation readiness
  const transformationReadiness = {
    score: 0,
    strengths: [] as string[],
    challenges: [] as string[]
  }
  
  // Calculate transformation readiness score
  let score = 50 // Base score
  
  // Positive factors
  if (keyInsights.length >= 3) {
    score += 15
    transformationReadiness.strengths.push('Rich with actionable insights')
  }
  
  if (baseAnalysis.engagement.score > 70) {
    score += 10
    transformationReadiness.strengths.push('High engagement potential')
  }
  
  if (baseAnalysis.readability.fleschScore > 60) {
    score += 10
    transformationReadiness.strengths.push('Good readability for social media')
  }
  
  if (mainThemes.valueProps.length > 0) {
    score += 10
    transformationReadiness.strengths.push('Clear value propositions')
  }
  
  // Challenging factors
  if (baseAnalysis.metrics.wordCount > 2000) {
    score -= 10
    transformationReadiness.challenges.push('Very long content needs significant condensation')
  }
  
  if (baseAnalysis.clarity.score < 60) {
    score -= 15
    transformationReadiness.challenges.push('Complex language may need simplification')
  }
  
  if (keyInsights.length < 2) {
    score -= 20
    transformationReadiness.challenges.push('Limited actionable insights to extract')
  }
  
  transformationReadiness.score = Math.max(0, Math.min(100, score))
  
  return {
    ...baseAnalysis,
    keyInsights,
    mainThemes,
    transformationReadiness
  }
}
