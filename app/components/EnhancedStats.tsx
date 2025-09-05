'use client';

import { useState, useEffect } from 'react';
import { useEnhancedWallet } from '../../lib/enhanced-wallet-context';

// Firebase-like state management for the enhanced platform
interface FirebaseState {
  drops: number;
  referralTokens: number;
  referralCount: number;
  receipts: Array<{
    id: string;
    amount: number;
    storeName: string;
    timestamp: Date;
  }>;
}

interface EnhancedStatsProps {
  className?: string;
}

export default function EnhancedStats({ className = '' }: EnhancedStatsProps) {
  const {
    dropBalance,
    drfBalance,
    isConnected,
    walletType,
    recentTransactions
  } = useEnhancedWallet();

  const [firebaseState, setFirebaseState] = useState<FirebaseState>({
    drops: 0,
    referralTokens: 0,
    referralCount: 0,
    receipts: []
  });

  const [userId] = useState(() => {
    // Generate a consistent user ID for the session
    return `user_${Math.random().toString(36).substr(2, 12)}`;
  });

  // Sync with wallet state
  useEffect(() => {
    setFirebaseState(prev => ({
      ...prev,
      drops: dropBalance,
      referralTokens: Math.floor(drfBalance - (dropBalance / 100))
    }));
  }, [dropBalance, drfBalance]);

  const copyReferralLink = async () => {
    const referralLink = `${window.location.origin}?ref=${userId}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      alert('Referral link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy link');
    }
  };

  const totalDRF = Math.floor(firebaseState.drops / 100) + firebaseState.referralTokens;

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Enhanced Token Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Drops */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/30 text-center">
          <div className="text-sm text-yellow-400 font-semibold mb-2">Current Drops</div>
          <div className="text-3xl font-bold text-yellow-400">{firebaseState.drops.toFixed(2)}</div>
          <div className="text-xs text-gray-400 mt-1">Earned from receipts</div>
        </div>

        {/* Total DRF Tokens */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30 text-center">
          <div className="text-sm text-purple-400 font-semibold mb-2">Total DRF Tokens</div>
          <div className="text-3xl font-bold text-purple-400">{totalDRF}</div>
          <div className="text-xs text-gray-400 mt-1">Governance tokens</div>
        </div>

        {/* Successful Referrals */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-green-500/30 text-center">
          <div className="text-sm text-green-400 font-semibold mb-2">Successful Referrals</div>
          <div className="text-3xl font-bold text-green-400">{firebaseState.referralCount}</div>
          <div className="text-xs text-gray-400 mt-1">Users referred</div>
        </div>

        {/* Referral Bonus */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-pink-500/30 text-center">
          <div className="text-sm text-pink-400 font-semibold mb-2">Referral Bonus</div>
          <div className="text-3xl font-bold text-pink-400">5 DRF</div>
          <div className="text-xs text-gray-400 mt-1">Per successful referral</div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="text-sm font-medium text-gray-400 mb-2">Your User ID:</div>
        <div className="text-xs text-gray-500 mb-3 font-mono break-all">{userId}</div>
        
        <button
          onClick={copyReferralLink}
          className="w-full flex justify-center items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Referral Link
        </button>
      </div>

      {/* Connection Status */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-300">Web3 Connection Status</div>
            <div className={`text-sm mt-1 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? (
                <>🟢 Connected ({walletType === 'mock' ? 'Demo Mode' : 'Supra Wallet'})</>
              ) : (
                <>🔴 Disconnected</>
              )}
            </div>
          </div>
          
          {isConnected && (
            <div className="text-right">
              <div className="text-xs text-gray-400">Blockchain Balance</div>
              <div className="text-sm text-white">{dropBalance} DROP • {drfBalance} DRF</div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity from Enhanced Wallet */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="text-lg font-semibold text-white mb-4">Recent Blockchain Activity</div>
        
        {recentTransactions.length === 0 ? (
          <div className="text-gray-400 text-center py-4">
            No blockchain transactions yet. Upload a receipt to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-white font-medium">
                      {tx.type === 'receipt_scan' && '📸 Receipt Processed'}
                      {tx.type === 'conversion' && '🔄 Token Conversion'}
                      {tx.type === 'redemption' && '🎁 Reward Redeemed'}
                    </div>
                    <div className="text-sm text-gray-300 mt-1">
                      {tx.type === 'receipt_scan' && `+${tx.amount} DROP earned`}
                      {tx.type === 'conversion' && `+${tx.amount} DRF (-${tx.dropBurned} DROP)`}
                      {tx.type === 'redemption' && `${tx.rewardType} (-${tx.amount} DROP)`}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {tx.timestamp.toLocaleString()}
                    </div>
                  </div>
                  
                  {tx.hash && (
                    <div className="text-xs">
                      <a
                        href={`https://testnet-explorer.supra.com/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View TX ↗
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Token Economics Info */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="text-lg font-semibold text-white mb-4">Token Economics</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-gray-400">DROP Tokens (Utility)</div>
            <div className="text-xs text-gray-500">• 1 DROP = $1 spent on receipts</div>
            <div className="text-xs text-gray-500">• Infinite supply, earned through scanning</div>
            <div className="text-xs text-gray-500">• Used for rewards and conversion</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-gray-400">DRF Tokens (Governance)</div>
            <div className="text-xs text-gray-500">• 100 DROP = 1 DRF conversion rate</div>
            <div className="text-xs text-gray-500">• 5 DRF bonus per successful referral</div>
            <div className="text-xs text-gray-500">• Fixed supply: 1 billion total</div>
          </div>
        </div>
      </div>
    </div>
  );
}
