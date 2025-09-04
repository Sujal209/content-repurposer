/**
 * Prompt Engineering Testing Framework
 * Validates and measures improvement in content generation quality
 */

import { promptEngine, type ContentType, type Platform, type Tone } from './prompt-engine'
import { enhancedAnalyzeContent } from './content-analysis'

export interface TestCase {
  id: string
  name: string
  description: string
  input: {
    content: string
    contentType: ContentType
    platform: Platform
    tone: Tone
  }
  expected: {
    preservesKeyInsights: boolean
    followsFormatSpec: boolean
    maintainsVoice: boolean
    optimizedForPlatform: boolean
    engagementQuality: 'low' | 'medium' | 'high'
  }
}

export interface TestResult {
  testCase: TestCase
  promptResult: any
  qualityScore: number
  passed: boolean
  issues: string[]
  strengths: string[]
}

/**
 * Sample test cases covering different content types and scenarios
 */
export const testCases: TestCase[] = [
  {
    id: 'blog-to-twitter-professional',
    name: 'Blog Post to Twitter Thread (Professional)',
    description: 'Transform a detailed blog post about productivity into a professional Twitter thread',
    input: {
      content: `The Pomodoro Technique: A Complete Guide to Time Management

Time management is one of the most crucial skills for professional success. The Pomodoro Technique, developed by Francesco Cirillo in the late 1980s, has proven to be one of the most effective methods for improving focus and productivity.

The technique is simple: work for 25 minutes, then take a 5-minute break. After four cycles, take a longer 15-30 minute break. This method leverages the psychological principle of time-boxing and helps prevent mental fatigue.

Research from the University of Illinois shows that brief diversions can dramatically improve focus. The technique has been adopted by millions of professionals worldwide and has shown consistent results in improving work quality and reducing procrastination.

Key benefits include:
- Improved focus and concentration
- Better time estimation skills
- Reduced mental fatigue
- Increased awareness of distractions
- Enhanced work-life balance

To implement the Pomodoro Technique effectively, you need a timer, a to-do list, and commitment to the process. Start by choosing your most important task, set the timer for 25 minutes, and work without interruption until the timer rings.`,
      contentType: 'blog',
      platform: 'twitter',
      tone: 'professional'
    },
    expected: {
      preservesKeyInsights: true,
      followsFormatSpec: true,
      maintainsVoice: true,
      optimizedForPlatform: true,
      engagementQuality: 'high'
    }
  },
  {
    id: 'newsletter-to-linkedin-educational',
    name: 'Newsletter to LinkedIn Carousel (Educational)',
    description: 'Transform a newsletter section about remote work trends into LinkedIn content',
    input: {
      content: `Remote Work Revolution: What the Data Really Shows

This week's newsletter dives into the latest remote work statistics that every business leader should know.

According to a Stanford study, remote workers are 13% more productive than their office counterparts. But the story doesn't end there. McKinsey's research reveals that 87% of employees would take a remote work opportunity if offered.

The shift isn't just about productivity—it's about talent retention. Companies offering flexible work arrangements report 25% lower turnover rates. This translates to significant cost savings when you consider that replacing an employee costs 50-200% of their annual salary.

However, remote work isn't without challenges. Communication overhead increases by 23% in fully remote teams, and onboarding new employees takes 40% longer on average.

The key to successful remote work implementation lies in three areas:
1. Robust communication tools and protocols
2. Clear performance metrics and expectations
3. Intentional culture-building activities

Companies that excel in remote work don't just allow it—they redesign their entire operating model around it.`,
      contentType: 'newsletter',
      platform: 'linkedin',
      tone: 'educational'
    },
    expected: {
      preservesKeyInsights: true,
      followsFormatSpec: true,
      maintainsVoice: true,
      optimizedForPlatform: true,
      engagementQuality: 'high'
    }
  },
  {
    id: 'short-tip-to-instagram-casual',
    name: 'Short Tip to Instagram Reel (Casual)',
    description: 'Transform a brief productivity tip into engaging Instagram content',
    input: {
      content: `Quick tip for better focus: Try the 2-minute rule. If something takes less than 2 minutes to complete, do it immediately instead of adding it to your to-do list. This prevents small tasks from piling up and overwhelming you later. It's amazing how much mental clutter this simple rule can eliminate!`,
      contentType: 'general',
      platform: 'instagram',
      tone: 'casual'
    },
    expected: {
      preservesKeyInsights: true,
      followsFormatSpec: true,
      maintainsVoice: true,
      optimizedForPlatform: true,
      engagementQuality: 'medium'
    }
  }
]

/**
 * Evaluate content quality based on various criteria
 */
export function evaluateContentQuality(generated: string, testCase: TestCase): {
  score: number
  issues: string[]
  strengths: string[]
} {
  const issues: string[] = []
  const strengths: string[] = []
  let score = 0

  // Test format compliance
  if (testCase.input.platform === 'twitter') {
    const tweets = generated.split(/\d+\//).filter(t => t.trim().length > 0)
    if (tweets.length >= 3 && tweets.length <= 12) {
      score += 20
      strengths.push('Appropriate thread length')
    } else {
      issues.push('Thread length not optimal (should be 3-12 tweets)')
    }

    // Check character count per tweet
    const tweetLengths = tweets.map(tweet => tweet.trim().length)
    const validLengths = tweetLengths.filter(length => length <= 280)
    if (validLengths.length === tweets.length) {
      score += 15
      strengths.push('All tweets within character limit')
    } else {
      issues.push('Some tweets exceed 280 character limit')
    }
  }

  if (testCase.input.platform === 'linkedin') {
    const slideMatches = generated.match(/SLIDE \d+/g)
    if (generated.includes('SLIDE') && slideMatches && slideMatches.length >= 6) {
      score += 20
      strengths.push('Proper LinkedIn carousel format')
    } else {
      issues.push('Missing proper LinkedIn carousel structure')
    }
  }

  if (testCase.input.platform === 'instagram') {
    if (generated.includes('REELS SCRIPT') && generated.includes('0:00-0:03')) {
      score += 20
      strengths.push('Proper Instagram Reels script format')
    } else {
      issues.push('Missing proper Instagram Reels script structure')
    }
  }

  // Test content preservation
  const originalKeywords = extractKeywords(testCase.input.content)
  const generatedKeywords = extractKeywords(generated)
  const preservedKeywords = originalKeywords.filter(kw => 
    generatedKeywords.some(gkw => gkw.toLowerCase().includes(kw.toLowerCase()))
  )

  if (preservedKeywords.length >= originalKeywords.length * 0.6) {
    score += 15
    strengths.push('Good keyword preservation')
  } else {
    issues.push('Poor preservation of original key concepts')
  }

  // Test engagement elements
  const hasQuestions = generated.includes('?')
  const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(generated)
  const hasCallToAction = /(share|comment|follow|like|save|retweet|what.*think|tell.*me)/i.test(generated)

  if (hasQuestions) {
    score += 10
    strengths.push('Includes engaging questions')
  }

  if (hasEmojis) {
    score += 5
    strengths.push('Uses emojis for visual appeal')
  }

  if (hasCallToAction) {
    score += 10
    strengths.push('Contains call-to-action')
  } else {
    issues.push('Missing clear call-to-action')
  }

  // Test tone consistency
  const toneIndicators = {
    professional: ['research', 'data', 'analysis', 'study', 'professional'],
    casual: ['hey', 'you', 'super', 'awesome', 'totally'],
    educational: ['learn', 'understand', 'step', 'guide', 'how to'],
    humorous: ['funny', 'lol', 'hilarious', 'joke', 'laugh'],
    inspiring: ['achieve', 'dream', 'transform', 'success', 'inspire'],
    conversational: ['I', 'we', 'you', 'our', 'story']
  }

  const expectedToneWords = toneIndicators[testCase.input.tone] || []
  const toneMatches = expectedToneWords.filter(word => 
    generated.toLowerCase().includes(word)
  ).length

  if (toneMatches > 0) {
    score += 10
    strengths.push(`Maintains ${testCase.input.tone} tone`)
  } else {
    issues.push(`Doesn't reflect ${testCase.input.tone} tone`)
  }

  // Test for generic social media clichés (should be avoided)
  const cliches = ['game-changer', 'mind-blown', 'viral', 'absolutely amazing', 'life-changing']
  const clicheCount = cliches.filter(cliche => 
    generated.toLowerCase().includes(cliche)
  ).length

  if (clicheCount === 0) {
    score += 10
    strengths.push('Avoids generic social media clichés')
  } else {
    issues.push('Contains overused social media phrases')
  }

  return {
    score: Math.min(100, score),
    issues,
    strengths
  }
}

/**
 * Extract important keywords from content
 */
function extractKeywords(text: string): string[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4)

  const stopWords = new Set([
    'about', 'after', 'again', 'against', 'always', 'among', 'another', 
    'around', 'because', 'become', 'before', 'being', 'between', 'both',
    'could', 'every', 'everything', 'from', 'getting', 'into', 'itself',
    'make', 'many', 'most', 'much', 'never', 'only', 'other', 'should',
    'since', 'some', 'something', 'still', 'such', 'take', 'than', 'that',
    'their', 'them', 'there', 'these', 'they', 'this', 'those', 'through',
    'very', 'want', 'well', 'were', 'what', 'when', 'where', 'which',
    'while', 'with', 'would', 'your'
  ])

  const wordFreq: Record<string, number> = {}
  words.forEach(word => {
    if (!stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    }
  })

  return Object.entries(wordFreq)
    .filter(([word, freq]) => freq >= 1)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([word]) => word)
}

/**
 * Run all test cases and generate a comprehensive report
 */
export async function runPromptTests(): Promise<{
  overallScore: number
  results: TestResult[]
  summary: {
    passed: number
    failed: number
    avgScore: number
    commonIssues: string[]
    commonStrengths: string[]
  }
}> {
  const results: TestResult[] = []

  for (const testCase of testCases) {
    try {
      // Generate prompt using the enhanced method
      const promptResult = promptEngine.generateContextAwarePrompt({
        contentType: testCase.input.contentType,
        platform: testCase.input.platform,
        tone: testCase.input.tone,
        rawContent: testCase.input.content
      })

      // Simulate generation (in real testing, you'd call the actual API)
      const mockGenerated = `Generated content for ${testCase.input.platform} would go here...`
      
      // Evaluate quality
      const evaluation = evaluateContentQuality(mockGenerated, testCase)
      
      const result: TestResult = {
        testCase,
        promptResult,
        qualityScore: evaluation.score,
        passed: evaluation.score >= 70, // 70% is our passing threshold
        issues: evaluation.issues,
        strengths: evaluation.strengths
      }

      results.push(result)
    } catch (error) {
      console.error(`Test case ${testCase.id} failed:`, error)
      results.push({
        testCase,
        promptResult: null,
        qualityScore: 0,
        passed: false,
        issues: [`Test execution failed: ${error}`],
        strengths: []
      })
    }
  }

  // Calculate summary statistics
  const passed = results.filter(r => r.passed).length
  const failed = results.length - passed
  const avgScore = results.reduce((sum, r) => sum + r.qualityScore, 0) / results.length

  // Find common issues and strengths
  const allIssues = results.flatMap(r => r.issues)
  const allStrengths = results.flatMap(r => r.strengths)

  const issueFreq: Record<string, number> = {}
  allIssues.forEach(issue => {
    issueFreq[issue] = (issueFreq[issue] || 0) + 1
  })

  const strengthFreq: Record<string, number> = {}
  allStrengths.forEach(strength => {
    strengthFreq[strength] = (strengthFreq[strength] || 0) + 1
  })

  const commonIssues = Object.entries(issueFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([issue]) => issue)

  const commonStrengths = Object.entries(strengthFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([strength]) => strength)

  return {
    overallScore: avgScore,
    results,
    summary: {
      passed,
      failed,
      avgScore,
      commonIssues,
      commonStrengths
    }
  }
}

/**
 * Test specific improvements in prompt engineering
 */
export function testPromptImprovements(originalContent: string, platform: Platform): {
  original: any
  enhanced: any
  improvements: string[]
} {
  // Test original prompt method
  const originalPrompt = promptEngine.generatePrompt({
    contentType: 'general',
    platform,
    tone: 'professional',
    rawContent: originalContent
  })

  // Test enhanced prompt method
  const enhancedPrompt = promptEngine.generateContextAwarePrompt({
    contentType: 'general',
    platform,
    tone: 'professional',
    rawContent: originalContent
  })

  // Compare improvements
  const improvements: string[] = []

  if (enhancedPrompt.enhancedAnalysis.keyInsights.length > 0) {
    improvements.push(`Enhanced analysis extracted ${enhancedPrompt.enhancedAnalysis.keyInsights.length} key insights`)
  }

  if (enhancedPrompt.enhancedAnalysis.transformationReadiness.score > 60) {
    improvements.push(`High transformation readiness score: ${enhancedPrompt.enhancedAnalysis.transformationReadiness.score}/100`)
  }

  if (enhancedPrompt.recommendedTemperature !== 0.7) {
    improvements.push(`Optimized temperature: ${enhancedPrompt.recommendedTemperature} (was 0.7)`)
  }

  if (enhancedPrompt.systemMessage.length > originalPrompt.systemMessage.length * 1.2) {
    improvements.push('Enhanced prompt includes more detailed context and constraints')
  }

  return {
    original: originalPrompt,
    enhanced: enhancedPrompt,
    improvements
  }
}

/**
 * Benchmark content transformation quality
 */
export interface QualityBenchmark {
  contentPreservation: number // How well original insights are preserved
  formatCompliance: number    // How well platform format specs are followed
  engagementOptimization: number // How well content is optimized for engagement
  voiceConsistency: number    // How well original voice is maintained
  overallQuality: number      // Weighted average of all factors
}

export function benchmarkQuality(originalContent: string, generatedContent: string, platform: Platform): QualityBenchmark {
  let contentPreservation = 0
  let formatCompliance = 0
  let engagementOptimization = 0
  let voiceConsistency = 0

  // Analyze content preservation
  const originalAnalysis = enhancedAnalyzeContent(originalContent, platform)
  const originalKeywords = extractKeywords(originalContent)
  const generatedKeywords = extractKeywords(generatedContent)
  
  const preservedKeywords = originalKeywords.filter(kw => 
    generatedKeywords.some(gkw => gkw.toLowerCase().includes(kw.toLowerCase()))
  )
  contentPreservation = (preservedKeywords.length / originalKeywords.length) * 100

  // Test format compliance
  switch (platform) {
    case 'twitter':
      const tweets = generatedContent.split(/\d+\//).filter(t => t.trim().length > 0)
      const validTweets = tweets.filter(tweet => tweet.trim().length <= 280)
      formatCompliance = (validTweets.length / tweets.length) * 100
      break
    
    case 'linkedin':
      const hasSlides = /SLIDE \d+/.test(generatedContent)
      const slideCount = (generatedContent.match(/SLIDE \d+/g) || []).length
      formatCompliance = hasSlides && slideCount >= 6 && slideCount <= 8 ? 100 : 50
      break
    
    case 'instagram':
      const hasTimeStamps = /\d+:\d+-\d+:\d+/.test(generatedContent)
      const hasVisualCues = /\[.*\]/.test(generatedContent)
      formatCompliance = hasTimeStamps && hasVisualCues ? 100 : 50
      break
  }

  // Test engagement optimization
  const hasQuestions = generatedContent.includes('?')
  const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]/u.test(generatedContent)
  const hasCTA = /(share|comment|follow|save|what.*think)/i.test(generatedContent)
  
  engagementOptimization = 0
  if (hasQuestions) engagementOptimization += 33
  if (hasEmojis) engagementOptimization += 33
  if (hasCTA) engagementOptimization += 34

  // Test voice consistency (simplified check)
  const originalTone = originalAnalysis.engagement.score
  const hasPersonalElements = /(I|we|our|my|experience)/i.test(generatedContent)
  const hasProfessionalElements = /(research|data|study|analysis)/i.test(generatedContent)
  
  voiceConsistency = 70 // Base score
  if (originalTone > 60 && hasPersonalElements) voiceConsistency += 15
  if (originalAnalysis.clarity.score > 70 && hasProfessionalElements) voiceConsistency += 15

  const overallQuality = (
    contentPreservation * 0.3 +
    formatCompliance * 0.25 +
    engagementOptimization * 0.25 +
    voiceConsistency * 0.2
  )

  return {
    contentPreservation,
    formatCompliance,
    engagementOptimization,
    voiceConsistency,
    overallQuality
  }
}

/**
 * Generate improvement recommendations based on test results
 */
export function generateImprovementRecommendations(results: TestResult[]): string[] {
  const recommendations: string[] = []
  const failedTests = results.filter(r => !r.passed)
  
  if (failedTests.length > 0) {
    const commonFailures = failedTests.flatMap(t => t.issues)
    const failureFreq: Record<string, number> = {}
    
    commonFailures.forEach(failure => {
      failureFreq[failure] = (failureFreq[failure] || 0) + 1
    })
    
    const topFailures = Object.entries(failureFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
    
    topFailures.forEach(([failure, count]) => {
      if (count > 1) {
        recommendations.push(`Address common issue: ${failure} (affects ${count} test cases)`)
      }
    })
  }

  const avgScore = results.reduce((sum, r) => sum + r.qualityScore, 0) / results.length
  if (avgScore < 80) {
    recommendations.push('Overall quality score is below 80% - consider prompt refinements')
  }

  return recommendations
}
