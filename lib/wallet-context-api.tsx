'use client';

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';

// Simple user account for API-based approach
interface UserAccount {
  id: string;
  walletAddress?: string;
  email?: string;
  createdAt: string;
}

// Platform stats interface
interface PlatformStats {
  totalDropMinted: number;
  totalDropBurned: number;
  totalReceiptsProcessed: number;
  drfTreasuryBalance: number;
}

// User event interface
interface UserEvent {
  id: string;
  type: 'receipt_scanned' | 'reward_redeemed' | 'advertising_purchased';
  timestamp: number;
  details: Record<string, any>;
}

// API client for backend communication
class DropifyAPI {
  private baseUrl = '/api';

  async createUser(email?: string, walletAddress?: string) {
    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, walletAddress })
    });
    return response.json();
  }

  async getUserBalance(userId: string) {
    const response = await fetch(`${this.baseUrl}/users/${userId}/balance`);
    return response.json();
  }

  async scanReceipt(userId: string, receiptHash: string, purchaseAmount: number) {
    const response = await fetch(`${this.baseUrl}/receipts/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, receiptHash, purchaseAmount })
    });
    return response.json();
  }

  async redeemReward(userId: string, rewardType: string, dropAmount: number) {
    const response = await fetch(`${this.baseUrl}/rewards/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, rewardType, dropAmount })
    });
    return response.json();
  }

  async purchaseAdvertising(userId: string, drfAmount: number, adDuration: number) {
    const response = await fetch(`${this.baseUrl}/advertising/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, drfAmount, adDuration })
    });
    return response.json();
  }

  async getPlatformStats() {
    const response = await fetch(`${this.baseUrl}/platform/stats`);
    return response.json();
  }

  async getUserEvents(userId: string) {
    const response = await fetch(`${this.baseUrl}/users/${userId}/events`);
    return response.json();
  }
}

// Wallet context interface
interface WalletContextType {
  account: UserAccount | null;
  isConnected: boolean;
  dropBalance: number;
  drfBalance: number;
  platformStats: PlatformStats | null;
  recentEvents: UserEvent[];
  isLoading: boolean;
  error: string | null;
  connectWallet: (email?: string, walletAddress?: string) => Promise<void>;
  disconnectWallet: () => void;
  scanReceipt: (receiptHash: string, purchaseAmount: number) => Promise<any>;
  redeemReward: (rewardType: string, dropAmount: number) => Promise<any>;
  purchaseAdvertising: (drfAmount: number, adDuration: number) => Promise<any>;
  refreshBalances: () => Promise<void>;
  refreshPlatformStats: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);
const api = new DropifyAPI();

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [dropBalance, setDropBalance] = useState(0);
  const [drfBalance, setDrfBalance] = useState(0);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<UserEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Connect user (create account via API)
  const connectWallet = async (email?: string, walletAddress?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Create or get user account
      const userData = await api.createUser(email, walletAddress);
      
      if (userData.success) {
        setAccount(userData.user);
        setIsConnected(true);
        
        // Load user balances
        await refreshBalances(userData.user.id);
        
        // Store session
        localStorage.setItem('dropify_user_id', userData.user.id);
        
        console.log('🔗 User connected:', userData.user.id);
      } else {
        throw new Error(userData.error || 'Failed to create account');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      console.error('Connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect user
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setDropBalance(0);
    setDrfBalance(0);
    setRecentEvents([]);
    setError(null);
    localStorage.removeItem('dropify_user_id');
    console.log('🔌 User disconnected');
  };

  // Refresh user balances
  const refreshBalances = async (userId?: string) => {
    const activeUserId = userId || account?.id;
    if (!activeUserId) return;

    try {
      const balanceData = await api.getUserBalance(activeUserId);
      
      if (balanceData.success) {
        setDropBalance(balanceData.dropBalance);
        setDrfBalance(balanceData.drfBalance);
      }

      // Get recent events
      const eventsData = await api.getUserEvents(activeUserId);
      if (eventsData.success) {
        setRecentEvents(eventsData.events);
      }
    } catch (err) {
      console.error('Error refreshing balances:', err);
    }
  };

  // Refresh platform statistics
  const refreshPlatformStats = async () => {
    try {
      const statsData = await api.getPlatformStats();
      
      if (statsData.success) {
        setPlatformStats(statsData.stats);
      }
    } catch (err) {
      console.error('Error refreshing platform stats:', err);
    }
  };

  // Scan receipt and earn DROP tokens
  const scanReceipt = async (receiptHash: string, purchaseAmount: number) => {
    if (!account) throw new Error('User not connected');
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await api.scanReceipt(account.id, receiptHash, purchaseAmount);
      
      if (result.success) {
        // Refresh balances to show new DROP tokens
        await refreshBalances();
        await refreshPlatformStats();
        
        console.log(`📄 Receipt scanned: earned ${result.dropEarned} DROP`);
      } else {
        throw new Error(result.error || 'Failed to scan receipt');
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
    if (!account) throw new Error('User not connected');
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await api.redeemReward(account.id, rewardType, dropAmount);
      
      if (result.success) {
        // Refresh balances to show burned DROP tokens
        await refreshBalances();
        await refreshPlatformStats();
        
        console.log(`🎁 Reward redeemed: ${rewardType} for ${dropAmount} DROP`);
      } else {
        throw new Error(result.error || 'Failed to redeem reward');
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
    if (!account) throw new Error('User not connected');
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await api.purchaseAdvertising(account.id, drfAmount, adDuration);
      
      if (result.success) {
        // Refresh balances to show spent DRF tokens
        await refreshBalances();
        
        console.log(`📢 Advertising purchased: ${drfAmount} DRF for ${adDuration}s`);
      } else {
        throw new Error(result.error || 'Failed to purchase advertising');
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

  // Auto-connect on page load if session exists
  useEffect(() => {
    const savedUserId = localStorage.getItem('dropify_user_id');
    if (savedUserId) {
      // Simulate re-connecting with saved user ID
      api.getUserBalance(savedUserId).then(balanceData => {
        if (balanceData.success) {
          setAccount({ 
            id: savedUserId, 
            createdAt: new Date().toISOString() 
          });
          setIsConnected(true);
          setDropBalance(balanceData.dropBalance);
          setDrfBalance(balanceData.drfBalance);
          refreshBalances(savedUserId);
        }
      }).catch(err => {
        console.error('Auto-connect failed:', err);
        localStorage.removeItem('dropify_user_id');
      });
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

// Platform stats hook
export function usePlatformStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshStats = async () => {
    try {
      setIsLoading(true);
      const statsData = await api.getPlatformStats();
      
      if (statsData.success) {
        setStats(statsData.stats);
      }
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

console.log('🚀 API-based wallet context loaded - production ready!');
