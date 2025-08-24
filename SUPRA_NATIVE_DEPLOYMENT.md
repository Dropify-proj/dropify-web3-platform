# Supra Native Deployment Guide

## Overview
This configuration deploys Dropify with direct Supra L1 integration using native wallet adapters (StarKey/Petra) instead of Privy, eliminating build dependency issues while maintaining full on-chain functionality.

## Key Changes Made

### 1. Native Supra Wallet Context (`lib/wallet-context-supra.tsx`)
- **StarKey Wallet Integration**: Primary wallet adapter for Supra ecosystem
- **Direct RPC Communication**: Connects directly to Supra Testnet RPC
- **On-Chain Receipt Processing**: Real blockchain transactions for receipt scanning
- **Mock Fallback**: Development mode when wallets aren't available
- **Complete Token Management**: DROP and DRF token handling

### 2. Updated Components
- **SupraAuthButton**: Native wallet connection UI
- **Header**: Uses Supra authentication
- **Dashboard**: Connected to Supra wallet context
- **Receipt Scanner**: Real on-chain transaction submission

### 3. Eliminated Dependencies
- ❌ Removed: `@privy-io/react-auth` (causing build issues)
- ❌ Removed: Complex Aptos integrations
- ❌ Removed: Problematic TypeScript types
- ✅ Added: Native Supra wallet adapters
- ✅ Added: Direct blockchain communication

## Deployment Commands

```powershell
# Install dependencies (clean install)
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install

# Build for production
npm run build

# Deploy to Netlify
# (Netlify will automatically use the configuration from netlify.toml)
```

## Configuration Files

### `.nvmrc`
```
20.18.0
```

### `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "out"
  
[build.environment]
  NODE_VERSION = "20.18.0"
  NPM_VERSION = "10.8.2"
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### `next.config.ts`
```typescript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  distDir: 'out',
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: false
  }
};
export default nextConfig;
```

## Smart Contract Integration

### Supra Testnet Configuration
- **Chain ID**: 6
- **RPC URL**: `https://testnet-rpc.supra.com`
- **Explorer**: `https://testnet-explorer.supra.com`
- **Contract Address**: `0x1::dropify_dual_token`

### Move Smart Contract Functions
```move
// Receipt scanning (main feature)
public entry fun scan_receipt(
    receipt_hash: vector<u8>,
    purchase_amount: u64,
    merchant_id: vector<u8>,
    timestamp: u64,
    user_address: address
)

// Reward redemption
public entry fun redeem_reward(
    reward_type: vector<u8>,
    drop_amount: u64,
    user_address: address
)

// Advertising purchases
public entry fun purchase_advertising(
    drf_amount: u64,
    ad_duration: u64,
    user_address: address
)
```

## User Experience Flow

### 1. Wallet Connection
1. User clicks "Connect Supra Wallet"
2. System detects StarKey wallet (or shows installation link)
3. User approves connection to Supra Testnet
4. Dashboard loads with token balances

### 2. Receipt Scanning (On-Chain)
1. User scans/uploads receipt
2. System processes receipt data
3. Creates Move function call payload
4. User signs transaction via wallet
5. Receipt data stored on Supra blockchain
6. DROP tokens automatically minted to user

### 3. Reward Redemption (On-Chain)
1. User selects reward from catalog
2. System calculates DROP token cost
3. User confirms transaction
4. DROP tokens burned on-chain
5. Reward fulfillment initiated

## Testing & Development

### Local Development
```powershell
# Start development server
npm run dev

# Test with mock wallet (when StarKey not available)
# System automatically falls back to demo mode
```

### Production Testing
1. Install StarKey wallet from Supra website
2. Connect to Supra Testnet
3. Get test tokens from faucet
4. Test full receipt scanning flow
5. Verify transactions on Supra Explorer

## Monitoring & Analytics

### On-Chain Metrics
- Total receipts processed: Query smart contract
- Token circulation: Real-time blockchain data
- User engagement: Transaction frequency
- Platform revenue: DRF token purchases

### Platform Stats Available
```typescript
interface PlatformStats {
  totalDropMinted: number;      // From blockchain
  totalDropBurned: number;      // From blockchain  
  totalReceiptsProcessed: number; // From blockchain
  drfTreasuryBalance: number;   // From blockchain
}
```

## Advantages of This Approach

### ✅ Technical Benefits
- **No Build Dependencies**: Eliminates Privy build issues
- **True Decentralization**: Direct blockchain interaction
- **Real On-Chain Data**: Receipts stored on Supra L1
- **Native Performance**: Optimized for Supra ecosystem
- **Simplified Architecture**: Fewer external dependencies

### ✅ Business Benefits
- **Authentic Web3**: Real blockchain utility, not just wrapped Web2
- **Supra Ecosystem**: First-mover advantage on emerging L1
- **Transparent Operations**: All data verifiable on-chain
- **Community Building**: Native wallet users = engaged community
- **Future-Proof**: Direct integration survives service changes

### ✅ User Benefits
- **Ownership**: True control of digital assets
- **Transparency**: All transactions verifiable
- **Interoperability**: Tokens work across Supra ecosystem
- **Privacy**: No email required, just wallet connection
- **Security**: Non-custodial, user controls private keys

## Migration from Previous Version

### What Changed
1. **Authentication**: Privy → StarKey/Petra wallets
2. **Blockchain**: Complex multi-chain → Supra L1 focused
3. **Dependencies**: Heavy packages → Minimal, native approach
4. **Architecture**: Wrapper-based → Direct integration

### Data Preservation
- Smart contract remains compatible
- Token economics unchanged
- User experience improved
- All core features maintained

## Next Steps

1. **Deploy Contract**: Upload `supra_dual_token.move` to Supra Testnet
2. **Configure Frontend**: Update contract address in config
3. **Test Integration**: Verify wallet connection and transactions
4. **Launch**: Deploy to production with Netlify
5. **Community**: Engage Supra community for adoption

This implementation brings real-world purchase data on-chain as requested, using native Supra infrastructure for maximum compatibility and performance.
