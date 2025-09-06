/**
 * Environment Configuration and Validation
 * Ensures all required environment variables are present and valid
 */

interface EnvConfig {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  
  // AI APIs
  OPENROUTER_API_KEY?: string
  OPENAI_API_KEY?: string
  
  // App Configuration
  NEXT_PUBLIC_APP_URL: string
  NODE_ENV: 'development' | 'production' | 'test'
  
  // Usage Limits
  NEXT_PUBLIC_FREE_DAILY_LIMIT: number
  NEXT_PUBLIC_PRO_DAILY_LIMIT: number
  NEXT_PUBLIC_ENTERPRISE_DAILY_LIMIT: number
  
  // Optional Services
  ZOHO_SMTP_HOST?: string
  ZOHO_SMTP_USER?: string
  ZOHO_SMTP_PASS?: string
  VERCEL_ANALYTICS_ID?: string
  SENTRY_DSN?: string
}

function validateEnvVar(name: string, value: string | undefined, required = true): string {
  if (!value && required) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value || ''
}

function validateUrl(name: string, value: string | undefined, required = true): string {
  const url = validateEnvVar(name, value, required)
  if (url && !url.startsWith('http')) {
    throw new Error(`Invalid URL format for ${name}: ${url}`)
  }
  return url
}

function validateNumber(name: string, value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue
  const num = parseInt(value, 10)
  if (isNaN(num)) {
    throw new Error(`Invalid number format for ${name}: ${value}`)
  }
  return num
}

function loadEnvConfig(): EnvConfig {
  try {
    // Core required variables
    const config: EnvConfig = {
      NEXT_PUBLIC_SUPABASE_URL: validateUrl('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: validateEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      NEXT_PUBLIC_APP_URL: validateUrl('NEXT_PUBLIC_APP_URL', process.env.NEXT_PUBLIC_APP_URL),
      NODE_ENV: (process.env.NODE_ENV as any) || 'development',
      
      // AI API keys (at least one required)
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      
      // Usage limits with defaults
      NEXT_PUBLIC_FREE_DAILY_LIMIT: validateNumber('NEXT_PUBLIC_FREE_DAILY_LIMIT', process.env.NEXT_PUBLIC_FREE_DAILY_LIMIT, 3),
      NEXT_PUBLIC_PRO_DAILY_LIMIT: validateNumber('NEXT_PUBLIC_PRO_DAILY_LIMIT', process.env.NEXT_PUBLIC_PRO_DAILY_LIMIT, 200),
      NEXT_PUBLIC_ENTERPRISE_DAILY_LIMIT: validateNumber('NEXT_PUBLIC_ENTERPRISE_DAILY_LIMIT', process.env.NEXT_PUBLIC_ENTERPRISE_DAILY_LIMIT, 2000),
      
      // Optional services
      ZOHO_SMTP_HOST: process.env.ZOHO_SMTP_HOST,
      ZOHO_SMTP_USER: process.env.ZOHO_SMTP_USER,
      ZOHO_SMTP_PASS: process.env.ZOHO_SMTP_PASS,
      VERCEL_ANALYTICS_ID: process.env.VERCEL_ANALYTICS_ID,
      SENTRY_DSN: process.env.SENTRY_DSN,
    }
    
    // Validate AI API availability (only in production)
    if (config.NODE_ENV === 'production' && !config.OPENROUTER_API_KEY && !config.OPENAI_API_KEY) {
      throw new Error('At least one AI API key is required: OPENROUTER_API_KEY or OPENAI_API_KEY')
    }
    
    return config
  } catch (error) {
    console.error('❌ Environment validation failed:', error)
    throw error
  }
}

// Load and validate configuration
export const envConfig = loadEnvConfig()

// Environment-specific helpers
export const isDevelopment = envConfig.NODE_ENV === 'development'
export const isProduction = envConfig.NODE_ENV === 'production'
export const isTest = envConfig.NODE_ENV === 'test'

// API availability checks
export const hasOpenRouter = !!envConfig.OPENROUTER_API_KEY
export const hasOpenAI = !!envConfig.OPENAI_API_KEY
export const hasAnyAI = hasOpenRouter || hasOpenAI
export const hasEmailService = !!(envConfig.ZOHO_SMTP_HOST && envConfig.ZOHO_SMTP_USER && envConfig.ZOHO_SMTP_PASS)

// Validation status for debugging
export function getEnvStatus() {
  return {
    environment: envConfig.NODE_ENV,
    supabaseConfigured: !!(envConfig.NEXT_PUBLIC_SUPABASE_URL && envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    aiApiConfigured: hasAnyAI,
    openRouterAvailable: hasOpenRouter,
    openAIAvailable: hasOpenAI,
    emailConfigured: hasEmailService,
    analyticsConfigured: !!envConfig.VERCEL_ANALYTICS_ID,
    errorTrackingConfigured: !!envConfig.SENTRY_DSN,
    appUrl: envConfig.NEXT_PUBLIC_APP_URL,
  }
}

// Production readiness check
export function checkProductionReadiness(): { ready: boolean; issues: string[] } {
  const issues: string[] = []
  
  if (!isProduction) {
    return { ready: true, issues: [] }
  }
  
  // Production-specific checks
  if (envConfig.NEXT_PUBLIC_APP_URL.includes('localhost')) {
    issues.push('APP_URL still points to localhost in production')
  }
  
  if (!hasOpenRouter && !hasOpenAI) {
    issues.push('No AI API configured for production')
  }
  
  if (!envConfig.NEXT_PUBLIC_SUPABASE_URL.includes('supabase.co')) {
    issues.push('Supabase URL may not be production-ready')
  }
  
  return {
    ready: issues.length === 0,
    issues
  }
}