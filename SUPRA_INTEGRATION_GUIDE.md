# 🔗 SUPRA TESTNET INTEGRATION GUIDE

## 🎯 **Direct Supra Integration Strategy**

### **Why Supra Native > Privy:**
- ✅ **Direct testnet access** - no intermediary services
- ✅ **Native Supra wallet** - StarKey Wallet integration  
- ✅ **Real on-chain data** - receipts stored on Supra L1
- ✅ **Lower fees** - Supra's efficient consensus
- ✅ **Better performance** - direct RPC calls

---

## 🛠️ **Supra Wallet Integration**

### **1. StarKey Wallet (Supra's Native)**
```typescript
// lib/supra-wallet.ts
interface SupraWallet {
  connect(): Promise<string>;
  signAndSubmitTransaction(payload: any): Promise<string>;
  getAccount(): Promise<{ address: string; publicKey: string }>;
  disconnect(): void;
}

declare global {
  interface Window {
    starkey?: SupraWallet;
  }
}

export class SupraWalletAdapter {
  private wallet: SupraWallet | null = null;

  async connect(): Promise<string> {
    if (!window.starkey) {
      throw new Error('StarKey Wallet not installed. Please install from Supra.');
    }

    this.wallet = window.starkey;
    const address = await this.wallet.connect();
    return address;
  }

  async signTransaction(payload: any): Promise<string> {
    if (!this.wallet) throw new Error('Wallet not connected');
    return await this.wallet.signAndSubmitTransaction(payload);
  }

  async getAccount() {
    if (!this.wallet) throw new Error('Wallet not connected');
    return await this.wallet.getAccount();
  }

  disconnect() {
    if (this.wallet) {
      this.wallet.disconnect();
      this.wallet = null;
    }
  }
}
```

### **2. Alternative: Petra Wallet (Multi-chain)**
```typescript
// lib/petra-wallet.ts - Supports Aptos & Supra
interface PetraWallet {
  connect(): Promise<{ address: string }>;
  signAndSubmitTransaction(transaction: any): Promise<any>;
  account(): Promise<{ address: string; publicKey: string }>;
}

declare global {
  interface Window {
    petra?: PetraWallet;
  }
}

export class PetraWalletAdapter {
  async connect(): Promise<string> {
    if (!window.petra) {
      throw new Error('Petra Wallet not installed');
    }

    const response = await window.petra.connect();
    return response.address;
  }

  async signTransaction(transaction: any): Promise<any> {
    if (!window.petra) throw new Error('Wallet not connected');
    return await window.petra.signAndSubmitTransaction(transaction);
  }
}
```

---

## 🌐 **Supra Testnet Configuration**

### **Network Settings:**
```typescript
// lib/supra-config.ts
export const SUPRA_TESTNET_CONFIG = {
  chainId: 6,
  name: "Supra Testnet",
  rpcUrl: "https://testnet-rpc.supra.com",
  explorerUrl: "https://testnet-explorer.supra.com",
  faucetUrl: "https://testnet-faucet.supra.com",
  nativeCurrency: {
    name: "SUPRA",
    symbol: "SUPRA", 
    decimals: 18
  }
};

export const CONTRACT_ADDRESS = "0x1::dropify_dual_token"; // Your deployed contract
```

### **RPC Client Setup:**
```typescript
// lib/supra-client.ts
import { SupraClient } from '@supra/sdk'; // Hypothetical SDK

export class SupraRPCClient {
  private client: SupraClient;

  constructor() {
    this.client = new SupraClient({
      nodeUrl: SUPRA_TESTNET_CONFIG.rpcUrl,
      chainId: SUPRA_TESTNET_CONFIG.chainId
    });
  }

  async getAccountBalance(address: string, coinType: string): Promise<number> {
    const resource = await this.client.getAccountResource(
      address,
      `0x1::coin::CoinStore<${coinType}>`
    );
    return parseInt(resource.data.coin.value);
  }

  async submitTransaction(payload: any): Promise<string> {
    const response = await this.client.submitTransaction(payload);
    return response.hash;
  }

  async waitForTransaction(txHash: string): Promise<any> {
    return await this.client.waitForTransactionWithResult(txHash);
  }
}
```

---

## 🎯 **On-Chain Receipt Integration**

### **Real Purchase Data Smart Contract Call:**
```typescript
// lib/receipt-onchain.ts
export class OnChainReceiptProcessor {
  constructor(
    private wallet: SupraWalletAdapter,
    private client: SupraRPCClient
  ) {}

  async scanReceiptOnChain(
    receiptHash: string,
    purchaseAmount: number,
    merchantId: string,
    timestamp: number
  ): Promise<string> {
    const account = await this.wallet.getAccount();
    
    // Create transaction payload for Move contract
    const payload = {
      type: "entry_function_payload",
      function: `${CONTRACT_ADDRESS}::scan_receipt`,
      type_arguments: [],
      arguments: [
        receiptHash,           // Receipt hash from real purchase
        purchaseAmount,        // Amount in cents
        merchantId,           // Store/merchant identifier  
        timestamp,            // Purchase timestamp
        account.address       // User's wallet address
      ]
    };

    // Sign and submit to Supra testnet
    const txHash = await this.wallet.signTransaction(payload);
    
    // Wait for confirmation
    const result = await this.client.waitForTransaction(txHash);
    
    console.log(`🔗 Receipt ${receiptHash} recorded on Supra L1: ${txHash}`);
    return txHash;
  }

  async redeemRewardOnChain(
    rewardType: string,
    dropAmount: number
  ): Promise<string> {
    const payload = {
      type: "entry_function_payload", 
      function: `${CONTRACT_ADDRESS}::redeem_reward`,
      type_arguments: [],
      arguments: [rewardType, dropAmount]
    };

    const txHash = await this.wallet.signTransaction(payload);
    await this.client.waitForTransaction(txHash);
    
    return txHash;
  }
}
```

---

## 🔄 **Updated Wallet Context (Supra Native)**

```typescript
// lib/wallet-context-supra.tsx
'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { SupraWalletAdapter } from './supra-wallet';
import { SupraRPCClient } from './supra-client';
import { OnChainReceiptProcessor } from './receipt-onchain';

interface SupraWalletContextType {
  account: { address: string; publicKey: string } | null;
  isConnected: boolean;
  dropBalance: number;
  drfBalance: number;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  scanReceipt: (receiptHash: string, purchaseAmount: number, merchantId: string) => Promise<string>;
  redeemReward: (rewardType: string, dropAmount: number) => Promise<string>;
}

const SupraWalletContext = createContext<SupraWalletContextType | undefined>(undefined);

export function SupraWalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<{ address: string; publicKey: string } | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [dropBalance, setDropBalance] = useState(0);
  const [drfBalance, setDrfBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wallet = new SupraWalletAdapter();
  const client = new SupraRPCClient();
  const receiptProcessor = new OnChainReceiptProcessor(wallet, client);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Connect to StarKey/Petra wallet
      const address = await wallet.connect();
      const accountInfo = await wallet.getAccount();
      
      setAccount(accountInfo);
      setIsConnected(true);

      // Fetch balances from Supra testnet
      await refreshBalances(accountInfo.address);

      console.log('🔗 Connected to Supra Testnet:', accountInfo.address);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    wallet.disconnect();
    setAccount(null);
    setIsConnected(false);
    setDropBalance(0);
    setDrfBalance(0);
    setError(null);
  };

  const refreshBalances = async (address: string) => {
    try {
      // Get DROP and DRF balances from smart contract
      const [drop, drf] = await Promise.all([
        client.getAccountBalance(address, `${CONTRACT_ADDRESS}::DROP`),
        client.getAccountBalance(address, `${CONTRACT_ADDRESS}::DRF`)
      ]);

      setDropBalance(drop);
      setDrfBalance(drf);
    } catch (err) {
      console.error('Error fetching balances:', err);
    }
  };

  const scanReceipt = async (
    receiptHash: string, 
    purchaseAmount: number, 
    merchantId: string
  ): Promise<string> => {
    if (!account) throw new Error('Wallet not connected');

    try {
      setIsLoading(true);
      setError(null);

      // Submit real purchase data to Supra blockchain
      const txHash = await receiptProcessor.scanReceiptOnChain(
        receiptHash,
        purchaseAmount,
        merchantId,
        Date.now()
      );

      // Refresh balances to show new DROP tokens
      await refreshBalances(account.address);

      return txHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scan receipt';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const redeemReward = async (rewardType: string, dropAmount: number): Promise<string> => {
    if (!account) throw new Error('Wallet not connected');

    try {
      setIsLoading(true);
      setError(null);

      const txHash = await receiptProcessor.redeemRewardOnChain(rewardType, dropAmount);
      
      // Refresh balances to show burned DROP tokens
      await refreshBalances(account.address);

      return txHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to redeem reward';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const value: SupraWalletContextType = {
    account,
    isConnected,
    dropBalance,
    drfBalance,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    scanReceipt,
    redeemReward,
  };

  return (
    <SupraWalletContext.Provider value={value}>
      {children}
    </SupraWalletContext.Provider>
  );
}

export function useSupraWallet() {
  const context = useContext(SupraWalletContext);
  if (!context) {
    throw new Error('useSupraWallet must be used within SupraWalletProvider');
  }
  return context;
}
```

---

## 📦 **Installation Steps**

### **1. Install Supra SDK:**
```bash
# If available
npm install @supra/sdk

# Or build custom RPC client
npm install axios  # For HTTP requests to Supra RPC
```

### **2. Update Package.json:**
```json
{
  "dependencies": {
    "@supra/sdk": "latest",
    "axios": "^1.6.0"
  }
}
```

### **3. Environment Variables:**
```env
NEXT_PUBLIC_SUPRA_RPC_URL=https://testnet-rpc.supra.com
NEXT_PUBLIC_SUPRA_CHAIN_ID=6
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1::dropify_dual_token
```

---

## 🎯 **Benefits of Direct Supra Integration:**

✅ **Real on-chain data** - Every receipt stored on Supra L1
✅ **Native wallet support** - StarKey, Petra, or other Supra wallets  
✅ **Lower fees** - Supra's efficient consensus mechanism
✅ **Better UX** - Direct blockchain interaction
✅ **True decentralization** - No centralized auth services

This approach gives you real blockchain integration while keeping the same user experience. Would you like me to implement this Supra-native wallet context?
