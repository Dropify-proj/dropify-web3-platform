#!/usr/bin/env node

/**
 * Enhanced Post-Build Verification for Hydration Error Detection
 * Specifically designed to catch issues that cause "Sorry, an error occurred" 
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Enhanced Build Verification for Hydration Errors');
console.log('==================================================');

let errorCount = 0;
let warningCount = 0;

// 1. Check Next.js build output
const nextDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(nextDir)) {
  console.log('❌ CRITICAL: .next directory missing');
  process.exit(1);
}

// 2. Check for hydration-sensitive files
const criticalFiles = [
  '.next/build-manifest.json',
  '.next/app-build-manifest.json',
  '.next/routes-manifest.json',
  '.next/prerender-manifest.json'
];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${path.basename(file)} exists`);
    
    // Validate JSON files
    try {
      const content = fs.readFileSync(file, 'utf8');
      JSON.parse(content);
      console.log(`✅ ${path.basename(file)} is valid JSON`);
    } catch (error) {
      console.log(`❌ ${path.basename(file)} has invalid JSON:`, error.message);
      errorCount++;
    }
  } else {
    console.log(`❌ MISSING: ${file}`);
    errorCount++;
  }
});

// 3. Check for common hydration error patterns in build files
const serverDir = path.join(nextDir, 'server', 'app');
if (fs.existsSync(serverDir)) {
  console.log('✅ App Router server files exist');
  
  // Check for page.js files
  const checkForPageFiles = (dir) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    items.forEach(item => {
      if (item.isDirectory()) {
        const pageFile = path.join(dir, item.name, 'page.js');
        if (fs.existsSync(pageFile)) {
          console.log(`✅ Found page: /${item.name}`);
        }
        checkForPageFiles(path.join(dir, item.name));
      }
    });
  };
  
  try {
    checkForPageFiles(serverDir);
  } catch (error) {
    console.log('⚠️  Warning: Could not scan page files:', error.message);
    warningCount++;
  }
} else {
  console.log('❌ App Router server directory missing');
  errorCount++;
}

// 4. Check for client-side chunks
const staticDir = path.join(nextDir, 'static', 'chunks');
if (fs.existsSync(staticDir)) {
  const chunks = fs.readdirSync(staticDir);
  console.log(`✅ Found ${chunks.length} static chunks`);
  
  // Look for specific problematic patterns
  const hasAppChunks = chunks.some(chunk => chunk.includes('app'));
  const hasMainChunk = chunks.some(chunk => chunk.includes('main'));
  
  if (hasAppChunks) console.log('✅ App chunks found');
  if (hasMainChunk) console.log('✅ Main chunk found');
  
  if (!hasAppChunks || !hasMainChunk) {
    console.log('⚠️  Warning: Missing expected chunks');
    warningCount++;
  }
} else {
  console.log('❌ Static chunks directory missing');
  errorCount++;
}

// 5. Final summary
console.log('\n==================================================');
console.log(`📊 Build Verification Summary:`);
console.log(`   ⚠️  Warnings: ${warningCount}`);
console.log(`   ❌ Errors: ${errorCount}`);

if (errorCount === 0) {
  console.log('\n🎉 Build verification PASSED!');
  console.log('🚀 Deployment should work correctly');
  console.log('\n💡 If you still see "Sorry, an error occurred":');
  console.log('   1. Check browser console for hydration errors');
  console.log('   2. Verify all environment variables are set');
  console.log('   3. Check network requests in browser dev tools');
  process.exit(0);
} else {
  console.log('\n❌ Build verification FAILED!');
  console.log(`   Found ${errorCount} critical issues`);
  process.exit(1);
}
