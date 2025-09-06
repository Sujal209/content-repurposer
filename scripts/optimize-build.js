// Performance optimization script
const { execSync } = require('child_process');

console.log('🚀 Running performance optimizations...');

// Set production environment
process.env.NODE_ENV = 'production';

// Clean build cache (Windows compatible)
console.log('🧹 Cleaning build cache...');
try {
  execSync('rmdir /s /q .next 2>nul || del /q .next 2>nul || echo Cache clean', { stdio: 'inherit', shell: true });
} catch (e) {
  console.log('Cache already clean');
}

// Build with optimizations
console.log('📦 Building with optimizations...');
execSync('next build', { 
  stdio: 'inherit', 
  env: { 
    ...process.env, 
    NODE_ENV: 'production',
    NODE_NO_WARNINGS: '1'
  } 
});

console.log('✅ Performance optimizations complete!');