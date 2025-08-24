'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useSupraWallet } from '@/lib/wallet-context-supra';

type AuthMode = 'signin' | 'signup' | 'wallet-only';

export default function EnhancedAuthButton() {
  const { 
    user, 
    isEmailAuthenticated, 
    isFullyAuthenticated,
    walletConnected,
    walletAddress,
    emailLoading,
    emailError,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    connectWallet,
    disconnectWallet
  } = useAuth();

  const { dropBalance, drfBalance } = useSupraWallet();

  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (authMode === 'signup') {
        await signUpWithEmail(email, username || undefined);
      } else {
        await signInWithEmail(email);
      }
      setShowAuthModal(false);
      setEmail('');
      setUsername('');
    } catch (err) {
      // Error is handled by context
      console.error('Auth error:', err);
    }
  };

  const handleWalletOnlyConnect = async () => {
    try {
      await connectWallet();
      setShowAuthModal(false);
    } catch (err) {
      console.error('Wallet connection error:', err);
    }
  };

  // If fully authenticated, show user info
  if (isFullyAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.username}</span>
              <span className="text-xs text-gray-400">{user?.email}</span>
            </div>
          </div>
          
          <div className="w-px h-6 bg-gray-600"></div>
          
          {/* Supra Network Status */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs">Supra Testnet</span>
          </div>
          
          {/* Token Balances */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-green-400">💧</span>
              <span>{dropBalance.toLocaleString()} DROP</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-blue-400">🔷</span>
              <span>{drfBalance.toLocaleString()} DRF</span>
            </div>
          </div>

          {/* Wallet Address */}
          <span className="text-xs text-gray-300">
            {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
          </span>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={signOut}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full transition-all duration-200 text-sm font-medium"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // If only email authenticated, show wallet connection prompt
  if (isEmailAuthenticated && !walletConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-full">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm text-amber-300">Connect Wallet to Complete Setup</span>
        </div>
        
        <button
          onClick={connectWallet}
          disabled={emailLoading}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full transition-all duration-200 text-sm font-medium"
        >
          Connect Supra Wallet
        </button>
      </div>
    );
  }

  // If only wallet connected, show email registration prompt
  if (walletConnected && !isEmailAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-purple-300">
            {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
          </span>
          <span className="text-sm text-gray-400">• Register for Full Access</span>
        </div>
        
        <button
          onClick={() => setShowAuthModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full transition-all duration-200 text-sm font-medium"
        >
          Create Account
        </button>
      </div>
    );
  }

  // No authentication - show auth options
  return (
    <>
      <button
        onClick={() => setShowAuthModal(true)}
        className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xs">🔐</span>
          </div>
          <span>Get Started</span>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Join Dropify</h2>
              <p className="text-gray-400">Choose your preferred authentication method</p>
            </div>

            {/* Auth Mode Tabs */}
            <div className="flex bg-gray-800 rounded-xl p-1 mb-6">
              {[
                { mode: 'signin' as AuthMode, label: 'Sign In', icon: '🔑' },
                { mode: 'signup' as AuthMode, label: 'Sign Up', icon: '✨' },
                { mode: 'wallet-only' as AuthMode, label: 'Wallet Only', icon: '🔗' }
              ].map(({ mode, label, icon }) => (
                <button
                  key={mode}
                  onClick={() => setAuthMode(mode)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    authMode === mode
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {emailError && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {emailError}
              </div>
            )}

            {authMode === 'wallet-only' ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Connect your Supra wallet to start earning rewards from your receipts
                  </p>
                </div>
                
                <button
                  onClick={handleWalletOnlyConnect}
                  disabled={emailLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {emailLoading ? 'Connecting...' : 'Connect Supra Wallet'}
                </button>
                
                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    No wallet? Install{' '}
                    <a 
                      href="https://wallet.supra.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      StarKey Wallet
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username (Optional)
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="Choose a username"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={emailLoading || !email}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {emailLoading ? 'Processing...' : authMode === 'signup' ? 'Create Account' : 'Sign In'}
                </button>

                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    {authMode === 'signup' 
                      ? 'You can connect your Supra wallet after registration'
                      : 'Your wallet can be linked after sign in'
                    }
                  </p>
                </div>
              </form>
            )}

            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
