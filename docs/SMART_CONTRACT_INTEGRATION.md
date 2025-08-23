# Dropify Smart Contract Integration

This document explains how the dual-token smart contract integrates with the Dropify platform.

## Smart Contract Overview

### Dual Token System

1. **$DROP Token (Infinite Supply)**
   - Utility token for rewards
   - Minted when users scan receipts
   - Burned when redeeming rewards
   - Dynamic supply based on platform activity

2. **$DRF Token (1 Billion Fixed Supply)**
   - Governance token with fixed supply
   - Used for platform voting
   - Required for advertising purchases
   - Distributed through staking and airdrops

## Contract Architecture

### Core Modules

- `dual_token.move` - Main contract with token logic
- `TokenCaps` - Stores mint/burn capabilities
- `PlatformTreasury` - Manages DRF treasury and statistics
- `TokenEvents` - Emits events for all transactions

### Key Functions

1. **Receipt Scanning**: `scan_receipt()`
   - Validates receipt data
   - Mints $DROP tokens based on purchase amount
   - Updates platform statistics

2. **Reward Redemption**: `redeem_reward()`
   - Burns $DROP tokens permanently
   - Emits redemption event
   - Updates burn statistics

3. **Business Advertising**: `purchase_advertising()`
   - Businesses pay $DRF for featured placement
   - Revenue goes to platform treasury
   - Creates advertising events

## Integration Architecture

### Frontend Integration

```typescript
// Wallet Context Provider
<WalletProvider>
  <App />
</WalletProvider>

// Using the wallet
const { 
  dropBalance, 
  drfBalance, 
  scanReceipt, 
  redeemReward 
} = useWallet();
```

### Smart Contract Client

```typescript
import { dropifyContract } from './lib/dropify-contract';

// Scan receipt and earn tokens
const result = await dropifyContract.scanReceipt(
  userAccount,
  receiptHash,
  purchaseAmount
);

// Redeem reward by burning tokens
const result = await dropifyContract.redeemReward(
  userAccount,
  "Digital Gift Card",
  50 // Amount of $DROP to burn
);
```

## Deployment Guide

### Prerequisites

1. **Supra Network Access**
   - Testnet RPC endpoint
   - Admin account with funding
   - Move CLI installed

2. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   # Update with your configuration
   ```

### Deployment Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Compile Move Contract**
   ```bash
   cd contracts
   aptos move compile --named-addresses dropify=0x1
   ```

3. **Deploy to Supra**
   ```bash
   npm run deploy-contract
   ```

4. **Initialize Contract**
   ```bash
   npm run init-contract
   ```

### Configuration

Update `.env.local` with your settings:

```env
NEXT_PUBLIC_SUPRA_RPC_URL=https://testnet.supra.com/rpc/v1
NEXT_PUBLIC_CONTRACT_ADDRESS=0x_your_deployed_address
ADMIN_PRIVATE_KEY=your_admin_private_key
```

## Usage Examples

### Receipt Scanning Flow

1. User uploads receipt image
2. AI processes receipt data
3. Smart contract validates and mints $DROP
4. User receives tokens in wallet

```typescript
const handleReceiptScan = async (receiptData) => {
  const result = await scanReceipt(
    receiptData.hash,
    receiptData.purchaseAmount
  );
  
  if (result.success) {
    console.log(`Earned ${result.dropEarned} $DROP tokens!`);
  }
};
```

### Reward Redemption Flow

1. User selects reward to redeem
2. Confirms burn transaction
3. Smart contract burns $DROP tokens
4. Reward is delivered to user

```typescript
const handleRedemption = async (reward) => {
  const result = await redeemReward(
    reward.type,
    reward.cost
  );
  
  if (result.success) {
    router.push('/redemption-success');
  }
};
```

### Business Partnership Flow

1. Business wants featured placement
2. Pays $DRF tokens for advertising
3. Contract records payment
4. Business reward gets promoted

```typescript
const purchaseAd = async (duration, amount) => {
  const result = await purchaseAdvertising(
    amount, // DRF amount
    duration // Ad duration in seconds
  );
  
  return result.transactionHash;
};
```

## Security Features

### Token Safety
- Burn operations are irreversible
- Mint operations require valid receipts
- Admin functions are protected

### Event Monitoring
- All transactions emit events
- Frontend can track user activity
- Analytics dashboard integration

### Error Handling
- Insufficient balance checks
- Invalid parameter validation
- Graceful failure recovery

## Testing

### Local Testing
```bash
# Run unit tests
cd contracts
aptos move test

# Integration tests
npm test
```

### Testnet Deployment
1. Deploy to Supra testnet
2. Test with faucet tokens
3. Verify all functions work

## Monitoring & Analytics

### Platform Statistics
- Total $DROP minted/burned
- Receipt processing count
- DRF treasury balance
- Active user metrics

### User Analytics
- Receipt scanning history
- Reward redemption patterns
- Token balance tracking
- Transaction history

## Troubleshooting

### Common Issues

1. **Transaction Failures**
   - Check user has sufficient balance
   - Verify network connectivity
   - Confirm contract is deployed

2. **Balance Not Updating**
   - Wait for transaction confirmation
   - Refresh wallet connection
   - Check transaction hash

3. **Smart Contract Errors**
   - Review error codes in contract
   - Check parameter validation
   - Verify account registration

### Support Resources
- Contract source code: `./contracts/`
- Integration docs: This README
- Example usage: `./lib/wallet-context.tsx`

## Future Enhancements

### Planned Features
1. **Cross-chain compatibility**
2. **Advanced staking mechanisms**
3. **DAO governance voting**
4. **NFT reward integration**
5. **Carbon credit tracking**

### Optimization
1. **Gas optimization**
2. **Batch operations**
3. **Caching strategies**
4. **Performance monitoring**

---

For technical support or questions about the smart contract integration, please refer to the contract documentation or contact the development team.
