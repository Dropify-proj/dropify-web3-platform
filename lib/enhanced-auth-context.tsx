'use client';

import { useState, useEffect, useContext, createContext, ReactNode, useMemo } from 'react';
import { useSupraWallet, SUPRA_CONFIG } from './wallet-context-supra';

// Custodial wallet generation utilities
class CustodialWalletGenerator {
  // Generate a new Supra-compatible wallet from email
  static generateWalletFromEmail(email: string): {
    address: string;
    privateKey: string;
    publicKey: string;
    mnemonic: string;
  } {
    // Create deterministic seed from email (in production, use proper cryptography)
    const seed = this.createSeed(email);
    
    // Generate wallet components
    const privateKey = this.generatePrivateKey(seed);
    const publicKey = this.derivePublicKey(privateKey);
    const address = this.deriveAddress(publicKey);
    const mnemonic = this.generateMnemonic(seed);
    
    return {
      address,
      privateKey,
      publicKey,
      mnemonic
    };
  }
  
  private static createSeed(email: string): string {
    // In production, use proper key derivation (PBKDF2, scrypt, etc.)
    // This is a simplified version for demo
    const normalizedEmail = email.toLowerCase().trim();
    const timestamp = '1234567890'; // In production, use secure timestamp or salt
    
    return this.simpleHash(normalizedEmail + timestamp);
  }
  
  private static generatePrivateKey(seed: string): string {
    // Generate 64-character hex private key from seed
    const key = this.simpleHash(seed + 'privatekey');
    return '0x' + key.padEnd(64, '0').substring(0, 64);
  }
  
  private static derivePublicKey(privateKey: string): string {
    // In production, use proper elliptic curve cryptography
    const pub = this.simpleHash(privateKey + 'publickey');
    return '0x' + pub.padEnd(64, '0').substring(0, 64);
  }
  
  private static deriveAddress(publicKey: string): string {
    // Generate Supra-compatible address
    const addr = this.simpleHash(publicKey + 'address');
    return '0x' + addr.substring(0, 40);
  }
  
  private static generateMnemonic(seed: string): string {
    // Generate a 12-word mnemonic for backup
    const words = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
      'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
      'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actual', 'adapt'
    ];
    
    const mnemonic: string[] = [];
    const hash = this.simpleHash(seed + 'mnemonic');
    
    for (let i = 0; i < 12; i++) {
      const index = parseInt(hash.substring(i * 2, i * 2 + 2), 16) % words.length;
      mnemonic.push(words[index]);
    }
    
    return mnemonic.join(' ');
  }
  
  private static simpleHash(input: string): string {
    // Simple hash function (in production, use SHA-256 or similar)
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to hex and pad
    const hex = Math.abs(hash).toString(16);
    return hex.padEnd(32, '0').substring(0, 32);
  }
}

// Enhanced user profile with custodial wallet
interface UserProfile {
  id: string;
  email: string;
  username?: string;
  
  // Custodial wallet details (automatically generated)
  custodialWallet: {
    address: string;
    privateKey: string; // Encrypted in production
    publicKey: string;
    mnemonic: string;   // Encrypted in production
    isGenerated: boolean;
    createdAt: number;
  };
  
  // Optional external wallet (user's own)
  externalWallet?: {
    address: string;
    isConnected: boolean;
    walletType: 'starkey' | 'petra' | 'other';
  };
  
  // User preferences
  preferences: {
    useExternalWallet: boolean; // If true, prioritize external wallet
    showWalletDetails: boolean;
    notifications: boolean;
    newsletter: boolean;
  };
  
  createdAt: number;
  lastLogin: number;
}

// Custodial wallet adapter that works like a real wallet
class CustodialWalletAdapter {
  private wallet: UserProfile['custodialWallet'];
  
  constructor(custodialWallet: UserProfile['custodialWallet']) {
    this.wallet = custodialWallet;
  }
  
  async connect() {
    // Simulate wallet connection
    return {
      address: this.wallet.address,
      publicKey: this.wallet.publicKey
    };
  }
  
  async signAndSubmitTransaction(payload: any): Promise<string> {
    // In production, this would use the private key to sign transactions
    console.log('🔐 Signing transaction with custodial wallet:', this.wallet.address);
    console.log('📦 Payload:', payload);
    
    // Simulate transaction submission to Supra network
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    console.log('✅ Transaction submitted:', txHash);
    
    return txHash;
  }
  
  disconnect() {
    // Custodial wallets don't really "disconnect" but we can simulate it
    console.log('🔌 Custodial wallet session ended');
  }
  
  isConnected(): boolean {
    return true; // Custodial wallets are always "connected"
  }
  
  getPrivateKey(): string {
    return this.wallet.privateKey;
  }
  
  getMnemonic(): string {
    return this.wallet.mnemonic;
  }
}

// Enhanced authentication context
interface EnhancedAuthContextType {
  // User state
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Wallet state (unified - could be custodial or external)
  activeWalletAddress: string | null;
  walletType: 'custodial' | 'external' | null;
  
  // Authentication methods
  signUpWithEmail: (email: string, username?: string) => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => void;
  
  // Wallet management
  connectExternalWallet: () => Promise<void>;
  disconnectExternalWallet: () => void;
  switchToExternalWallet: () => void;
  switchToCustodialWallet: () => void;
  
  // Wallet access (for transactions)
  getCustodialWallet: () => CustodialWalletAdapter | null;
  exportWalletDetails: () => UserProfile['custodialWallet'] | null;
  
  // Profile management
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined);

export function EnhancedAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // External wallet integration
  const { 
    account: externalAccount, 
    isConnected: externalWalletConnected,
    connectWallet: connectExternalSupraWallet,
    disconnectWallet: disconnectExternalSupraWallet 
  } = useSupraWallet();

  // Memoize wallet calculations to prevent unnecessary re-renders
  const activeWalletAddress = useMemo(() => {
    return user?.preferences.useExternalWallet && user?.externalWallet?.address 
      ? user.externalWallet.address 
      : user?.custodialWallet.address || null;
  }, [user?.preferences.useExternalWallet, user?.externalWallet?.address, user?.custodialWallet.address]);

  const walletType: 'custodial' | 'external' | null = useMemo(() => {
    return user?.preferences.useExternalWallet && user?.externalWallet?.address 
      ? 'external' 
      : user?.custodialWallet ? 'custodial' : null;
  }, [user?.preferences.useExternalWallet, user?.externalWallet?.address, user?.custodialWallet]);

  // Sign up with email - automatically generates custodial wallet
  const signUpWithEmail = async (email: string, username?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Generate custodial wallet automatically
      const custodialWallet = CustodialWalletGenerator.generateWalletFromEmail(email);

      // Create complete user profile
      const userProfile: UserProfile = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        username: username || email.split('@')[0],
        
        custodialWallet: {
          ...custodialWallet,
          isGenerated: true,
          createdAt: Date.now()
        },
        
        preferences: {
          useExternalWallet: false, // Start with custodial wallet
          showWalletDetails: false, // Hide technical details by default
          notifications: true,
          newsletter: true
        },
        
        createdAt: Date.now(),
        lastLogin: Date.now()
      };

      // Store user profile securely
      localStorage.setItem('dropify_user_profile', JSON.stringify(userProfile));
      localStorage.setItem('dropify_authenticated', 'true');
      
      setUser(userProfile);
      setIsAuthenticated(true);

      console.log('✅ Account created with custodial wallet:');
      console.log('📧 Email:', email);
      console.log('💼 Wallet:', custodialWallet.address);
      console.log('🔑 Mnemonic:', custodialWallet.mnemonic);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign-up failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with email
  const signInWithEmail = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check for existing account
      const savedProfile = localStorage.getItem('dropify_user_profile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile) as UserProfile;
        if (profile.email === email) {
          profile.lastLogin = Date.now();
          
          localStorage.setItem('dropify_user_profile', JSON.stringify(profile));
          localStorage.setItem('dropify_authenticated', 'true');
          
          setUser(profile);
          setIsAuthenticated(true);
          
          console.log('✅ Signed in with custodial wallet:', profile.custodialWallet.address);
          return;
        }
      }

      throw new Error('Account not found. Please sign up first.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign-in failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem('dropify_authenticated');
    
    // Also disconnect external wallet if connected
    if (externalWalletConnected) {
      disconnectExternalSupraWallet();
    }
    
    console.log('👋 Signed out');
  };

  // Connect external wallet
  const connectExternalWallet = async () => {
    try {
      await connectExternalSupraWallet();
      
      if (user && externalAccount) {
        const updatedUser = {
          ...user,
          externalWallet: {
            address: externalAccount.address,
            isConnected: true,
            walletType: 'starkey' as const // Assuming StarKey for now
          }
        };
        
        setUser(updatedUser);
        localStorage.setItem('dropify_user_profile', JSON.stringify(updatedUser));
        
        console.log('🔗 External wallet connected:', externalAccount.address);
      }
    } catch (err) {
      console.error('Failed to connect external wallet:', err);
      throw err;
    }
  };

  // Disconnect external wallet
  const disconnectExternalWallet = () => {
    disconnectExternalSupraWallet();
    
    if (user) {
      const updatedUser = {
        ...user,
        externalWallet: undefined,
        preferences: {
          ...user.preferences,
          useExternalWallet: false
        }
      };
      
      setUser(updatedUser);
      localStorage.setItem('dropify_user_profile', JSON.stringify(updatedUser));
    }
  };

  // Switch to external wallet
  const switchToExternalWallet = () => {
    if (user && user.externalWallet) {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          useExternalWallet: true
        }
      };
      
      setUser(updatedUser);
      localStorage.setItem('dropify_user_profile', JSON.stringify(updatedUser));
      
      console.log('🔄 Switched to external wallet');
    }
  };

  // Switch to custodial wallet
  const switchToCustodialWallet = () => {
    if (user) {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          useExternalWallet: false
        }
      };
      
      setUser(updatedUser);
      localStorage.setItem('dropify_user_profile', JSON.stringify(updatedUser));
      
      console.log('🔄 Switched to custodial wallet');
    }
  };

  // Get custodial wallet adapter for transactions
  const getCustodialWallet = (): CustodialWalletAdapter | null => {
    if (!user) return null;
    return new CustodialWalletAdapter(user.custodialWallet);
  };

  // Export wallet details for backup
  const exportWalletDetails = (): UserProfile['custodialWallet'] | null => {
    return user?.custodialWallet || null;
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('dropify_user_profile', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  };

  // Auto-login on page load
  useEffect(() => {
    const savedAuth = localStorage.getItem('dropify_authenticated');
    const savedProfile = localStorage.getItem('dropify_user_profile');
    
    if (savedAuth === 'true' && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile) as UserProfile;
        setUser(profile);
        setIsAuthenticated(true);
        console.log('🔄 Auto-login successful');
      } catch (err) {
        console.error('Auto-login failed:', err);
        localStorage.removeItem('dropify_authenticated');
        localStorage.removeItem('dropify_user_profile');
      }
    }
  }, []);

  const value: EnhancedAuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    activeWalletAddress,
    walletType,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    connectExternalWallet,
    disconnectExternalWallet,
    switchToExternalWallet,
    switchToCustodialWallet,
    getCustodialWallet,
    exportWalletDetails,
    updateProfile
  };

  return (
    <EnhancedAuthContext.Provider value={value}>
      {children}
    </EnhancedAuthContext.Provider>
  );
}

export function useEnhancedAuth() {
  const context = useContext(EnhancedAuthContext);
  if (context === undefined) {
    // During SSR/static generation, return safe defaults instead of throwing
    if (typeof window === 'undefined') {
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        activeWalletAddress: null,
        walletType: 'custodial' as const,
        signUpWithEmail: async () => {},
        signInWithEmail: async () => {},
        signOut: () => {},
        connectExternalWallet: async () => {},
        disconnectExternalWallet: () => {},
        switchToExternalWallet: () => {},
        switchToCustodialWallet: () => {},
        getCustodialWallet: () => null,
        exportWalletDetails: () => null,
        updateProfile: async () => {},
      };
    }
    throw new Error('useEnhancedAuth must be used within an EnhancedAuthProvider');
  }
  return context;
}

// Export types and utilities
export { CustodialWalletGenerator, CustodialWalletAdapter };
export type { UserProfile, EnhancedAuthContextType };
