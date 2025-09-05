# 🚀 Dropify Testnet Deployment Guide

## Prerequisites

1. **Supra CLI**: Install from [https://docs.supra.com](https://docs.supra.com)
2. **Node.js 20+**: Already installed ✅
3. **Supra Wallet**: StarKey wallet or compatible Supra wallet

## Quick Start

### Method 1: Automated Deployment (Recommended)

```bash
# 1. Run the automated setup
./setup-testnet.bat

# 2. Deploy to testnet
./deploy-testnet.bat

# 3. Start development server
npm run dev
```

### Method 2: Manual Steps

```bash
# 1. Check testnet connectivity
npm run check:testnet

# 2. Configure environment
copy .env.testnet .env.local

# 3. Deploy smart contract
npm run deploy:testnet

# 4. Start development server
npm run dev
```

## Verification Steps

1. **Network Health**: Run `npm run check:testnet`
2. **Contract Deployment**: Check console output for contract address
3. **Wallet Connection**: Connect your Supra wallet in the app
4. **Test Transaction**: Try scanning a receipt

## Environment Configuration

Your `.env.local` should contain:

```env
NEXT_PUBLIC_SUPRA_CHAIN_ID=6
NEXT_PUBLIC_SUPRA_RPC_URL=https://testnet-rpc.supra.com
NEXT_PUBLIC_SUPRA_EXPLORER_URL=https://testnet-explorer.supra.com
NEXT_PUBLIC_CONTRACT_ADDRESS=<your_deployed_contract_address>
NEXT_PUBLIC_ENVIRONMENT=testnet
NEXT_PUBLIC_IS_DEMO=false
```

## Testnet Tokens

Get testnet SUPRA tokens from:
- **Faucet**: https://testnet-faucet.supra.com
- **Auto-request**: Deployment script will request tokens automatically

## Contract Addresses

After deployment, you'll see:
- **Contract Address**: `0x<deployer_address>::dropify_dual_token`
- **DROP Token**: Infinite supply utility token
- **DRF Token**: 1B fixed supply governance token

## Testing Your Deployment

1. **Connect Wallet**: Use StarKey or compatible Supra wallet
2. **Scan Receipt**: Upload a receipt image or enter purchase details
3. **Check Balances**: Verify DROP tokens are minted
4. **Monitor Transactions**: View on [Supra Explorer](https://testnet-explorer.supra.com)

## Troubleshooting

### Supra CLI Issues
```bash
# Check if CLI is installed
supra --version

# Install if missing
# Visit: https://docs.supra.com/cli-installation
```

### Wallet Connection Issues
- Ensure StarKey wallet is installed and updated
- Check wallet is connected to Supra Testnet
- Refresh page and reconnect if needed

### Contract Deployment Failures
- Verify sufficient testnet tokens in deployer wallet
- Check network connectivity with `npm run check:testnet`
- Ensure Move.toml configuration is correct

### Transaction Failures
- Check wallet has sufficient testnet SUPRA for gas
- Verify contract address in environment variables
- Check transaction status on Supra Explorer

## Support Resources

- **Supra Documentation**: https://docs.supra.com
- **Testnet Explorer**: https://testnet-explorer.supra.com
- **Testnet Faucet**: https://testnet-faucet.supra.com
- **Contract Source**: `contracts/supra_dual_token.move`

## Next Steps After Testnet

1. **Test Thoroughly**: Validate all features work correctly
2. **Gather Feedback**: Share demo links and collect user feedback
3. **Optimize Performance**: Monitor transaction costs and speeds
4. **Prepare Mainnet**: Plan mainnet deployment strategy

---

🎉 **Success!** Your Dropify platform is now live on Supra Testnet!

Visit your live demo at: http://localhost:3000
