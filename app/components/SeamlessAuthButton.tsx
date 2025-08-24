'use client';

import { useState } from 'react';
import { useEnhancedAuth } from '@/lib/enhanced-auth-context';

export default function SeamlessAuthButton() {
  const { 
    user, 
    isAuthenticated, 
    activeWalletAddress,
    walletType,
    isLoading,
    error,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    connectExternalWallet,
    switchToExternalWallet,
    switchToCustodialWallet,
    exportWalletDetails
  } = useEnhancedAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (authMode === 'signup') {
        await signUpWithEmail(email, username || undefined);
        // Show backup modal after successful signup
        setShowAuthModal(false);
        setShowBackupModal(true);
      } else {
        await signInWithEmail(email);
        setShowAuthModal(false);
      }
      setEmail('');
      setUsername('');
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const handleBackupLater = () => {
    setShowBackupModal(false);
  };

  const handleDownloadBackup = () => {
    const walletDetails = exportWalletDetails();
    if (walletDetails) {
      const backupData = {
        email: user?.email,
        walletAddress: walletDetails.address,
        mnemonic: walletDetails.mnemonic,
        createdAt: new Date().toISOString(),
        warning: 'Keep this backup safe and secure. Anyone with this mnemonic can access your wallet.'
      };
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dropify-wallet-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setShowBackupModal(false);
  };

  // If authenticated, show user info with seamless wallet integration
  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        {/* User Info - No wallet complexity shown */}
        <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.username}</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Ready to Earn</span>
              </div>
            </div>
          </div>

          {/* Simplified status - no wallet technical details */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-green-400">💧</span>
              <span>0 DROP</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-blue-400">🔷</span>
              <span>0 DRF</span>
            </div>
          </div>

          {/* Advanced options button */}
          <button
            onClick={() => setShowWalletOptions(!showWalletOptions)}
            className="text-gray-400 hover:text-white transition-colors p-1"
            title="Wallet Options"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={signOut}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full transition-all duration-200 text-sm font-medium"
        >
          Sign Out
        </button>

        {/* Advanced Wallet Options Dropdown */}
        {showWalletOptions && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 p-4">
            <div className="mb-4">
              <h3 className="text-white font-medium mb-2">Wallet Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white capitalize">{walletType} Wallet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Address:</span>
                  <span className="text-white font-mono text-xs">
                    {activeWalletAddress?.slice(0, 6)}...{activeWalletAddress?.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-green-400">Supra Testnet</span>
                </div>
              </div>
            </div>

            {walletType === 'custodial' && (
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => {
                    setShowBackupModal(true);
                    setShowWalletOptions(false);
                  }}
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                >
                  📱 Backup Wallet
                </button>
                
                <button
                  onClick={async () => {
                    try {
                      await connectExternalWallet();
                      setShowWalletOptions(false);
                    } catch (err) {
                      console.error('Failed to connect external wallet:', err);
                    }
                  }}
                  className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                >
                  🔗 Connect External Wallet
                </button>
              </div>
            )}

            {user.externalWallet && (
              <div className="space-y-2 mb-4">
                <div className="text-xs text-gray-400 mb-2">Switch Wallet:</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      switchToCustodialWallet();
                      setShowWalletOptions(false);
                    }}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                      walletType === 'custodial' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Built-in
                  </button>
                  <button
                    onClick={() => {
                      switchToExternalWallet();
                      setShowWalletOptions(false);
                    }}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                      walletType === 'external' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    External
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowWalletOptions(false)}
              className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    );
  }

  // Not authenticated - show simple sign up
  return (
    <>
      <button
        onClick={() => setShowAuthModal(true)}
        className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xs">✨</span>
          </div>
          <span>Start Earning Rewards</span>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      {/* Simple Authentication Modal - No Wallet Complexity */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {authMode === 'signup' ? 'Start Earning Rewards' : 'Welcome Back'}
              </h2>
              <p className="text-gray-400">
                {authMode === 'signup' 
                  ? 'Turn your receipts into valuable rewards. Just enter your email to get started!'
                  : 'Sign in to continue earning rewards from your receipts'
                }
              </p>
            </div>

            {/* Auth Mode Tabs */}
            <div className="flex bg-gray-800 rounded-xl p-1 mb-6">
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  authMode === 'signup'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Get Started
              </button>
              <button
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  authMode === 'signin'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

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
                disabled={isLoading || !email}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50"
              >
                {isLoading ? 'Setting up your account...' : authMode === 'signup' ? '🚀 Create My Account' : '🔑 Sign In'}
              </button>

              {authMode === 'signup' && (
                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    ✨ A secure wallet will be automatically created for you<br/>
                    📱 You can backup your wallet after signing up
                  </p>
                </div>
              )}
            </form>

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

      {/* Wallet Backup Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Backup Your Wallet</h2>
              <p className="text-gray-400">
                We've created a secure wallet for you. Would you like to backup your wallet now?
              </p>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">⚠️</span>
                <div>
                  <h4 className="text-yellow-400 font-medium mb-1">Important</h4>
                  <p className="text-sm text-gray-300">
                    Your wallet backup contains your private keys. Keep it safe and never share it with anyone.
                    You can always backup your wallet later from your account settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleDownloadBackup}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all duration-200 font-medium"
              >
                📱 Download Backup Now
              </button>
              
              <button
                onClick={handleBackupLater}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-all duration-200 font-medium"
              >
                ⏰ I'll Do This Later
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-xs text-gray-400">
                You can access backup options anytime from your profile settings
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
