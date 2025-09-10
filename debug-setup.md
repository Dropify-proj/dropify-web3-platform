# Debugging Setup for Dropify Platform

## 1. Start Development Server
```bash
cd "c:\Users\Administrator\dropify-web3-platform cloned\dropify-web3-platform"
npm run dev
```

## 2. Check for Import/Export Issues

### Verify EnhancedWalletProvider Export
Add this debug log to your layout.tsx:
```tsx
import { EnhancedWalletProvider } from '@/lib/enhanced-wallet-context';
console.log('EnhancedWalletProvider is:', EnhancedWalletProvider);
```

### Verify ErrorBoundary Export
Add this debug log:
```tsx
import ErrorBoundary from './components/ErrorBoundary';
console.log('ErrorBoundary is:', ErrorBoundary);
```

## 3. Common Issues to Check

### A. Environment Variables
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPRA_RPC_URL=https://testnet-rpc.supra.com
NEXT_PUBLIC_SUPRA_NETWORK=testnet
NEXT_PUBLIC_SUPRA_CHAIN_ID=6
```

### B. Node Version
Check your Node.js version:
```bash
node --version
```
Should be >= 20.18.0 as specified in package.json

### C. TypeScript Compilation
Check for TypeScript errors:
```bash
npm run type-check
```

## 4. If You See Component Errors

### Named vs Default Export Issues
Current imports are correct:
- ✅ `import { EnhancedWalletProvider }` (named export)
- ✅ `import ErrorBoundary` (default export)

### JSX Rendering Issues
If you see "X is not a function" errors, add logging:
```tsx
export default function RootLayout({ children }) {
  console.log('Rendering layout with children:', children);
  console.log('EnhancedWalletProvider type:', typeof EnhancedWalletProvider);
  
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <EnhancedWalletProvider>
            {children}
          </EnhancedWalletProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

## 5. Browser DevTools Debugging

1. Open http://localhost:3000 in your browser
2. Open DevTools (F12)
3. Check Console tab for error messages
4. Look for specific component names in stack traces
5. Check Network tab for failed imports

## 6. Quick Fixes for Common Issues

### If EnhancedWalletProvider is undefined:
Check the file path exists: `lib/enhanced-wallet-context.tsx`

### If ErrorBoundary is undefined:
Check the file path exists: `app/components/ErrorBoundary.tsx`

### If CSS fails to load:
Check that `app/globals.css` exists

### Hydration Errors:
Your layout already includes hydration error fixes, but if you see React Error #423, it's likely a client/server mismatch.

## 7. Emergency Fallback

If all else fails, create a minimal layout for testing:
```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div>Basic Layout Test</div>
        {children}
      </body>
    </html>
  );
}
```
