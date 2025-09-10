// Component Import/Export Verification Script
// Run this to check for React Error #423 issues

console.log('🔍 DROPIFY COMPONENT VERIFICATION');
console.log('=================================');

// Test all critical imports
const components = {
  'HomeContent': () => import('./app/HomeContent'),
  'AIReceiptProcessor': () => import('./app/components/AIReceiptProcessor'),
  'Web3Dashboard': () => import('./app/components/Web3Dashboard'),
  'EnhancedStats': () => import('./app/components/EnhancedStats'),
  'SSRSafeHome': () => import('./app/components/SSRSafeHome'),
  'ErrorBoundary': () => import('./app/components/ErrorBoundary'),
  'EnhancedWalletProvider': () => import('./lib/enhanced-wallet-context')
};

async function verifyComponents() {
  for (const [name, importFn] of Object.entries(components)) {
    try {
      const module = await importFn();
      const component = module.default || module[name] || module;
      
      console.log(`✅ ${name}:`, typeof component);
      
      if (typeof component !== 'function') {
        console.log(`❌ ${name} is not a valid React component!`);
        console.log(`   Type: ${typeof component}`);
        console.log(`   Value:`, component);
      }
    } catch (error) {
      console.log(`❌ ${name} import failed:`, error.message);
    }
  }
}

// Check exports
console.log('\n📦 CHECKING EXPORTS...');
verifyComponents().then(() => {
  console.log('\n🎯 VERIFICATION COMPLETE');
  console.log('If any components show as "undefined" or not "function", that\'s your React Error #423 source!');
}).catch(error => {
  console.log('❌ Verification failed:', error);
});

// Additional debugging for development
if (typeof window !== 'undefined') {
  console.log('\n🌐 BROWSER ENVIRONMENT DETECTED');
  
  // Check for hydration issues
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message) {
      if (event.error.message.includes('Minified React error #423') || 
          event.error.message.includes('is not a function')) {
        console.log('🚨 REACT ERROR #423 DETECTED:', event.error.message);
        console.log('   Stack:', event.error.stack);
      }
    }
  });
}
