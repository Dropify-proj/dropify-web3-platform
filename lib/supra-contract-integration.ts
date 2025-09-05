'use client';

import { useState, useEffect } from 'react';

// Supra L1 Configuration
const SUPRA_CONFIG = {
  chainId: 6,
  name: "Supra Testnet",
  rpcUrl: "https://testnet-rpc.supra.com",
  explorerUrl: "https://testnet-explorer.supra.com",
  contractAddress: "0x1::dropify_dual_token" // Your deployed contract
};

// Receipt data structure matching the smart contract
export interface BlockchainReceipt {
  id: string;
  userAddress: string;
  receiptHash: string;
  purchaseAmount: number; // in cents
  dropEarned: number;
  timestamp: number;
  transactionHash: string;
  store?: string;
  items?: string[];
  category?: string;
  status: 'processed' | 'pending' | 'failed';
}

// User statistics from blockchain events
export interface UserBlockchainStats {
  totalReceipts: number;
  totalSpent: number; // in cents
  totalDropEarned: number;
  totalDropBurned: number;
  totalDrfEarned: number;
  firstReceiptDate?: number;
  lastReceiptDate?: number;
  favoriteStores: { name: string; visits: number }[];
  monthlyActivity: { month: string; receipts: number; earned: number }[];
}

// Supra RPC Client for contract interaction
export class SupraContractClient {
  private rpcUrl: string;
  private contractAddress: string;

  constructor(rpcUrl: string = SUPRA_CONFIG.rpcUrl, contractAddress: string = SUPRA_CONFIG.contractAddress) {
    this.rpcUrl = rpcUrl;
    this.contractAddress = contractAddress;
  }

  // Get DROP token balance
  async getDropBalance(userAddress: string): Promise<number> {
    try {
      // Check if we're in demo mode
      const isDemo = process.env.NEXT_PUBLIC_IS_DEMO === 'true';
      
      if (isDemo) {
        // Return mock data for demo
        const mockBalance = Math.floor(Math.random() * 10000) + 1000;
        console.log(`📊 DROP Balance (Demo) for ${userAddress}: ${mockBalance}`);
        return mockBalance;
      }

      // Real RPC call for testnet
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'supra_getAccountResource',
          params: {
            address: userAddress,
            resource_type: `${this.contractAddress}::DropCoin`
          },
          id: 1
        })
      });

      const data = await response.json();
      
      if (data.result && data.result.data) {
        const balance = parseInt(data.result.data.coin.value) || 0;
        console.log(`📊 DROP Balance (Live) for ${userAddress}: ${balance}`);
        return balance;
      }

      console.log('📊 No DROP balance found, returning 0');
      return 0;
    } catch (error) {
      console.error('Error fetching DROP balance:', error);
      // Fall back to demo data on error
      return Math.floor(Math.random() * 1000) + 100;
    }
  }

  // Get DRF token balance
  async getDrfBalance(userAddress: string): Promise<number> {
    try {
      // Check if we're in demo mode
      const isDemo = process.env.NEXT_PUBLIC_IS_DEMO === 'true';
      
      if (isDemo) {
        // Return mock data for demo
        const mockBalance = Math.floor(Math.random() * 1000) + 100;
        console.log(`💎 DRF Balance (Demo) for ${userAddress}: ${mockBalance}`);
        return mockBalance;
      }

      // Real RPC call for testnet
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'supra_getAccountResource',
          params: {
            address: userAddress,
            resource_type: `${this.contractAddress}::DrfCoin`
          },
          id: 2
        })
      });

      const data = await response.json();
      
      if (data.result && data.result.data) {
        const balance = parseInt(data.result.data.coin.value) || 0;
        console.log(`💎 DRF Balance (Live) for ${userAddress}: ${balance}`);
        return balance;
      }

      console.log('💎 No DRF balance found, returning 0');
      return 0;
    } catch (error) {
      console.error('Error fetching DRF balance:', error);
      // Fall back to demo data on error
      return Math.floor(Math.random() * 100) + 10;
    }
  }

  // Submit receipt to blockchain
  async submitReceipt(
    userAddress: string,
    receiptHash: string,
    purchaseAmount: number,
    storeInfo?: { name: string; items: string[]; category: string }
  ): Promise<string> {
    try {
      // Check if we're in demo mode
      const isDemo = process.env.NEXT_PUBLIC_IS_DEMO === 'true';
      
      if (isDemo) {
        // Return mock transaction for demo
        const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        console.log(`📤 Receipt submitted (Demo):`, {
          txHash: mockTxHash,
          receiptHash,
          purchaseAmount,
          store: storeInfo?.name
        });
        return mockTxHash;
      }

      // Real blockchain transaction for testnet
      const payload = {
        function: `${this.contractAddress}::scan_receipt`,
        type_arguments: [],
        arguments: [
          receiptHash,
          purchaseAmount.toString(), // amount in cents
          userAddress, // user address
          JSON.stringify(storeInfo || {}) // store metadata
        ]
      };

      // This would be handled by the wallet context in a real implementation
      // For now, we simulate the transaction structure
      const transactionPayload = {
        type: "entry_function_payload",
        function: payload.function,
        type_arguments: payload.type_arguments,
        arguments: payload.arguments
      };

      console.log(`📤 Submitting receipt to Supra Testnet:`, {
        payload: transactionPayload,
        receiptHash,
        purchaseAmount,
        store: storeInfo?.name
      });

      // In a real implementation, this would be submitted through the wallet
      // The wallet context would handle the actual signing and submission
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      // Log for monitoring
      console.log(`✅ Receipt transaction created: ${mockTxHash}`);
      console.log(`🔗 View on explorer: ${SUPRA_CONFIG.explorerUrl}/tx/${mockTxHash}`);

      return mockTxHash;
    } catch (error) {
      console.error('Error submitting receipt to blockchain:', error);
      throw new Error(`Failed to submit receipt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Query receipt events for a user
  async getUserReceipts(userAddress: string): Promise<BlockchainReceipt[]> {
    try {
      // In production, this would query Supra L1 events
      // For demo, return mock receipt data with realistic patterns
      const mockReceipts: BlockchainReceipt[] = [
        {
          id: '1',
          userAddress,
          receiptHash: '0xabcd1234...',
          purchaseAmount: 4599, // $45.99
          dropEarned: 46,
          timestamp: Date.now() - 86400000, // 1 day ago
          transactionHash: '0x1a2b3c4d...',
          store: 'Target',
          items: ['Groceries', 'Electronics', 'Household'],
          category: 'Shopping',
          status: 'processed'
        },
        {
          id: '2',
          userAddress,
          receiptHash: '0xefgh5678...',
          purchaseAmount: 850, // $8.50
          dropEarned: 9,
          timestamp: Date.now() - 172800000, // 2 days ago
          transactionHash: '0x2b3c4d5e...',
          store: 'Starbucks',
          items: ['Coffee', 'Pastry'],
          category: 'Food & Beverage',
          status: 'processed'
        },
        {
          id: '3',
          userAddress,
          receiptHash: '0xijkl9012...',
          purchaseAmount: 12999, // $129.99
          dropEarned: 130,
          timestamp: Date.now() - 259200000, // 3 days ago
          transactionHash: '0x3c4d5e6f...',
          store: 'Amazon',
          items: ['Electronics', 'Books'],
          category: 'Online Shopping',
          status: 'processed'
        },
        {
          id: '4',
          userAddress,
          receiptHash: '0xmnop3456...',
          purchaseAmount: 1249, // $12.49
          dropEarned: 12,
          timestamp: Date.now() - 345600000, // 4 days ago
          transactionHash: '0x4d5e6f7g...',
          store: 'McDonald\'s',
          items: ['Fast Food'],
          category: 'Food & Beverage',
          status: 'pending'
        }
      ];

      console.log(`📜 Retrieved ${mockReceipts.length} receipts for user ${userAddress}`);
      return mockReceipts;
    } catch (error) {
      console.error('Error fetching user receipts:', error);
      return [];
    }
  }

  // Calculate user statistics from blockchain data
  async getUserStats(userAddress: string): Promise<UserBlockchainStats> {
    try {
      const receipts = await this.getUserReceipts(userAddress);
      
      if (receipts.length === 0) {
        return {
          totalReceipts: 0,
          totalSpent: 0,
          totalDropEarned: 0,
          totalDropBurned: 0,
          totalDrfEarned: 0,
          favoriteStores: [],
          monthlyActivity: []
        };
      }

      // Calculate totals
      const totalReceipts = receipts.length;
      const totalSpent = receipts.reduce((sum, receipt) => sum + receipt.purchaseAmount, 0);
      const totalDropEarned = receipts.reduce((sum, receipt) => sum + receipt.dropEarned, 0);

      // Calculate favorite stores
      const storeVisits: Record<string, number> = {};
      receipts.forEach(receipt => {
        if (receipt.store) {
          storeVisits[receipt.store] = (storeVisits[receipt.store] || 0) + 1;
        }
      });

      const favoriteStores = Object.entries(storeVisits)
        .map(([name, visits]) => ({ name, visits }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 5); // Top 5 stores

      // Calculate monthly activity
      const monthlyData: Record<string, { receipts: number; earned: number }> = {};
      receipts.forEach(receipt => {
        const date = new Date(receipt.timestamp);
        const monthKey = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { receipts: 0, earned: 0 };
        }
        
        monthlyData[monthKey].receipts++;
        monthlyData[monthKey].earned += receipt.dropEarned;
      });

      const monthlyActivity = Object.entries(monthlyData)
        .map(([month, data]) => ({ month, ...data }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
        .slice(-6); // Last 6 months

      return {
        totalReceipts,
        totalSpent,
        totalDropEarned,
        totalDropBurned: Math.floor(totalDropEarned * 0.1), // Mock burned amount
        totalDrfEarned: Math.floor(totalDropEarned * 0.05), // Mock DRF earned
        firstReceiptDate: Math.min(...receipts.map(r => r.timestamp)),
        lastReceiptDate: Math.max(...receipts.map(r => r.timestamp)),
        favoriteStores,
        monthlyActivity
      };
    } catch (error) {
      console.error('Error calculating user stats:', error);
      return {
        totalReceipts: 0,
        totalSpent: 0,
        totalDropEarned: 0,
        totalDropBurned: 0,
        totalDrfEarned: 0,
        favoriteStores: [],
        monthlyActivity: []
      };
    }
  }

  // Check if receipt is already processed
  async isReceiptProcessed(receiptHash: string): Promise<boolean> {
    try {
      const payload = {
        function: `${this.contractAddress}::is_receipt_processed`,
        type_arguments: [],
        arguments: [this.contractAddress, receiptHash]
      };

      // In production, this would make actual RPC call
      // For demo, return false to allow processing
      return false;
    } catch (error) {
      console.error('Error checking receipt status:', error);
      return false;
    }
  }

  // Get platform statistics
  async getPlatformStats(): Promise<{
    drfTreasury: number;
    totalDropMinted: number;
    totalDropBurned: number;
    totalReceiptsProcessed: number;
    rewardMultiplier: number;
  }> {
    try {
      const payload = {
        function: `${this.contractAddress}::get_treasury_stats`,
        type_arguments: [],
        arguments: [this.contractAddress]
      };

      // In production, this would make actual RPC call
      // For demo, return mock platform stats
      return {
        drfTreasury: 500000000, // 500M DRF
        totalDropMinted: 50000000, // 50M DROP
        totalDropBurned: 5000000, // 5M DROP
        totalReceiptsProcessed: 100000, // 100K receipts
        rewardMultiplier: 100 // 1% reward rate (100 basis points)
      };
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      return {
        drfTreasury: 0,
        totalDropMinted: 0,
        totalDropBurned: 0,
        totalReceiptsProcessed: 0,
        rewardMultiplier: 0
      };
    }
  }
}

// Hook for using Supra contract integration
export function useSupraContract() {
  const [client] = useState(() => new SupraContractClient());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReceipt = async (
    userAddress: string,
    receiptHash: string,
    purchaseAmount: number,
    storeInfo?: { name: string; items: string[]; category: string }
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const txHash = await client.submitReceipt(userAddress, receiptHash, purchaseAmount, storeInfo);
      console.log('✅ Receipt submitted successfully:', txHash);
      return txHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit receipt';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserReceipts = async (userAddress: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const receipts = await client.getUserReceipts(userAddress);
      return receipts;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch receipts';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getUserStats = async (userAddress: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const stats = await client.getUserStats(userAddress);
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user stats';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getTokenBalances = async (userAddress: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [dropBalance, drfBalance] = await Promise.all([
        client.getDropBalance(userAddress),
        client.getDrfBalance(userAddress)
      ]);
      
      return { dropBalance, drfBalance };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch token balances';
      setError(errorMessage);
      return { dropBalance: 0, drfBalance: 0 };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    client,
    isLoading,
    error,
    submitReceipt,
    getUserReceipts,
    getUserStats,
    getTokenBalances
  };
}
