'use client';

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';

// Mock account class for demo
class MockAccount {
  private addr: string;
  constructor() {
    this.addr = `0x${Math.random().toString(16).substr(2, 40)}`;
  }
  address() { return this.addr; }
}

// Platform stats interface
interface PlatformStats {
  totalDropMinted: number;
  totalDropBurned: number;
  totalReceiptsProcessed: number;
  drfTreasuryBalance: number;
}

interface WalletContextType {
  account: MockAccount | null;
  isConnected: boolean;
  dropBalance: number;
  drfBalance: number;
  platformStats: PlatformStats | null;
  recentEvents: any[];
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  scanReceipt: (receiptHash: string, purchaseAmount: number) => Promise<any>;
  redeemReward: (rewardType: string, dropAmount: number) => Promise<any>;
  purchaseAdvertising: (drfAmount: number, adDuration: number) => Promise<any>;
  refreshBalances: () => Promise<void>;
  refreshPlatformStats: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<MockAccount | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [dropBalance, setDropBalance] = useState(0);
  const [drfBalance, setDrfBalance] = useState(0);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock wallet connection
      const mockAccount = new MockAccount();
      setAccount(mockAccount);
      setIsConnected(true);
      
      // Set demo balances
      setDropBalance(50000); // 50K DROP tokens
      setDrfBalance(1000000); // 1M DRF tokens
      
      console.log('🔗 Demo wallet connected:', mockAccount.address());
    } catch (err) {
      setError('Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setDropBalance(0);
    setDrfBalance(0);
    setPlatformStats(null);
    setRecentEvents([]);
    setError(null);
    console.log('🔌 Wallet disconnected');
  };

  const scanReceipt = async (receiptHash: string, purchaseAmount: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const dropEarned = Math.floor(purchaseAmount * 0.01); // 1% reward
      
      // Update balance
      setDropBalance(prev => prev + dropEarned);
      
      // Add to recent events
      const event = {
        type: 'receipt_scanned',
        receiptHash,
        purchaseAmount,
        dropEarned,
        timestamp: Date.now()
      };
      setRecentEvents(prev => [event, ...prev.slice(0, 9)]);
      
      console.log(`📄 Receipt scanned: earned ${dropEarned} DROP tokens`);
      
      return {
        success: true,
        dropEarned,
        transactionHash: `0x${Math.random().toString(16).substr(2, 8)}`
      };
    } catch (err) {
      setError('Failed to scan receipt');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const redeemReward = async (rewardType: string, dropAmount: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (dropBalance < dropAmount) {
        throw new Error('Insufficient DROP balance');
      }
      
      // Update balance
      setDropBalance(prev => prev - dropAmount);
      
      // Add to recent events
      const event = {
        type: 'reward_redeemed',
        rewardType,
        dropBurned: dropAmount,
        timestamp: Date.now()
      };
      setRecentEvents(prev => [event, ...prev.slice(0, 9)]);
      
      console.log(`🎁 Reward redeemed: ${rewardType} for ${dropAmount} DROP`);
      
      return {
        success: true,
        transactionHash: `0x${Math.random().toString(16).substr(2, 8)}`
      };
    } catch (err) {
      setError('Failed to redeem reward');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseAdvertising = async (drfAmount: number, adDuration: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (drfBalance < drfAmount) {
        throw new Error('Insufficient DRF balance');
      }
      
      // Update balance  
      setDrfBalance(prev => prev - drfAmount);
      
      console.log(`📢 Advertising purchased: ${drfAmount} DRF for ${adDuration}s`);
      
      return {
        success: true,
        transactionHash: `0x${Math.random().toString(16).substr(2, 8)}`
      };
    } catch (err) {
      setError('Failed to purchase advertising');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalances = async () => {
    if (!account) return;
    
    try {
      // Mock refresh - in real version would fetch from blockchain
      console.log('🔄 Refreshing balances...');
    } catch (err) {
      setError('Failed to refresh balances');
    }
  };

  const refreshPlatformStats = async () => {
    try {
      // Mock platform stats
      setPlatformStats({
        totalDropMinted: 5000000,
        totalDropBurned: 1000000,
        totalReceiptsProcessed: 25000,
        drfTreasuryBalance: 999000000
      });
    } catch (err) {
      setError('Failed to refresh platform stats');
    }
  };

  // Auto-refresh when connected
  useEffect(() => {
    if (isConnected && account) {
      refreshPlatformStats();
      const interval = setInterval(() => {
        refreshBalances();
        refreshPlatformStats();
      }, 30000); // Every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [isConnected, account]);

  const value = {
    account,
    isConnected,
    dropBalance,
    drfBalance,
    platformStats,
    recentEvents,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    scanReceipt,
    redeemReward,
    purchaseAdvertising,
    refreshBalances,
    refreshPlatformStats,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Demo mode indicator
console.log('🔧 Wallet Context loaded in DEMO mode - full blockchain integration coming soon!');
