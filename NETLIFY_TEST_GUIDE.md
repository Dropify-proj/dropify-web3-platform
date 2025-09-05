# Netlify Build and Test Script for Dropify

## Prerequisites
- Node.js 20.18.0 (as specified in .nvmrc)
- npm >= 9.0.0
- Netlify CLI

## Build Test Commands

### 1. Install Dependencies
```bash
npm ci
```

### 2. Build the Project
```bash
npm run build
```

### 3. Test with Netlify CLI
```bash
# Test build process (simulates Netlify environment)
netlify build

# Run development server with Netlify environment
netlify dev

# Deploy to preview (optional)
netlify deploy

# Deploy to production (when ready)
netlify deploy --prod
```

## Expected Output Structure
After successful build, you should see:
- `out/` directory with static files
- `out/index.html` (homepage)
- `out/demo.html` (demo page)
- `out/dashboard.html` (dashboard page)

## Troubleshooting
If build fails:
1. Check TypeScript errors: `npm run type-check`
2. Check linting: `npm run lint`
3. Verify Next.js config: Check `next.config.js`
4. Check Netlify config: Check `netlify.toml`

## Environment Variables Required
Make sure these are set in Netlify:
- NEXT_PUBLIC_PRIVY_APP_ID
- NEXT_PUBLIC_SUPRA_RPC_URL
- NEXT_PUBLIC_SUPRA_NETWORK  
- NEXT_PUBLIC_SUPRA_CHAIN_ID
