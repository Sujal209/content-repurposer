/**
 * Test Script for Prompt Engineering Improvements
 * Run this to see the difference between old and new prompting methods
 */

const { promptEngine } = require('./src/lib/prompt-engine')
const { testPromptImprovements, benchmarkQuality } = require('./src/lib/prompt-testing')

// Sample content for testing
const sampleContent = `
AI and the Future of Content Creation

Artificial intelligence is revolutionizing how we create and consume content. From automated writing assistants to sophisticated video generation tools, AI is transforming every aspect of the content creation pipeline.

The key benefits include:
- 50% reduction in content creation time
- Improved consistency across different platforms
- Enhanced personalization at scale
- Better data-driven content optimization

However, challenges remain. AI-generated content can lack the human touch that audiences crave. The solution lies in hybrid approaches that combine AI efficiency with human creativity and emotional intelligence.

Companies that embrace this hybrid model are seeing 3x better engagement rates compared to those using purely manual or purely automated approaches.
`

async function runTests() {
  console.log('🚀 Testing Prompt Engineering Improvements\n')
  
  // Test improvements for each platform
  const platforms = ['twitter', 'linkedin', 'instagram']
  
  for (const platform of platforms) {
    console.log(`\n📱 Testing ${platform.toUpperCase()} Transformation:`)
    console.log('=' .repeat(50))
    
    try {
      const comparison = testPromptImprovements(sampleContent, platform)
      
      console.log('\n📈 Improvements Detected:')
      comparison.improvements.forEach(improvement => {
        console.log(`  ✅ ${improvement}`)
      })
      
      console.log(`\n🧠 Enhanced Analysis Insights:`)
      if (comparison.enhanced.enhancedAnalysis) {
        const analysis = comparison.enhanced.enhancedAnalysis
        console.log(`  • Main Theme: ${analysis.mainThemes.mainTheme.slice(0, 60)}...`)
        console.log(`  • Key Insights: ${analysis.keyInsights.length} extracted`)
        console.log(`  • Transformation Readiness: ${analysis.transformationReadiness.score}/100`)
        console.log(`  • Recommended Temperature: ${comparison.enhanced.recommendedTemperature}`)
        
        if (analysis.transformationReadiness.strengths.length > 0) {
          console.log(`  • Strengths: ${analysis.transformationReadiness.strengths.join(', ')}`)
        }
        
        if (analysis.transformationReadiness.challenges.length > 0) {
          console.log(`  • Challenges: ${analysis.transformationReadiness.challenges.join(', ')}`)
        }
      }
      
      console.log(`\n📊 Prompt Quality Comparison:`)
      console.log(`  • Original prompt length: ${comparison.original.systemMessage.length} chars`)
      console.log(`  • Enhanced prompt length: ${comparison.enhanced.systemMessage.length} chars`)
      console.log(`  • Improvement ratio: ${(comparison.enhanced.systemMessage.length / comparison.original.systemMessage.length).toFixed(2)}x`)
      
    } catch (error) {
      console.error(`❌ Error testing ${platform}:`, error.message)
    }
  }
  
  console.log('\n' + '='.repeat(70))
  console.log('✨ SUMMARY OF PROMPT ENGINEERING IMPROVEMENTS')
  console.log('='.repeat(70))
  console.log(`
🎯 Key Enhancements Made:
  1. Structured prompting with clear formatting requirements
  2. Enhanced content analysis extracting key insights and themes  
  3. Context-aware temperature optimization
  4. Platform-specific format templates and constraints
  5. Better content preservation through detailed analysis
  6. Adaptive prompting strategies based on content characteristics

📈 Expected Quality Improvements:
  • More consistent output formatting
  • Better preservation of original insights
  • Optimized engagement for each platform
  • Reduced generic social media language
  • Context-appropriate AI model parameters

🧪 Next Steps:
  1. Test with real content in your application
  2. Monitor output quality improvements
  3. Collect user feedback on generated content
  4. Fine-tune based on performance metrics
  `)
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = { runTests }
