'use client';

import { useSupraWallet } from '@/lib/wallet-context-supra';

export default function SupraAuthButton() {
  const { 
    account, 
    isConnected, 
    isLoading, 
    error, 
    connectWallet, 
    disconnectWallet,
    dropBalance,
    drfBalance 
  } = useSupraWallet();

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>Connecting...</span>
      </div>
    );
  }

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-4">
        {/* Wallet Info */}
        <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full text-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Supra Testnet</span>
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

          {/* Address */}
          <span className="text-xs text-gray-300">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </span>
        </div>

        {/* Disconnect Button */}
        <button
          onClick={disconnectWallet}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full transition-all duration-200 text-sm font-medium"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {error && (
        <div className="text-sm text-red-400 bg-red-900/20 px-3 py-1 rounded-full">
          {error}
        </div>
      )}
      
      <button
        onClick={connectWallet}
        disabled={isLoading}
        className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xs">🔗</span>
          </div>
          <span>Connect Supra Wallet</span>
        </div>
        
        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      {/* Wallet Installation Hint */}
      <div className="text-xs text-gray-400 text-center max-w-xs">
        Need a wallet? Install{' '}
        <a 
          href="https://wallet.supra.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          StarKey Wallet
        </a>
      </div>
    </div>
  );
}
