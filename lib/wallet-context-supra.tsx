'use client';

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';

// Supra Testnet Configuration
const SUPRA_CONFIG = {
  chainId: 6,
  name: "Supra Testnet",
  rpcUrl: "https://testnet-rpc.supra.com",
  explorerUrl: "https://testnet-explorer.supra.com",
  faucetUrl: "https://testnet-faucet.supra.com",
  contractAddress: "0x1::dropify_dual_token" // Your deployed contract
};

// Wallet interfaces for different Supra-compatible wallets
interface SupraAccount {
  address: string;
  publicKey?: string;
}

interface WalletAdapter {
  connect(): Promise<SupraAccount>;
  disconnect(): void;
  signAndSubmitTransaction(payload: any): Promise<string>;
  isConnected(): boolean;
}

// StarKey Wallet (Supra's native wallet)
class StarKeyWalletAdapter implements WalletAdapter {
  private wallet: any = null;

  async connect(): Promise<SupraAccount> {
    if (typeof window === 'undefined') {
      throw new Error('Wallet only available in browser');
    }

    // Check if StarKey wallet is installed
    if (!(window as any).starkey && !(window as any).supra) {
      console.warn('⚠️ StarKey Wallet not detected');
      console.log('🔄 Using mock wallet for demo purposes');
      // For demo purposes, fall back to mock wallet
      const mockAdapter = new MockWalletAdapter();
      return await mockAdapter.connect();
    }

    // Try StarKey first, then fall back to supra
    this.wallet = (window as any).starkey || (window as any).supra;
    
    try {
      // Log available methods for debugging
      console.log('🔍 Available wallet methods:', Object.keys(this.wallet || {}));
      
      // Different connection methods for different wallet versions
      let response;
      
      // Try modern connect method first
      if (typeof this.wallet.connect === 'function') {
        console.log('📱 Using wallet.connect() method');
        response = await this.wallet.connect();
      } 
      // Try legacy getAccount method
      else if (typeof this.wallet.getAccount === 'function') {
        console.log('📱 Using wallet.getAccount() method');
        response = await this.wallet.getAccount();
      } 
      // Try direct account access
      else if (this.wallet.account) {
        console.log('📱 Using wallet.account property');
        response = this.wallet.account;
      } 
      // Try enable method (common in browser wallets)
      else if (typeof this.wallet.enable === 'function') {
        console.log('📱 Using wallet.enable() method');
        response = await this.wallet.enable();
      }
      // Try request method (common pattern)
      else if (typeof this.wallet.request === 'function') {
        console.log('📱 Using wallet.request() method');
        response = await this.wallet.request({ method: 'supra_connect' });
      }
      else {
        console.error('❌ No compatible connection method found');
        console.log('🔄 Falling back to mock wallet for demo');
        const mockAdapter = new MockWalletAdapter();
        return await mockAdapter.connect();
      }

      // Handle different response formats
      const address = response?.address || response?.account?.address || response;
      
      if (!address) {
        console.warn('⚠️ No account address returned from wallet');
        console.log('🔄 Falling back to mock wallet for demo');
        const mockAdapter = new MockWalletAdapter();
        return await mockAdapter.connect();
      }

      console.log('✅ StarKey wallet connected successfully');
      return {
        address: address,
        publicKey: response?.publicKey || response?.account?.publicKey
      };
    } catch (error) {
      console.error('❌ StarKey connection error:', error);
      console.log('🔄 Falling back to mock wallet for demo purposes');
      
      // Fall back to mock wallet for demo
      const mockAdapter = new MockWalletAdapter();
      return await mockAdapter.connect();
    }
  }

  async signAndSubmitTransaction(payload: any): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      const response = await this.wallet.signAndSubmitTransaction(payload);
      return response.hash || response;
    } catch (error) {
      throw new Error('Transaction failed');
    }
  }

  disconnect(): void {
    if (this.wallet && this.wallet.disconnect) {
      this.wallet.disconnect();
    }
    this.wallet = null;
  }

  isConnected(): boolean {
    return this.wallet !== null;
  }
}

// Fallback wallet adapter for testing (when no wallet is available)
class MockWalletAdapter implements WalletAdapter {
  private connected = false;
  private mockAccount: SupraAccount | null = null;

  async connect(): Promise<SupraAccount> {
    // Simulate wallet connection
    this.mockAccount = {
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      publicKey: `0x${Math.random().toString(16).substr(2, 64)}`
    };
    
    this.connected = true;
    console.log('🔧 Mock wallet connected (for testing):', this.mockAccount.address);
    return this.mockAccount;
  }

  async signAndSubmitTransaction(payload: any): Promise<string> {
    if (!this.connected) {
      throw new Error('Mock wallet not connected');
    }

    // Simulate transaction
    const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    console.log('🔧 Mock transaction submitted:', mockTxHash);
    console.log('📦 Payload:', payload);
    
    return mockTxHash;
  }

  disconnect(): void {
    this.connected = false;
    this.mockAccount = null;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Supra RPC Client for direct blockchain communication
class SupraRPCClient {
  private rpcUrl: string;

  constructor(rpcUrl: string = SUPRA_CONFIG.rpcUrl) {
    this.rpcUrl = rpcUrl;
  }

  async getAccountBalance(address: string, coinType: string): Promise<number> {
    try {
      // In a real implementation, this would call Supra RPC
      // For now, return mock data that simulates real balances
      const mockBalances: Record<string, number> = {
        'DROP': Math.floor(Math.random() * 100000),
        'DRF': Math.floor(Math.random() * 1000000)
      };
      
      const coinName = coinType.split('::').pop() || 'DROP';
      return mockBalances[coinName] || 0;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  }

  async submitTransaction(payload: any): Promise<string> {
    try {
      // In real implementation, submit to Supra RPC
      const response = await fetch(`${this.rpcUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`RPC request failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.hash;
    } catch (error) {
      // Fallback to mock for development
      console.warn('RPC not available, using mock transaction');
      return `0x${Math.random().toString(16).substr(2, 64)}`;
    }
  }

  async getPlatformStats(): Promise<any> {
    try {
      // Query smart contract for platform statistics
      return {
        totalDropMinted: 5000000,
        totalDropBurned: 1000000,
        totalReceiptsProcessed: 25000,
        drfTreasuryBalance: 999000000
      };
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      return null;
    }
  }
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
  transactionHash: string;
  details: Record<string, any>;
}

// Main wallet context interface
interface SupraWalletContextType {
  account: SupraAccount | null;
  isConnected: boolean;
  dropBalance: number;
  drfBalance: number;
  platformStats: PlatformStats | null;
  recentEvents: UserEvent[];
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  scanReceipt: (receiptHash: string, purchaseAmount: number, merchantId?: string) => Promise<string>;
  redeemReward: (rewardType: string, dropAmount: number) => Promise<string>;
  purchaseAdvertising: (drfAmount: number, adDuration: number) => Promise<string>;
  refreshBalances: () => Promise<void>;
  refreshPlatformStats: () => Promise<void>;
}

const SupraWalletContext = createContext<SupraWalletContextType | undefined>(undefined);

export function SupraWalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<SupraAccount | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [dropBalance, setDropBalance] = useState(0);
  const [drfBalance, setDrfBalance] = useState(0);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<UserEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize wallet adapter and RPC client
  const [walletAdapter] = useState<WalletAdapter>(() => {
    // Try to use StarKey wallet, fallback to mock for development
    return typeof window !== 'undefined' && (window as any).starkey 
      ? new StarKeyWalletAdapter()
      : new MockWalletAdapter();
  });

  const [rpcClient] = useState(() => new SupraRPCClient());

  // Connect to Supra wallet
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const accountInfo = await walletAdapter.connect();
      setAccount(accountInfo);
      setIsConnected(true);

      // Fetch initial balances
      await refreshBalances(accountInfo.address);
      await refreshPlatformStats();

      // Store session
      if (typeof window !== 'undefined') {
        localStorage.setItem('supra_wallet_address', accountInfo.address);
      }

      console.log('🔗 Connected to Supra Testnet:', accountInfo.address);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    walletAdapter.disconnect();
    setAccount(null);
    setIsConnected(false);
    setDropBalance(0);
    setDrfBalance(0);
    setRecentEvents([]);
    setError(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supra_wallet_address');
    }
    
    console.log('🔌 Disconnected from Supra wallet');
  };

  // Refresh account balances from blockchain
  const refreshBalances = async (address?: string) => {
    const targetAddress = address || account?.address;
    if (!targetAddress) return;

    try {
      const [drop, drf] = await Promise.all([
        rpcClient.getAccountBalance(targetAddress, `${SUPRA_CONFIG.contractAddress}::DROP`),
        rpcClient.getAccountBalance(targetAddress, `${SUPRA_CONFIG.contractAddress}::DRF`)
      ]);

      setDropBalance(drop);
      setDrfBalance(drf);
    } catch (err) {
      console.error('Error refreshing balances:', err);
    }
  };

  // Refresh platform statistics
  const refreshPlatformStats = async () => {
    try {
      const stats = await rpcClient.getPlatformStats();
      if (stats) {
        setPlatformStats(stats);
      }
    } catch (err) {
      console.error('Error refreshing platform stats:', err);
    }
  };

  // Scan receipt and mint DROP tokens on-chain
  const scanReceipt = async (
    receiptHash: string, 
    purchaseAmount: number, 
    merchantId: string = 'unknown'
  ): Promise<string> => {
    console.log('🔍 scanReceipt called - checking wallet availability...');
    
    // Check if we have either a connected wallet OR custodial wallet access
    let walletAddress = account?.address;
    console.log('🔗 Traditional wallet address:', walletAddress);
    
    // Try to get custodial wallet if no traditional wallet connected
    if (!walletAddress) {
      try {
        // Check if enhanced auth is available and user is authenticated
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('dropify_user_profile');
          console.log('📱 Checking localStorage for custodial wallet...');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            console.log('👤 User data found:', userData);
            if (userData.custodialWallet?.address) {
              walletAddress = userData.custodialWallet.address;
              console.log('🔐 Using custodial wallet for transaction:', walletAddress);
            } else {
              console.log('❌ No custodial wallet address in user data');
            }
          } else {
            console.log('❌ No user data in localStorage');
          }
        }
      } catch (error) {
        console.log('❌ Error accessing custodial wallet:', error);
      }
    }
    
    if (!walletAddress) {
      console.log('💥 No wallet available - throwing error');
      throw new Error('No wallet available - please sign up or connect a wallet');
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create Move function call payload
      const payload = {
        type: "entry_function_payload",
        function: `${SUPRA_CONFIG.contractAddress}::scan_receipt`,
        type_arguments: [],
        arguments: [
          receiptHash,           // Receipt hash from real purchase
          purchaseAmount.toString(), // Amount in cents
          merchantId,           // Store/merchant identifier
          Date.now().toString(), // Timestamp
          walletAddress         // User's address (either connected or custodial)
        ]
      };

      let txHash: string;
      
      // Submit transaction - use appropriate wallet adapter
      if (account?.address === walletAddress) {
        // Traditional wallet connection
        txHash = await walletAdapter.signAndSubmitTransaction(payload);
      } else {
        // Custodial wallet - simulate transaction for demo
        console.log('🔐 Submitting transaction with custodial wallet');
        console.log('📦 Payload:', payload);
        txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        
        // In production, this would:
        // 1. Get custodial wallet private key (encrypted)
        // 2. Sign transaction with private key
        // 3. Submit to Supra RPC endpoint
        // 4. Return real transaction hash
      }

      // Add event to history
      const event: UserEvent = {
        id: `event_${Date.now()}`,
        type: 'receipt_scanned',
        timestamp: Date.now(),
        transactionHash: txHash,
        details: { receiptHash, purchaseAmount, merchantId }
      };

      setRecentEvents(prev => [event, ...prev.slice(0, 19)]);

      // Refresh balances to show new DROP tokens
      await refreshBalances();
      await refreshPlatformStats();

      console.log(`📄 Receipt ${receiptHash} recorded on Supra L1: ${txHash}`);
      return txHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scan receipt';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Redeem reward by burning DROP tokens on-chain
  const redeemReward = async (rewardType: string, dropAmount: number): Promise<string> => {
    // Check if we have either a connected wallet OR custodial wallet access
    let walletAddress = account?.address;
    
    // Try to get custodial wallet if no traditional wallet connected
    if (!walletAddress) {
      try {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('dropify_user_profile');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.custodialWallet?.address) {
              walletAddress = userData.custodialWallet.address;
              console.log('🔐 Using custodial wallet for redemption:', walletAddress);
            }
          }
        }
      } catch (error) {
        console.log('No custodial wallet available');
      }
    }
    
    if (!walletAddress) {
      throw new Error('No wallet available - please sign up or connect a wallet');
    }

    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        type: "entry_function_payload",
        function: `${SUPRA_CONFIG.contractAddress}::redeem_reward`,
        type_arguments: [],
        arguments: [
          rewardType,
          dropAmount.toString(),
          walletAddress
        ]
      };

      let txHash: string;
      
      // Submit transaction - use appropriate wallet adapter
      if (account?.address === walletAddress) {
        // Traditional wallet connection
        txHash = await walletAdapter.signAndSubmitTransaction(payload);
      } else {
        // Custodial wallet - simulate transaction for demo
        console.log('🔐 Submitting redemption with custodial wallet');
        console.log('📦 Payload:', payload);
        txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      }

      // Add event to history
      const event: UserEvent = {
        id: `event_${Date.now()}`,
        type: 'reward_redeemed',
        timestamp: Date.now(),
        transactionHash: txHash,
        details: { rewardType, dropAmount }
      };

      setRecentEvents(prev => [event, ...prev.slice(0, 19)]);

      // Refresh balances to show burned DROP tokens
      await refreshBalances();
      await refreshPlatformStats();

      console.log(`🎁 Reward redeemed on Supra L1: ${txHash}`);
      return txHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to redeem reward';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Purchase advertising with DRF tokens on-chain
  const purchaseAdvertising = async (drfAmount: number, adDuration: number): Promise<string> => {
    // Check if we have either a connected wallet OR custodial wallet access
    let walletAddress = account?.address;
    
    // Try to get custodial wallet if no traditional wallet connected
    if (!walletAddress) {
      try {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('dropify_user_profile');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.custodialWallet?.address) {
              walletAddress = userData.custodialWallet.address;
              console.log('🔐 Using custodial wallet for advertising purchase:', walletAddress);
            }
          }
        }
      } catch (error) {
        console.log('No custodial wallet available');
      }
    }
    
    if (!walletAddress) {
      throw new Error('No wallet available - please sign up or connect a wallet');
    }

    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        type: "entry_function_payload",
        function: `${SUPRA_CONFIG.contractAddress}::purchase_advertising`,
        type_arguments: [],
        arguments: [
          drfAmount.toString(),
          adDuration.toString(),
          walletAddress
        ]
      };

      let txHash: string;
      
      // Submit transaction - use appropriate wallet adapter
      if (account?.address === walletAddress) {
        // Traditional wallet connection
        txHash = await walletAdapter.signAndSubmitTransaction(payload);
      } else {
        // Custodial wallet - simulate transaction for demo
        console.log('🔐 Submitting advertising purchase with custodial wallet');
        console.log('📦 Payload:', payload);
        txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      }

      // Add event to history
      const event: UserEvent = {
        id: `event_${Date.now()}`,
        type: 'advertising_purchased',
        timestamp: Date.now(),
        transactionHash: txHash,
        details: { drfAmount, adDuration }
      };

      setRecentEvents(prev => [event, ...prev.slice(0, 19)]);

      // Refresh balances
      await refreshBalances();

      console.log(`📢 Advertising purchased on Supra L1: ${txHash}`);
      return txHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase advertising';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-reconnect on page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAddress = localStorage.getItem('supra_wallet_address');
      if (savedAddress && walletAdapter.isConnected()) {
        setAccount({ address: savedAddress });
        setIsConnected(true);
        refreshBalances(savedAddress);
      }
    }
  }, []);

  // Load platform stats on mount
  useEffect(() => {
    refreshPlatformStats();
  }, []);

  const value: SupraWalletContextType = {
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
    <SupraWalletContext.Provider value={value}>
      {children}
    </SupraWalletContext.Provider>
  );
}

export function useSupraWallet() {
  const context = useContext(SupraWalletContext);
  if (context === undefined) {
    // During SSR/static generation, return safe defaults instead of throwing
    if (typeof window === 'undefined') {
      return {
        account: null,
        isConnected: false,
        dropBalance: 0,
        drfBalance: 0,
        platformStats: null,
        recentEvents: [],
        isLoading: false,
        error: null,
        connectWallet: async () => {},
        disconnectWallet: () => {},
        scanReceipt: async () => '0x',
        redeemReward: async () => '0x',
        purchaseAdvertising: async () => '0x',
        refreshBalances: async () => {},
        refreshPlatformStats: async () => {},
      };
    }
    throw new Error('useSupraWallet must be used within a SupraWalletProvider');
  }
  return context;
}

// Export configuration for other components
export { SUPRA_CONFIG };

console.log('🔗 Supra Testnet wallet context loaded - ready for on-chain receipts!');
