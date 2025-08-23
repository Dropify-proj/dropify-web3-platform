'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '../../lib/wallet-context';
import { usePrivy } from '@privy-io/react-auth';

export default function AuthButton() {
  const [mounted, setMounted] = useState(false);
  const { 
    isConnected, 
    account, 
    dropBalance, 
    drfBalance, 
    isLoading: walletLoading, 
    connectWallet, 
    disconnectWallet 
  } = useWallet();

  const { 
    ready, 
    authenticated, 
    user, 
    login, 
    logout,
    linkEmail,
    linkWallet,
    unlinkWallet,
    createWallet
  } = usePrivy();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-connect wallet when user authenticates with Privy
  useEffect(() => {
    if (authenticated && !isConnected && ready) {
      connectWallet();
    }
  }, [authenticated, isConnected, ready, connectWallet]);

  const handleConnect = async () => {
    try {
      // First authenticate with Privy (supports email + social + wallet)
      await login();
      
      // If user doesn't have a wallet, create one
      if (authenticated && (!user?.wallet || !user.wallet.address)) {
        await createWallet();
      }
      
      // Connect to our platform wallet context
      await connectWallet();
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      await logout();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const handleLinkEmail = async () => {
    try {
      await linkEmail();
    } catch (error) {
      console.error('Email link error:', error);
    }
  };

  const handleLinkWallet = async () => {
    try {
      await linkWallet();
    } catch (error) {
      console.error('Wallet link error:', error);
    }
  };

  if (!mounted || !ready) {
    return (
      <div className="h-12 w-32 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl animate-pulse border border-cyan-400/30" />
    );
  }

  if (walletLoading) {
    return (
      <div className="px-6 py-3 bg-gradient-to-r from-cyan-500/50 to-purple-600/50 text-white font-bold rounded-xl border border-cyan-400/50 text-sm flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        Connecting...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex items-center gap-3">
        {/* Enhanced onboarding CTA */}
        <div className="hidden lg:flex flex-col text-right">
          <span className="text-xs text-cyan-400 font-medium">Join Dropify</span>
          <span className="text-xs text-gray-400">Email or Wallet</span>
        </div>
        
        <button
          onClick={handleConnect}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl border border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 text-sm flex items-center gap-3 shadow-lg shadow-cyan-500/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Get Started</span>
        </button>
      </div>
    );
  }

  if (authenticated && !isConnected) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={connectWallet}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl border border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 text-sm"
        >
          Activate Wallet
        </button>
      </div>
    );
  }

  // Connected state - show user info and balances
  return (
    <div className="flex items-center gap-3">
      {/* User Info Dropdown */}
      <div className="relative group">
        <button className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-xl border border-cyan-400/30 rounded-xl hover:border-cyan-400/50 transition-all duration-300">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center text-xs font-bold text-black">
            {user?.email?.address ? user.email.address[0].toUpperCase() : 
             user?.wallet?.address ? user.wallet.address.slice(2, 4).toUpperCase() : 'U'}
          </div>
          
          {/* User identifier */}
          <span className="text-white text-sm font-medium">
            {user?.email?.address ? 
              user.email.address.split('@')[0] : 
              user?.wallet?.address ? 
                `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 
                'User'
            }
          </span>
          
          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
          {/* Balances */}
          <div className="mb-4 p-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-400/20">
            <div className="text-xs text-cyan-400 mb-2">Token Balances</div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-white text-sm">DROP:</span>
              <span className="text-cyan-400 font-bold">{dropBalance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">DRF:</span>
              <span className="text-purple-400 font-bold">{drfBalance.toLocaleString()}</span>
            </div>
          </div>

          {/* Account Actions */}
          <div className="space-y-2 mb-4">
            {!user?.email && (
              <button
                onClick={handleLinkEmail}
                className="w-full px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                Link Email
              </button>
            )}
            
            {(!user?.wallet || !user.wallet.address) && (
              <button
                onClick={handleLinkWallet}
                className="w-full px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Link External Wallet
              </button>
            )}
          </div>

          {/* Disconnect */}
          <button
            onClick={handleDisconnect}
            className="w-full px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}
