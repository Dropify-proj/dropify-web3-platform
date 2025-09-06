'use client';

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';

// Contract-based interfaces matching our Supra Move contract
interface DropifyContract {
  // Platform statistics from contract
  stats: {
    totalDropMinted: number;
    totalDropBurned: number;
    totalReceiptsProcessed: number;
    drfTreasuryBalance: number;
    rewardMultiplier: number;
  };
  
  // User account data
  account: {
    address: string;
    dropBalance: number;
    drfBalance: number;
  } | null;
  
  // Contract functions
  scanReceipt: (receiptHash: string, purchaseAmount: number, merchant: string) => Promise<{
    success: boolean;
    dropEarned: number;
    transactionHash: string;
  }>;
  
  redeemReward: (rewardType: string, dropAmount: number) => Promise<{
    success: boolean;
    transactionHash: string;
  }>;
  
  purchaseAdvertising: (drfAmount: number, adDuration: number) => Promise<{
    success: boolean;
    transactionHash: string;
  }>;
}

// Context interface
interface DropifyContextType {
  // Connection state
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Contract instance
  contract: DropifyContract | null;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshData: () => Promise<void>;
}

const DropifyContext = createContext<DropifyContextType | undefined>(undefined);

// Mock contract implementation based on our Supra Move contract
class MockDropifyContract implements DropifyContract {
  public stats = {
    totalDropMinted: 5000000,
    totalDropBurned: 1000000,
    totalReceiptsProcessed: 25000,
    drfTreasuryBalance: 999000000,
    rewardMultiplier: 100, // 1% as in our contract
  };
  
  public account: DropifyContract['account'] = null;
  
  constructor() {
    // Initialize with demo account
    this.account = {
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      dropBalance: 50000,
      drfBalance: 1000000,
    };
  }
  
  async scanReceipt(receiptHash: string, purchaseAmount: number, merchant: string) {
    // Simulate contract's scan_receipt function
    // Calculate DROP reward based on purchase amount and multiplier (1%)
    const dropEarned = Math.floor((purchaseAmount * this.stats.rewardMultiplier) / 10000);
    
    // Update balances
    if (this.account) {
      this.account.dropBalance += dropEarned;
    }
    
    // Update platform stats
    this.stats.totalDropMinted += dropEarned;
    this.stats.totalReceiptsProcessed += 1;
    
    return {
      success: true,
      dropEarned,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    };
  }
  
  async redeemReward(rewardType: string, dropAmount: number) {
    // Simulate contract's redeem_reward function
    if (!this.account || this.account.dropBalance < dropAmount) {
      throw new Error('Insufficient DROP balance');
    }
    
    // Burn DROP tokens
    this.account.dropBalance -= dropAmount;
    this.stats.totalDropBurned += dropAmount;
    
    return {
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    };
  }
  
  async purchaseAdvertising(drfAmount: number, adDuration: number) {
    // Simulate contract's purchase_advertising function
    if (!this.account || this.account.drfBalance < drfAmount) {
      throw new Error('Insufficient DRF balance');
    }
    
    // Transfer DRF to treasury
    this.account.drfBalance -= drfAmount;
    this.stats.drfTreasuryBalance += drfAmount;
    
    return {
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    };
  }
  
  refreshBalances() {
    // Simulate refreshing from blockchain
    console.log('📊 Contract balances refreshed');
  }
}

export function DropifyProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<DropifyContract | null>(null);

  const connect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔗 Connecting to Dropify contract...');
      
      // Simulate contract connection
      const mockContract = new MockDropifyContract();
      setContract(mockContract);
      setIsConnected(true);
      
      console.log('✅ Connected to Dropify contract');
      console.log('📍 Account:', mockContract.account?.address);
      console.log('💧 DROP Balance:', mockContract.account?.dropBalance);
      console.log('💎 DRF Balance:', mockContract.account?.drfBalance);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect';
      setError(errorMessage);
      console.error('❌ Connection failed:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setContract(null);
    setIsConnected(false);
    setError(null);
    console.log('🔌 Disconnected from Dropify contract');
  };

  const refreshData = async () => {
    if (contract && contract.account) {
      console.log('🔄 Contract data refreshed');
    }
  };

  // Auto-connect on mount for demo
  useEffect(() => {
    connect();
  }, []);

  const value: DropifyContextType = {
    isConnected,
    isLoading,
    error,
    contract,
    connect,
    disconnect,
    refreshData,
  };

  return (
    <DropifyContext.Provider value={value}>
      {children}
    </DropifyContext.Provider>
  );
}

export function useDropify() {
  const context = useContext(DropifyContext);
  if (context === undefined) {
    // During SSR/static generation, return safe defaults instead of throwing
    if (typeof window === 'undefined') {
      return {
        isConnected: false,
        isLoading: false,
        error: null,
        contract: null,
        connect: async () => {},
        disconnect: () => {},
        refreshData: async () => {},
      };
    }
    throw new Error('useDropify must be used within a DropifyProvider');
  }
  return context;
}

// Export types for use in components
export type { DropifyContract, DropifyContextType };
