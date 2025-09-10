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

  // Auto-connect on load with proper error handling
  useEffect(() => {
    // Only try auto-connect if window is available and wallet provider might be present
    const autoConnect = async () => {
      try {
        // Check if we're in browser environment
        if (typeof window === 'undefined') {
          console.log('🚫 Not in browser environment, skipping auto-connect');
          return;
        }

        // Add a small delay to ensure wallet providers are loaded
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check if we have Supra/StarKey wallet
        const starkey = (window as any).starkey || (window as any).supra;
        if (starkey) {
          console.log('🔍 Supra wallet detected, attempting connection...');
          await connectWallet('starkey');
          return;
        }
        
        console.log('📱 No external wallet detected, using demo mode');
        // Fallback to demo mode
        await connectWallet('mock');
      } catch (error) {
        console.log('❌ Auto-connect failed:', error);
        console.log('🔄 Falling back to demo mode');
        await connectWallet('mock');
      }
    };

    // Only auto-connect if we have a potential wallet provider
    if (typeof window !== 'undefined') {
      autoConnect();
    }
  }, []);

  const connectWallet = async (preferredType?: string) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      let newAccount: any = null;
      let type: 'mock' | 'starkey' | 'supra' = 'mock';

      if (preferredType === 'starkey' || preferredType === 'supra') {
        // Enhanced wallet connection with proper error handling
        if (typeof window === 'undefined') {
          throw new Error('Window object not available - browser environment required');
        }

        const wallet = (window as any).starkey || (window as any).supra;
        if (!wallet) {
          throw new Error('No Supra wallet provider found. Please install StarKey wallet extension.');
        }

        try {
          console.log('🔗 Attempting to connect to Supra wallet...');
          const response = await wallet.connect();
          
          if (!response || (!response.address && !response)) {
            throw new Error('Wallet connection returned invalid response');
          }

          newAccount = {
            address: () => response.address || response,
            signAndSubmitTransaction: wallet.signAndSubmitTransaction?.bind(wallet)
          };
          type = 'starkey';
          console.log('✅ Successfully connected to Supra wallet:', response.address || response);
          
        } catch (walletError: any) {
          // Handle specific wallet errors
          if (walletError.code === 4001) {
            throw new Error('Wallet connection rejected by user. Please try again and approve the connection.');
          } else if (walletError.code === -32002) {
            throw new Error('Wallet connection request already pending. Please check your wallet.');
          } else {
            console.error('Supra wallet connection failed:', walletError);
            throw new Error(`Wallet connection failed: ${walletError.message || 'Unknown error'}`);
          }
        }
      }
      
      // Fallback to mock account
      if (!newAccount) {
        console.log('🎭 Initializing demo wallet mode...');
        newAccount = new MockAccount();
        type = 'mock';
        console.log('🔄 Demo wallet ready');
      }

      setAccount(newAccount);
      setWalletType(type);
      setIsConnected(true);
      
      // Refresh balances and stats with error handling
      try {
        await Promise.all([
          refreshBalances(newAccount),
          refreshPlatformStats()
        ]);
      } catch (refreshError) {
        console.warn('⚠️ Failed to refresh data after connection:', refreshError);
        // Don't throw here, connection was successful
      }

    } catch (error) {
      console.error('❌ Wallet connection error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown connection error';
      setError(errorMessage);
      
      // Only fallback to demo mode if it wasn't already attempted
      if (preferredType !== 'mock') {
        console.log('🔄 Falling back to demo mode due to connection failure');
        try {
          const mockAccount = new MockAccount();
          setAccount(mockAccount);
          setWalletType('mock');
          setIsConnected(true);
          await refreshBalances(mockAccount);
          setError(null); // Clear error since fallback succeeded
        } catch (fallbackError) {
          console.error('❌ Even demo mode failed:', fallbackError);
          setError('Failed to initialize wallet system');
        }
      } else {
        // If mock mode itself failed, rethrow
        throw error;
      }
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
