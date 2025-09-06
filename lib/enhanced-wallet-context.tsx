'use client';

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { dropifyContract, OCRService, SUPRA_CONFIG } from './dropify-smart-contract';

// Enhanced wallet context that integrates Web2 and Web3
interface EnhancedWalletContextType {
  // Wallet state
  account: any | null;
  isConnected: boolean;
  isConnecting: boolean;
  walletType: 'mock' | 'starkey' | 'supra' | null;
  
  // Token balances
  dropBalance: number;
  drfBalance: number;
  
  // Platform data
  platformStats: any | null;
  recentTransactions: any[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Core actions
  connectWallet: (preferredType?: string) => Promise<void>;
  disconnectWallet: () => void;
  
  // Receipt processing (Web2 + Web3)
  processReceiptComplete: (file: File) => Promise<{
    success: boolean;
    ocrData?: any;
    blockchainResult?: any;
    error?: string;
  }>;
  
  // Token operations
  convertDropToDrf: (dropAmount: number) => Promise<any>;
  redeemReward: (rewardType: string, dropAmount: number) => Promise<any>;
  
  // Data refresh
  refreshBalances: () => Promise<void>;
  refreshPlatformStats: () => Promise<void>;
}

const EnhancedWalletContext = createContext<EnhancedWalletContextType | undefined>(undefined);

// Mock Account class for demo mode
class MockAccount {
  private addr: string;
  
  constructor() {
    this.addr = `0x${Math.random().toString(16).substr(2, 40)}`;
  }
  
  address() { 
    return this.addr; 
  }
  
  async signAndSubmitTransaction(payload: any) {
    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `0x${Math.random().toString(16).substr(2, 64)}`;
  }
}

export function EnhancedWalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletType, setWalletType] = useState<'mock' | 'starkey' | 'supra' | null>(null);
  const [dropBalance, setDropBalance] = useState(0);
  const [drfBalance, setDrfBalance] = useState(0);
  const [platformStats, setPlatformStats] = useState<any | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-connect on load
  useEffect(() => {
    // Try to connect to a wallet on load
    const autoConnect = async () => {
      try {
        // Check if we have Supra/StarKey wallet
        if (typeof window !== 'undefined') {
          const starkey = (window as any).starkey || (window as any).supra;
          if (starkey) {
            await connectWallet('starkey');
            return;
          }
        }
        
        // Fallback to demo mode
        await connectWallet('mock');
      } catch (error) {
        console.log('Auto-connect failed, using demo mode');
        await connectWallet('mock');
      }
    };

    autoConnect();
  }, []);

  const connectWallet = async (preferredType?: string) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      let newAccount: any = null;
      let type: 'mock' | 'starkey' | 'supra' = 'mock';

      if (preferredType === 'starkey' || preferredType === 'supra') {
        // Try to connect to real Supra wallet
        if (typeof window !== 'undefined') {
          const wallet = (window as any).starkey || (window as any).supra;
          if (wallet) {
            try {
              const response = await wallet.connect();
              newAccount = {
                address: () => response.address || response,
                signAndSubmitTransaction: wallet.signAndSubmitTransaction?.bind(wallet)
              };
              type = 'starkey';
              console.log('✅ Connected to Supra wallet');
            } catch (walletError) {
              console.warn('Supra wallet connection failed:', walletError);
              throw new Error('Wallet connection failed');
            }
          } else {
            throw new Error('Supra wallet not found');
          }
        }
      }
      
      // Fallback to mock account
      if (!newAccount) {
        newAccount = new MockAccount();
        type = 'mock';
        console.log('🔄 Using demo wallet mode');
      }

      setAccount(newAccount);
      setWalletType(type);
      setIsConnected(true);
      
      // Refresh balances and stats
      await Promise.all([
        refreshBalances(newAccount),
        refreshPlatformStats()
      ]);

    } catch (error) {
      console.error('Wallet connection error:', error);
      setError(error instanceof Error ? error.message : 'Connection failed');
      
      // Fallback to demo mode
      const mockAccount = new MockAccount();
      setAccount(mockAccount);
      setWalletType('mock');
      setIsConnected(true);
      await refreshBalances(mockAccount);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setWalletType(null);
    setDropBalance(0);
    setDrfBalance(0);
    setRecentTransactions([]);
    setError(null);
  };

  // Complete receipt processing: OCR + Blockchain
  const processReceiptComplete = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Step 1: OCR Processing (Web2)
      console.log('🔍 Processing receipt with OCR...');
      const ocrData = await OCRService.processReceipt(file);
      
      // Step 2: Blockchain Transaction (Web3)
      console.log('⛓️ Submitting to blockchain...');
      const blockchainResult = await dropifyContract.scanReceipt(
        account,
        ocrData.receiptHash,
        ocrData.total
      );
      
      if (blockchainResult.success) {
        // Update local balances
        setDropBalance(prev => prev + blockchainResult.dropEarned);
        
        // Add to recent transactions
        const newTransaction = {
          id: Date.now(),
          type: 'receipt_scan',
          amount: blockchainResult.dropEarned,
          timestamp: new Date(),
          hash: blockchainResult.transactionHash,
          ocrData
        };
        setRecentTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);
        
        return {
          success: true,
          ocrData,
          blockchainResult
        };
      } else {
        throw new Error(blockchainResult.error || 'Blockchain transaction failed');
      }
      
    } catch (error) {
      console.error('Complete receipt processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Processing failed';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const convertDropToDrf = async (dropAmount: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await dropifyContract.convertDropToDrf(account, dropAmount);
      
      if (result.success) {
        // Update local balances
        setDropBalance(prev => prev - dropAmount);
        setDrfBalance(prev => prev + result.drfReceived);
        
        // Add to recent transactions
        const newTransaction = {
          id: Date.now(),
          type: 'conversion',
          amount: result.drfReceived,
          dropBurned: dropAmount,
          timestamp: new Date(),
          hash: result.transactionHash
        };
        setRecentTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Conversion failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const redeemReward = async (rewardType: string, dropAmount: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await dropifyContract.redeemReward(account, rewardType, dropAmount);
      
      if (result.success) {
        // Update local balance
        setDropBalance(prev => prev - dropAmount);
        
        // Add to recent transactions
        const newTransaction = {
          id: Date.now(),
          type: 'redemption',
          rewardType,
          amount: dropAmount,
          timestamp: new Date(),
          hash: result.transactionHash
        };
        setRecentTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Redemption failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalances = async (accountToUse?: any) => {
    const targetAccount = accountToUse || account;
    if (!targetAccount) return;
    
    try {
      const balances = await dropifyContract.getUserBalances(targetAccount.address());
      setDropBalance(balances.dropBalance);
      setDrfBalance(balances.drfBalance);
    } catch (error) {
      console.error('Error refreshing balances:', error);
    }
  };

  const refreshPlatformStats = async () => {
    try {
      const stats = await dropifyContract.getPlatformStats();
      setPlatformStats(stats);
    } catch (error) {
      console.error('Error refreshing platform stats:', error);
    }
  };

  const value: EnhancedWalletContextType = {
    account,
    isConnected,
    isConnecting,
    walletType,
    dropBalance,
    drfBalance,
    platformStats,
    recentTransactions,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    processReceiptComplete,
    convertDropToDrf,
    redeemReward,
    refreshBalances,
    refreshPlatformStats,
  };

  return (
    <EnhancedWalletContext.Provider value={value}>
      {children}
    </EnhancedWalletContext.Provider>
  );
}

export function useEnhancedWallet() {
  const context = useContext(EnhancedWalletContext);
  if (context === undefined) {
    // During SSR/static generation, return safe defaults instead of throwing
    if (typeof window === 'undefined') {
      return {
        account: null,
        isConnected: false,
        isConnecting: false,
        walletType: null,
        dropBalance: 0,
        drfBalance: 0,
        platformStats: null,
        recentTransactions: [],
        isLoading: false,
        error: null,
        connectWallet: async () => {},
        disconnectWallet: () => {},
        processReceiptComplete: async () => ({ 
          success: false,
          error: 'Not available during SSR'
        }),
        convertDropToDrf: async () => {},
        redeemReward: async () => {},
        refreshBalances: async () => {},
        refreshPlatformStats: async () => {},
      };
    }
    throw new Error('useEnhancedWallet must be used within an EnhancedWalletProvider');
  }
  return context;
}
