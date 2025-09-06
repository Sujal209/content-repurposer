#!/usr/bin/env node

/**
 * Environment Variable Verification Script
 * Run this before deployment to ensure all required variables are set
 */

const fs = require('fs')
const path = require('path')

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function loadEnvFile(envPath) {
  try {
    const content = fs.readFileSync(envPath, 'utf8')
    const env = {}
    
    content.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim()
        }
      }
    })
    
    return env
  } catch (error) {
    return null
  }
}

function validateUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function checkEnvironment(envName, envPath) {
  log(`\n${colors.bold}🔍 Checking ${envName} Environment${colors.reset}`)
  log(`📁 File: ${envPath}`)
  
  const env = loadEnvFile(envPath)
  if (!env) {
    log(`❌ Environment file not found or unreadable`, 'red')
    return false
  }
  
  const issues = []
  const warnings = []
  
  // Required variables
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_APP_URL'
  ]
  
  required.forEach(key => {
    if (!env[key]) {
      issues.push(`Missing required variable: ${key}`)
    } else if (key.includes('URL') && !validateUrl(env[key])) {
      issues.push(`Invalid URL format for ${key}: ${env[key]}`)
    }
  })
  
  // AI API check
  if (!env.OPENROUTER_API_KEY && !env.OPENAI_API_KEY) {
    issues.push('At least one AI API key required: OPENROUTER_API_KEY or OPENAI_API_KEY')
  }
  
  // Environment-specific checks
  if (envName === 'Production') {
    if (env.NEXT_PUBLIC_APP_URL && env.NEXT_PUBLIC_APP_URL.includes('localhost')) {
      issues.push('Production APP_URL should not contain localhost')
    }
    
    if (!env.SENTRY_DSN) {
      warnings.push('Consider adding SENTRY_DSN for error tracking in production')
    }
    
    if (!env.VERCEL_ANALYTICS_ID) {
      warnings.push('Consider adding VERCEL_ANALYTICS_ID for analytics in production')
    }
  }
  
  // Security checks
  const sensitiveKeys = ['API_KEY', 'SECRET', 'PASS', 'TOKEN']
  Object.keys(env).forEach(key => {
    const value = env[key]
    if (sensitiveKeys.some(sensitive => key.includes(sensitive))) {
      if (value.length < 10) {
        warnings.push(`${key} appears to be too short for a secure credential`)
      }
      if (value.includes('your-') || value.includes('placeholder')) {
        issues.push(`${key} contains placeholder value: ${value}`)
      }
    }
  })
  
  // Report results
  if (issues.length === 0) {
    log(`✅ Environment validation passed`, 'green')
  } else {
    log(`❌ Environment validation failed:`, 'red')
    issues.forEach(issue => log(`   • ${issue}`, 'red'))
  }
  
  if (warnings.length > 0) {
    log(`⚠️  Warnings:`, 'yellow')
    warnings.forEach(warning => log(`   • ${warning}`, 'yellow'))
  }
  
  return issues.length === 0
}

function main() {
  log(`${colors.bold}🔐 Environment Variable Verification${colors.reset}`)
  log(`${colors.blue}RepurposeMate - Content Repurposer${colors.reset}`)
  
  const rootDir = path.resolve(__dirname, '..')
  const environments = [
    { name: 'Development', file: '.env.development' },
    { name: 'Local', file: '.env.local' },
    { name: 'Staging', file: '.env.staging' },
    { name: 'Production', file: '.env.production' }
  ]
  
  let allPassed = true
  
  environments.forEach(({ name, file }) => {
    const envPath = path.join(rootDir, file)
    const passed = checkEnvironment(name, envPath)
    if (!passed) allPassed = false
  })
  
  log(`\n${colors.bold}📋 Summary${colors.reset}`)
  if (allPassed) {
    log(`✅ All environment configurations are valid`, 'green')
    log(`🚀 Ready for deployment`, 'green')
  } else {
    log(`❌ Some environment configurations have issues`, 'red')
    log(`🛠️  Please fix the issues before deploying`, 'yellow')
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { checkEnvironment, loadEnvFile }