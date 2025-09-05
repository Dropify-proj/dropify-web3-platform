'use client';

import { useState } from 'react';
import { useEnhancedWallet } from '../../lib/enhanced-wallet-context';
import { SUPRA_CONFIG } from '../../lib/dropify-smart-contract';

interface Web3DashboardProps {
  className?: string;
}

export default function Web3Dashboard({ className = '' }: Web3DashboardProps) {
  const {
    account,
    isConnected,
    walletType,
    dropBalance,
    drfBalance,
    platformStats,
    recentTransactions,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    convertDropToDrf,
    redeemReward
  } = useEnhancedWallet();

  const [showConversion, setShowConversion] = useState(false);
  const [conversionAmount, setConversionAmount] = useState(100);
  const [showRedemption, setShowRedemption] = useState(false);

  const handleConvertTokens = async () => {
    if (conversionAmount < 100) {
      alert('Minimum 100 DROP tokens required for conversion');
      return;
    }
    
    if (conversionAmount > dropBalance) {
      alert('Insufficient DROP balance');
      return;
    }

    const result = await convertDropToDrf(conversionAmount);
    if (result.success) {
      setShowConversion(false);
      setConversionAmount(100);
    }
  };

  const handleRedeemReward = async (rewardType: string, cost: number) => {
    if (cost > dropBalance) {
      alert('Insufficient DROP balance');
      return;
    }

    const result = await redeemReward(rewardType, cost);
    if (result.success) {
      setShowRedemption(false);
    }
  };

  const WalletStatus = () => (
    <div className="glass-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Wallet Status</h3>
        <div className={`px-3 py-1 rounded-full text-sm ${
          isConnected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
        }`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>
      
      {isConnected && account ? (
        <div className="space-y-3">
          <div className="text-sm text-gray-300">
            <span className="text-purple-300">Wallet Type:</span> {
              walletType === 'mock' ? '🎮 Demo Mode' : 
              walletType === 'starkey' ? '⭐ StarKey Wallet' : 
              '🔗 Supra Wallet'
            }
          </div>
          <div className="text-sm text-gray-300 break-all">
            <span className="text-purple-300">Address:</span> {account.address()}
          </div>
          <div className="text-sm text-gray-300">
            <span className="text-purple-300">Network:</span> {SUPRA_CONFIG.name}
          </div>
          
          <div className="flex space-x-2 mt-4">
            <button
              onClick={disconnectWallet}
              className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Disconnect
            </button>
            <a
              href={`${SUPRA_CONFIG.explorerUrl}/account/${account.address()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              View on Explorer
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-gray-300">Connect your wallet to start earning rewards</p>
          <div className="flex space-x-2">
            <button
              onClick={() => connectWallet('starkey')}
              className="btn-primary"
            >
              Connect StarKey
            </button>
            <button
              onClick={() => connectWallet('mock')}
              className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition-colors"
            >
              Demo Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const TokenBalances = () => (
    <div className="glass-card p-6 mb-6">
      <h3 className="text-xl font-semibold text-white mb-4">Token Balances</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
          <div className="text-2xl font-bold text-green-300">{dropBalance.toLocaleString()}</div>
          <div className="text-green-200">DROP Tokens</div>
          <div className="text-xs text-gray-400 mt-1">Utility tokens for rewards</div>
        </div>
        
        <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
          <div className="text-2xl font-bold text-purple-300">{drfBalance.toLocaleString()}</div>
          <div className="text-purple-200">DRF Tokens</div>
          <div className="text-xs text-gray-400 mt-1">Governance tokens</div>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setShowConversion(true)}
          disabled={dropBalance < 100}
          className={`px-4 py-2 rounded-lg transition-colors ${
            dropBalance >= 100 
              ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' 
              : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
          }`}
        >
          Convert DROP → DRF
        </button>
        
        <button
          onClick={() => setShowRedemption(true)}
          disabled={dropBalance < 10}
          className={`px-4 py-2 rounded-lg transition-colors ${
            dropBalance >= 10 
              ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
              : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
          }`}
        >
          Redeem Rewards
        </button>
      </div>
    </div>
  );

  const RecentTransactions = () => (
    <div className="glass-card p-6 mb-6">
      <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
      
      {recentTransactions.length === 0 ? (
        <p className="text-gray-400">No transactions yet. Scan a receipt to get started!</p>
      ) : (
        <div className="space-y-3">
          {recentTransactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-white font-medium">
                    {tx.type === 'receipt_scan' && '📸 Receipt Scanned'}
                    {tx.type === 'conversion' && '🔄 DROP → DRF'}
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
                  <a
                    href={`${SUPRA_CONFIG.explorerUrl}/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-xs"
                  >
                    View TX ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const PlatformStats = () => (
    platformStats && (
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Platform Statistics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-300">
              {platformStats.totalDropMinted?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-300">Total DROP Minted</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-300">
              {platformStats.totalDropBurned?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-300">Total DROP Burned</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-300">
              {platformStats.totalReceiptsProcessed?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-300">Receipts Processed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-300">
              {platformStats.drfTreasuryBalance?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-300">DRF Treasury</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-300">
              {platformStats.testnetDrfDistributed?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-300">Testnet DRF Distributed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300">
              {((platformStats.testnetDrfDistributed / platformStats.testnetDrfLimit) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-300">Testnet Progress</div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-300">
          ⚠️ {error}
        </div>
      )}
      
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Processing transaction...</p>
          </div>
        </div>
      )}

      <WalletStatus />
      {isConnected && (
        <>
          <TokenBalances />
          <RecentTransactions />
          <PlatformStats />
        </>
      )}

      {/* Conversion Modal */}
      {showConversion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">Convert DROP to DRF</h3>
            <p className="text-gray-300 mb-4">Exchange rate: 100 DROP = 1 DRF</p>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">DROP Amount to Convert</label>
              <input
                type="number"
                min="100"
                step="100"
                max={dropBalance}
                value={conversionAmount}
                onChange={(e) => setConversionAmount(Number(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              />
              <div className="text-sm text-gray-400 mt-1">
                You will receive: {Math.floor(conversionAmount / 100)} DRF
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleConvertTokens}
                className="flex-1 btn-primary"
              >
                Convert
              </button>
              <button
                onClick={() => setShowConversion(false)}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redemption Modal */}
      {showRedemption && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">Redeem Rewards</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => handleRedeemReward('$5 Gift Card', 50)}
                disabled={dropBalance < 50}
                className="w-full bg-blue-500/20 text-white p-3 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50"
              >
                $5 Gift Card (50 DROP)
              </button>
              
              <button
                onClick={() => handleRedeemReward('$10 Gift Card', 100)}
                disabled={dropBalance < 100}
                className="w-full bg-green-500/20 text-white p-3 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
              >
                $10 Gift Card (100 DROP)
              </button>
              
              <button
                onClick={() => handleRedeemReward('Premium Membership', 200)}
                disabled={dropBalance < 200}
                className="w-full bg-purple-500/20 text-white p-3 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50"
              >
                Premium Membership (200 DROP)
              </button>
            </div>
            
            <button
              onClick={() => setShowRedemption(false)}
              className="w-full mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
