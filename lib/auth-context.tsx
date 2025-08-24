'use client';

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { useSupraWallet, SUPRA_CONFIG } from './wallet-context-supra';

// Email-based user profile interface
interface UserProfile {
  id: string;
  email: string;
  username?: string;
  walletAddress?: string;
  createdAt: number;
  lastLogin: number;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    autoConnect: boolean;
  };
}

// Combined authentication state
interface AuthContextType {
  // Email authentication
  user: UserProfile | null;
  isEmailAuthenticated: boolean;
  emailLoading: boolean;
  emailError: string | null;
  
  // Wallet integration
  walletConnected: boolean;
  walletAddress: string | null;
  
  // Combined state
  isFullyAuthenticated: boolean;
  
  // Email methods
  signUpWithEmail: (email: string, username?: string) => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => void;
  
  // Wallet methods
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  
  // Profile methods
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  linkWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Email authentication state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEmailAuthenticated, setIsEmailAuthenticated] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Wallet integration
  const { 
    account: walletAccount, 
    isConnected: walletConnected,
    connectWallet: suprConnectWallet,
    disconnectWallet: supraDisconnectWallet 
  } = useSupraWallet();

  const walletAddress = walletAccount?.address || null;
  const isFullyAuthenticated = isEmailAuthenticated && walletConnected;

  // Email sign-up
  const signUpWithEmail = async (email: string, username?: string) => {
    try {
      setEmailLoading(true);
      setEmailError(null);

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Create user profile
      const userProfile: UserProfile = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        username: username || email.split('@')[0],
        walletAddress: walletAddress || undefined,
        createdAt: Date.now(),
        lastLogin: Date.now(),
        preferences: {
          notifications: true,
          newsletter: true,
          autoConnect: false
        }
      };

      // In production, this would be an API call
      // await fetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, username }) });
      
      // Store user profile
      localStorage.setItem('dropify_user_profile', JSON.stringify(userProfile));
      localStorage.setItem('dropify_email_auth', 'true');
      
      setUser(userProfile);
      setIsEmailAuthenticated(true);

      console.log('✅ Email signup successful:', email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign-up failed';
      setEmailError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setEmailLoading(false);
    }
  };

  // Email sign-in
  const signInWithEmail = async (email: string) => {
    try {
      setEmailLoading(true);
      setEmailError(null);

      // In production, this would verify with backend
      // const response = await fetch('/api/auth/signin', { method: 'POST', body: JSON.stringify({ email }) });
      
      // Check if user exists in localStorage (demo)
      const savedProfile = localStorage.getItem('dropify_user_profile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.email === email) {
          profile.lastLogin = Date.now();
          
          // Update wallet address if connected
          if (walletAddress && profile.walletAddress !== walletAddress) {
            profile.walletAddress = walletAddress;
          }
          
          localStorage.setItem('dropify_user_profile', JSON.stringify(profile));
          localStorage.setItem('dropify_email_auth', 'true');
          
          setUser(profile);
          setIsEmailAuthenticated(true);
          console.log('✅ Email signin successful:', email);
          return;
        }
      }

      throw new Error('Account not found. Please sign up first.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign-in failed';
      setEmailError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setEmailLoading(false);
    }
  };

  // Sign out (clear both email and wallet)
  const signOut = () => {
    // Clear email auth
    setUser(null);
    setIsEmailAuthenticated(false);
    setEmailError(null);
    localStorage.removeItem('dropify_email_auth');
    
    // Disconnect wallet
    if (walletConnected) {
      supraDisconnectWallet();
    }
    
    console.log('👋 User signed out');
  };

  // Connect wallet (wrapper around Supra wallet)
  const connectWallet = async () => {
    try {
      await suprConnectWallet();
      
      // If user is email authenticated, link the wallet address
      if (user && walletAddress) {
        await linkWallet();
      }
    } catch (err) {
      console.error('Wallet connection failed:', err);
      throw err;
    }
  };

  // Disconnect wallet only (keep email auth)
  const disconnectWallet = () => {
    supraDisconnectWallet();
    
    // Update user profile to remove wallet address
    if (user) {
      const updatedUser = { ...user, walletAddress: undefined };
      setUser(updatedUser);
      localStorage.setItem('dropify_user_profile', JSON.stringify(updatedUser));
    }
  };

  // Link wallet to existing email account
  const linkWallet = async () => {
    if (!user || !walletAddress) {
      throw new Error('Both email and wallet must be authenticated to link');
    }

    try {
      const updatedUser = { ...user, walletAddress };
      setUser(updatedUser);
      localStorage.setItem('dropify_user_profile', JSON.stringify(updatedUser));
      
      console.log('🔗 Wallet linked to email account:', walletAddress);
    } catch (err) {
      console.error('Failed to link wallet:', err);
      throw err;
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('dropify_user_profile', JSON.stringify(updatedUser));
      
      console.log('📝 Profile updated');
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  };

  // Auto-login on page load
  useEffect(() => {
    const savedAuth = localStorage.getItem('dropify_email_auth');
    const savedProfile = localStorage.getItem('dropify_user_profile');
    
    if (savedAuth === 'true' && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUser(profile);
        setIsEmailAuthenticated(true);
        console.log('🔄 Auto-login successful:', profile.email);
      } catch (err) {
        console.error('Auto-login failed:', err);
        localStorage.removeItem('dropify_email_auth');
        localStorage.removeItem('dropify_user_profile');
      }
    }
  }, []);

  // Sync wallet address when wallet state changes
  useEffect(() => {
    if (user && walletAddress && user.walletAddress !== walletAddress) {
      linkWallet().catch(console.error);
    }
  }, [walletAddress, user]);

  const value: AuthContextType = {
    // Email authentication
    user,
    isEmailAuthenticated,
    emailLoading,
    emailError,
    
    // Wallet integration  
    walletConnected,
    walletAddress,
    
    // Combined state
    isFullyAuthenticated,
    
    // Methods
    signUpWithEmail,
    signInWithEmail,
    signOut,
    connectWallet,
    disconnectWallet,
    updateProfile,
    linkWallet
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export user profile type for other components
export type { UserProfile };
