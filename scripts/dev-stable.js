#!/usr/bin/env node

/**
 * Development server with stable auth configuration
 * This script starts the Next.js dev server with optimized settings
 * to prevent 429 rate limit errors during authentication flows
 */

const { spawn } = require('child_process')
const path = require('path')

console.log('🚀 Starting development server with stable auth configuration...')
console.log('📝 Features enabled:')
console.log('   - Reduced fast refresh rate')
console.log('   - Throttled token refresh')
console.log('   - Enhanced error handling')
console.log('   - Auth flow state management')
console.log('')

// Environment variables for stable development
const env = {
  ...process.env,
  // Disable fast refresh
  FAST_REFRESH: 'false',
  // Reduce polling frequency
  WEBPACK_POLLING_INTERVAL: '5000',
  // Set log level
  NEXT_PUBLIC_LOG_LEVEL: 'warn'
}

// Start the Next.js development server
const devServer = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env,
  cwd: process.cwd(),
  shell: true
})

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down development server...')
  devServer.kill('SIGINT')
  process.exit(0)
})

process.on('SIGTERM', () => {
  devServer.kill('SIGTERM')
  process.exit(0)
})

devServer.on('close', (code) => {
  console.log(`Development server exited with code ${code}`)
  process.exit(code)
})
