'use client';

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';

// Mock account for demo mode
class MockAccount {
  private addr: string;
  constructor() {
    this.addr = `0x${Math.random().toString(16).substr(2, 40)}`;
  }
  address() { return this.addr; }
  toPrivateKeyObject() { return { privateKeyHex: `0x${Math.random().toString(16).substr(2, 64)}` }; }
}

// Mock interfaces for demo
interface PlatformStats {
  totalDropMinted: number;
  totalDropBurned: number;
  totalReceiptsProcessed: number;
  drfTreasuryBalance: number;
}

interface UserEvent {
  type: string;
  timestamp: number;
  [key: string]: any;
}

interface WalletContextType {
  account: MockAccount | null;
  isConnected: boolean;
  dropBalance: number;
  drfBalance: number;
  platformStats: PlatformStats | null;
  recentEvents: UserEvent[];
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
  const [recentEvents, setRecentEvents] = useState<UserEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Connect wallet (create new account for demo)
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For demo purposes, create a new account
      // In production, this would integrate with an actual wallet
      const newAccount = DropifyContractClient.createAccount();
      
      // Fund the account on testnet
      const funded = await dropifyContract.fundAccount(newAccount);
      if (!funded) {
        throw new Error('Failed to fund account');
      }

      // Register for both tokens
      await dropifyContract.registerForDrop(newAccount);
      await dropifyContract.registerForDrf(newAccount);

      setAccount(newAccount);
      setIsConnected(true);
      
      // Refresh balances
      await refreshBalances(newAccount);
      
      // Store account in localStorage for persistence
      localStorage.setItem('dropify_account', newAccount.toPrivateKeyObject().privateKeyHex);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setDropBalance(0);
    setDrfBalance(0);
    setRecentEvents([]);
    localStorage.removeItem('dropify_account');
  };

  // Refresh user balances
  const refreshBalances = async (userAccount?: AptosAccount) => {
    const activeAccount = userAccount || account;
    if (!activeAccount) return;

    try {
      const [newDropBalance, newDrfBalance] = await Promise.all([
        dropifyContract.getDropBalance(activeAccount.address()),
        dropifyContract.getDrfBalance(activeAccount.address())
      ]);
      
      setDropBalance(newDropBalance);
      setDrfBalance(newDrfBalance);

      // Get recent events
      const [receiptEvents, rewardEvents] = await Promise.all([
        dropifyContract.getAccountEvents(activeAccount.address(), 'receipt'),
        dropifyContract.getAccountEvents(activeAccount.address(), 'reward')
      ]);
      
      const allEvents = [...receiptEvents, ...rewardEvents]
        .sort((a, b) => parseInt(b.version) - parseInt(a.version))
        .slice(0, 20);
      
      setRecentEvents(allEvents);
    } catch (err) {
      console.error('Error refreshing balances:', err);
    }
  };

  // Refresh platform statistics
  const refreshPlatformStats = async () => {
    try {
      const stats = await dropifyContract.getPlatformStats();
      setPlatformStats(stats);
    } catch (err) {
      console.error('Error refreshing platform stats:', err);
    }
  };

  // Scan receipt and earn DROP tokens
  const scanReceipt = async (receiptHash: string, purchaseAmount: number) => {
    if (!account) throw new Error('Wallet not connected');
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await dropifyContract.scanReceipt(account, receiptHash, purchaseAmount);
      
      if (result.success) {
        await refreshBalances();
        await refreshPlatformStats();
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scan receipt';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Redeem reward by burning DROP tokens
  const redeemReward = async (rewardType: string, dropAmount: number) => {
    if (!account) throw new Error('Wallet not connected');
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await dropifyContract.redeemReward(account, rewardType, dropAmount);
      
      if (result.success) {
        await refreshBalances();
        await refreshPlatformStats();
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to redeem reward';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Purchase advertising with DRF tokens
  const purchaseAdvertising = async (drfAmount: number, adDuration: number) => {
    if (!account) throw new Error('Wallet not connected');
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await dropifyContract.purchaseAdvertising(account, drfAmount, adDuration);
      
      if (result.success) {
        await refreshBalances();
        await refreshPlatformStats();
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase advertising';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Load account from localStorage on mount
  useEffect(() => {
    const savedAccount = localStorage.getItem('dropify_account');
    if (savedAccount) {
      try {
        const account = AptosAccount.fromPrivateKeyHex(savedAccount);
        setAccount(account);
        setIsConnected(true);
        refreshBalances(account);
      } catch (err) {
        console.error('Error loading saved account:', err);
        localStorage.removeItem('dropify_account');
      }
    }
  }, []);

  // Refresh platform stats on mount
  useEffect(() => {
    refreshPlatformStats();
  }, []);

  const value: WalletContextType = {
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

// Hook for platform statistics (can be used without wallet connection)
export function usePlatformStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshStats = async () => {
    try {
      setIsLoading(true);
      const newStats = await dropifyContract.getPlatformStats();
      setStats(newStats);
    } catch (err) {
      console.error('Error fetching platform stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return { stats, isLoading, refreshStats };
}
