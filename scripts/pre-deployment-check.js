#!/usr/bin/env node

/**
 * Pre-deployment validation script
 * Checks all critical requirements before deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 ContentCraft Pre-Deployment Check\n');

let hasErrors = false;
let hasWarnings = false;

function error(message) {
  console.log(`❌ ERROR: ${message}`);
  hasErrors = true;
}

function warning(message) {
  console.log(`⚠️  WARNING: ${message}`);
  hasWarnings = true;
}

function success(message) {
  console.log(`✅ ${message}`);
}

function info(message) {
  console.log(`ℹ️  ${message}`);
}

// Check environment variables
function checkEnvironment() {
  console.log('\n📋 Checking Environment Configuration...');
  
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    error('.env.local file not found');
    return;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Required variables
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'OPENROUTER_API_KEY',
    'NEXTAUTH_SECRET',
    'CSRF_SECRET'
  ];
  
  required.forEach(key => {
    if (envContent.includes(`${key}=`) && !envContent.includes(`${key}=your-`) && !envContent.includes(`${key}=generate-`)) {
      success(`${key} is configured`);
    } else {
      error(`${key} is missing or using placeholder value`);
    }
  });
  
  // Check for localhost URLs in production
  if (envContent.includes('localhost:3000')) {
    warning('Found localhost URLs - update NEXT_PUBLIC_APP_URL for production');
  }
  
  // Check for development secrets
  if (envContent.includes('contentcraft-super-secret-key-2025')) {
    warning('Using development NEXTAUTH_SECRET - generate new one for production');
  }
}

// Check critical files
function checkFiles() {
  console.log('\n📁 Checking Critical Files...');
  
  const criticalFiles = [
    'package.json',
    'next.config.ts',
    'middleware.ts',
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'vercel.json'
  ];
  
  criticalFiles.forEach(file => {
    if (fs.existsSync(path.join(process.cwd(), file))) {
      success(`${file} exists`);
    } else {
      error(`${file} is missing`);
    }
  });
  
  // Check favicon
  const faviconPath = path.join(process.cwd(), 'public', 'favicon.ico');
  if (fs.existsSync(faviconPath)) {
    const faviconContent = fs.readFileSync(faviconPath, 'utf8');
    if (faviconContent.includes('Placeholder')) {
      warning('favicon.ico is still a placeholder - replace with actual icon');
    } else {
      success('favicon.ico exists');
    }
  } else {
    error('favicon.ico is missing');
  }
}

// Check package.json
function checkPackageJson() {
  console.log('\n📦 Checking Package Configuration...');
  
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (pkg.scripts && pkg.scripts.build) {
      success('Build script is configured');
    } else {
      error('Build script is missing');
    }
    
    if (pkg.scripts && pkg.scripts.start) {
      success('Start script is configured');
    } else {
      error('Start script is missing');
    }
    
    // Check for required dependencies
    const requiredDeps = [
      'next',
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'tailwindcss'
    ];
    
    requiredDeps.forEach(dep => {
      if (pkg.dependencies && pkg.dependencies[dep]) {
        success(`${dep} dependency found`);
      } else {
        error(`${dep} dependency is missing`);
      }
    });
    
  } catch (err) {
    error('Failed to parse package.json');
  }
}

// Check database migration
function checkDatabase() {
  console.log('\n🗄️  Checking Database Configuration...');
  
  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20250103000000_add_content_analysis_column.sql');
  if (fs.existsSync(migrationPath)) {
    success('Database migration file exists');
    info('Remember to run this migration on production Supabase');
  } else {
    error('Database migration file is missing');
  }
  
  // Check if Supabase configuration guide exists
  if (fs.existsSync('SUPABASE_CONFIGURATION.md')) {
    success('Supabase configuration guide exists');
    info('Follow the guide to configure rate limiting');
  } else {
    warning('Supabase configuration guide is missing');
  }
}

// Check TypeScript configuration
function checkTypeScript() {
  console.log('\n🔧 Checking TypeScript Configuration...');
  
  if (fs.existsSync('tsconfig.json')) {
    success('TypeScript configuration exists');
  } else {
    error('tsconfig.json is missing');
  }
  
  if (fs.existsSync('next-env.d.ts')) {
    success('Next.js TypeScript definitions exist');
  } else {
    warning('next-env.d.ts is missing - run npm run dev to generate');
  }
}

// Check security configuration
function checkSecurity() {
  console.log('\n🔒 Checking Security Configuration...');
  
  const middlewarePath = path.join(process.cwd(), 'middleware.ts');
  if (fs.existsSync(middlewarePath)) {
    const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
    
    if (middlewareContent.includes('X-Frame-Options')) {
      success('Security headers are configured');
    } else {
      warning('Security headers might be missing');
    }
    
    if (middlewareContent.includes('Content-Security-Policy')) {
      success('CSP headers are configured');
    } else {
      warning('CSP headers might be missing');
    }
  } else {
    error('middleware.ts is missing');
  }
}

// Main execution
async function main() {
  checkEnvironment();
  checkFiles();
  checkPackageJson();
  checkDatabase();
  checkTypeScript();
  checkSecurity();
  
  console.log('\n📊 Summary:');
  
  if (hasErrors) {
    console.log('❌ DEPLOYMENT BLOCKED: Fix all errors before deploying');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('⚠️  DEPLOYMENT READY WITH WARNINGS: Address warnings for optimal deployment');
    console.log('\n🚀 You can proceed with deployment, but consider fixing warnings first.');
  } else {
    console.log('✅ ALL CHECKS PASSED: Ready for deployment!');
    console.log('\n🎉 Your ContentCraft application is ready to go live!');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Update production environment variables');
  console.log('2. Run database migration on production Supabase');
  console.log('3. Replace placeholder favicon with actual icon');
  console.log('4. Test deployment in staging environment first');
  console.log('5. Deploy to production');
  
  console.log('\n📚 Helpful Commands:');
  console.log('npm run build          # Test production build');
  console.log('npm run start          # Test production server locally');
  console.log('npx vercel --prod      # Deploy to Vercel');
}

main().catch(console.error);