# Environment Setup Guide

## Overview

RepurposeMate uses a robust environment variable system with validation, separate configurations for different environments, and production readiness checks.

## Environment Files

### 📁 File Structure
```
.env.example          # Template with all variables (committed)
.env.local           # Local development (not committed)
.env.development     # Development overrides (not committed)
.env.staging         # Staging configuration (not committed)
.env.production      # Production configuration (not committed)
```

### 🔒 Security
- **NEVER** commit actual environment files with secrets
- Only `.env.example` should be committed to git
- All other `.env.*` files are ignored by git

## Required Variables

### Core Services
```bash
# Supabase Database & Authentication
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI Content Generation (at least one required)
OPENROUTER_API_KEY=sk-or-your-key-here
OPENAI_API_KEY=sk-your-openai-key-here

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Usage Limits
```bash
NEXT_PUBLIC_FREE_DAILY_LIMIT=3
NEXT_PUBLIC_PRO_DAILY_LIMIT=200
NEXT_PUBLIC_ENTERPRISE_DAILY_LIMIT=2000
```

## Optional Services

### Email Service (Zoho)
```bash
ZOHO_SMTP_HOST=smtp.zoho.in
ZOHO_SMTP_USER=your-email@domain.com
ZOHO_SMTP_PASS=your-app-password
```

### Analytics & Monitoring
```bash
VERCEL_ANALYTICS_ID=your-analytics-id
SENTRY_DSN=your-sentry-dsn
```

## Environment-Specific Setup

### 🛠️ Development
1. Copy `.env.example` to `.env.local`
2. Fill in your development credentials
3. Run `npm run verify-env` to validate

### 🚀 Production
1. Copy `.env.example` to `.env.production`
2. Update all placeholder values
3. Set production URLs (no localhost)
4. Run `npm run verify-env:prod` before deployment

### 🧪 Staging
1. Copy `.env.example` to `.env.staging`
2. Use staging-specific URLs and credentials
3. Enable staging-specific features

## Validation & Verification

### Automatic Validation
The app automatically validates environment variables on startup:
```typescript
import { envConfig, getEnvStatus } from '@/lib/env-config'

// Access validated config
const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL

// Check configuration status
const status = getEnvStatus()
```

### Manual Verification
```bash
# Verify all environments
npm run verify-env

# Verify production specifically
npm run verify-env:prod

# Build with verification
npm run build:prod
```

## Deployment Checklist

### Before Deployment
- [ ] Run `npm run verify-env:prod`
- [ ] Ensure no localhost URLs in production
- [ ] Verify all API keys are valid
- [ ] Check Supabase configuration
- [ ] Test AI API connectivity

### Production Requirements
- [ ] `NEXT_PUBLIC_APP_URL` points to production domain
- [ ] At least one AI API key configured
- [ ] Supabase URL is production-ready
- [ ] No placeholder values remain
- [ ] Optional: Error tracking (Sentry)
- [ ] Optional: Analytics configured

## Troubleshooting

### Common Issues

**Missing Environment Variables**
```bash
Error: Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL
```
Solution: Add the missing variable to your `.env.local` file

**Invalid URL Format**
```bash
Error: Invalid URL format for NEXT_PUBLIC_APP_URL: localhost:3000
```
Solution: Use full URL with protocol: `http://localhost:3000`

**AI API Not Configured**
```bash
Error: At least one AI API key is required
```
Solution: Add either `OPENROUTER_API_KEY` or `OPENAI_API_KEY`

### Debug Commands
```bash
# Check environment status
node -e "console.log(require('./src/lib/env-config').getEnvStatus())"

# Verify specific environment
NODE_ENV=production npm run verify-env
```

## Best Practices

### Security
1. **Never hardcode secrets** in source code
2. **Use different keys** for different environments
3. **Rotate keys regularly** in production
4. **Limit API key permissions** where possible

### Organization
1. **Group related variables** with comments
2. **Use consistent naming** conventions
3. **Document required vs optional** variables
4. **Keep examples up to date**

### Deployment
1. **Verify before deploying** with scripts
2. **Use environment-specific configs**
3. **Monitor for missing variables** in production
4. **Have rollback plan** for configuration issues

## Environment Variables Reference

| Variable | Required | Environment | Description |
|----------|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | All | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | All | Supabase anonymous key |
| `OPENROUTER_API_KEY` | ⚠️* | All | OpenRouter API key |
| `OPENAI_API_KEY` | ⚠️* | All | OpenAI API key |
| `NEXT_PUBLIC_APP_URL` | ✅ | All | Application base URL |
| `ZOHO_SMTP_HOST` | ❌ | All | Email service host |
| `ZOHO_SMTP_USER` | ❌ | All | Email service user |
| `ZOHO_SMTP_PASS` | ❌ | All | Email service password |
| `VERCEL_ANALYTICS_ID` | ❌ | Prod | Analytics tracking ID |
| `SENTRY_DSN` | ❌ | Prod | Error tracking DSN |

*At least one AI API key is required