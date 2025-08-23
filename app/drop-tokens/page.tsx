'use client';

import Header from '../components/Header';
import ReceiptProcessor from '../components/ReceiptProcessor';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../lib/wallet-context';

export default function DropifyMintPage() {
  const router = useRouter();
  const { 
    isConnected, 
    dropBalance, 
    drfBalance, 
    redeemReward, 
    isLoading: walletLoading,
    error: walletError 
  } = useWallet();
  
  const [burnHistory, setBurnHistory] = useState<{reward: string, amount: number, timestamp: string}[]>([]);
  const [showBurnConfirm, setShowBurnConfirm] = useState<{show: boolean, reward: any, index: number}>({show: false, reward: null, index: -1});
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleBurnTokens = async (reward: any, cost: number) => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    if (dropBalance < cost) {
      alert(`Insufficient $DROP balance. You need ${cost} $DROP but only have ${dropBalance.toFixed(2)} $DROP.`);
      return;
    }

    try {
      setIsRedeeming(true);
      
      // Call smart contract to redeem reward
      const result = await redeemReward(reward.title, cost);
      
      if (result.success) {
        // Add to burn history for local display
        setBurnHistory(prev => [...prev, {
          reward: reward.title,
          amount: cost,
          timestamp: new Date().toLocaleString()
        }]);

        // Redirect to success page with reward details
        const params = new URLSearchParams({
          reward: reward.title,
          cost: cost.toString(),
          icon: reward.icon,
          txHash: result.transactionHash || ''
        });
        
        router.push(`/redemption-success?${params.toString()}`);
      } else {
        alert(`Failed to redeem reward: ${result.error}`);
      }
      
      setShowBurnConfirm({show: false, reward: null, index: -1});
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert(`Error redeeming reward: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Futuristic background */}
      <div className="fixed inset-0 grid-pattern" />
      <div className="fixed inset-0 particles">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i * 41) % 100}%`,
              animationDelay: `${(i * 0.35) % 6}s`,
              animationDuration: `${6 + (i % 4)}s`
            }}
          />
        ))}
      </div>
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8">
              <span className="block text-white">Transform Receipts Into</span>
              <span className="block text-hologram mt-4">WEB3 REWARDS</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
              Turn everyday purchases into valuable digital assets. 
              <span className="text-cyan-400 font-semibold"> Scan receipts for $DROP tokens. Burn $DROP for rewards. Earn $DRF for governance.</span>
            </p>
            
            {/* Enhanced Token Balance Display */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              {isConnected ? (
                <>
                  <div className="inline-flex items-center neon-border glass px-8 py-4 rounded-2xl">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mr-4 animate-pulse"></div>
                    <div className="text-left">
                      <div className="text-sm text-gray-400 font-mono">YOUR $DROP BALANCE</div>
                      <div className="font-bold text-2xl text-hologram">
                        {dropBalance.toFixed(2)} $DROP
                      </div>
                    </div>
                  </div>
                  
                  <div className="inline-flex items-center neon-border glass px-6 py-4 rounded-2xl border-purple-500/30">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full mr-3 flex items-center justify-center text-xs">Ð</div>
                    <div className="text-left">
                      <div className="text-xs text-gray-400 font-mono">YOUR $DRF BALANCE</div>
                      <div className="font-bold text-lg text-purple-400">
                        {drfBalance.toFixed(2)} $DRF
                      </div>
                    </div>
                  </div>
                  
                  {burnHistory.length > 0 && (
                    <div className="inline-flex items-center neon-border glass px-6 py-4 rounded-2xl border-orange-500/30">
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-3 flex items-center justify-center text-xs">🔥</div>
                      <div className="text-left">
                        <div className="text-xs text-gray-400 font-mono">TOTAL BURNED</div>
                        <div className="font-bold text-lg text-orange-400">
                          {burnHistory.reduce((total, burn) => total + burn.amount, 0).toLocaleString()} $DROP
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="neon-border glass p-8 rounded-2xl text-center max-w-lg">
                  <div className="text-4xl mb-4">🔗</div>
                  <h3 className="text-xl font-bold text-white mb-3">Connect Your Wallet</h3>
                  <p className="text-gray-400 mb-6">
                    Connect your wallet to view your $DROP and $DRF balances, scan receipts, and redeem rewards.
                  </p>
                  <div className="text-sm text-cyan-400">
                    Click "Connect Wallet" in the top navigation to get started!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-48 h-48 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        </div>
      </section>

      {/* Receipt Processor Section */}
      <section id="scanner" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReceiptProcessor />
        </div>
      </section>

      {/* Rewards Section */}
      <section id="rewards" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-hologram mb-6">
              DIGITAL REWARDS
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Exchange Drop Tokens for exclusive digital assets and real-world benefits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "💳",
                title: "Digital Gift Cards",
                description: "Instant delivery to your digital wallet",
                cost: "50 $DROP",
                color: "from-cyan-500 to-blue-600",
                available: true
              },
              {
                icon: "🎯",
                title: "Premium Discounts",
                description: "20% off at partner metaverse stores",
                cost: "75 $DROP",
                color: "from-blue-500 to-purple-600",
                available: true
              },
              {
                icon: "🌟",
                title: "VIP Access",
                description: "Exclusive events and early access to features",
                cost: "100 $DROP",
                color: "from-purple-500 to-cyan-600",
                available: dropBalance >= 100
              }
            ].map((reward, index) => (
              <div
                key={index}
                className="neon-border glass p-8 rounded-xl hover:scale-105 transition-all duration-300 group"
              >
                <div className={`text-4xl mb-4 p-4 rounded-lg bg-gradient-to-r ${reward.color} w-fit`}>
                  {reward.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {reward.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors mb-6">
                  {reward.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-hologram">
                    {reward.cost}
                  </span>
                  <button 
                    onClick={() => {
                      if (reward.available) {
                        setShowBurnConfirm({show: true, reward, index});
                      }
                    }}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                      reward.available 
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:scale-105 glow-cyan' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!reward.available}
                  >
                    {reward.available ? '🔥 BURN & REDEEM' : 'LOCKED'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Burn History Section */}
      {burnHistory.length > 0 && (
        <section className="py-16 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-hologram mb-4">
                🔥 BURN HISTORY
              </h2>
              <p className="text-lg text-gray-300">
                Your recent token burns and reward redemptions
              </p>
            </div>

            <div className="neon-border glass p-6 rounded-xl">
              <div className="space-y-4">
                {burnHistory.slice(-5).reverse().map((burn, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-orange-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                        🔥
                      </div>
                      <div>
                        <div className="font-semibold text-white">{burn.reward}</div>
                        <div className="text-sm text-gray-400">{burn.timestamp}</div>
                      </div>
                    </div>
                    <div className="text-orange-400 font-bold">
                      -{burn.amount} $DROP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Burn Confirmation Modal */}
      {showBurnConfirm.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="neon-border glass p-8 rounded-xl max-w-md w-full relative">
            <div className="text-center">
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-2xl font-bold text-white mb-4">Confirm Token Burn</h3>
              <p className="text-gray-300 mb-6">
                You're about to burn <span className="text-orange-400 font-bold">{showBurnConfirm.reward?.cost}</span> Drop Tokens 
                to redeem <span className="text-cyan-400 font-bold">{showBurnConfirm.reward?.title}</span>.
              </p>
              <p className="text-sm text-gray-400 mb-8">
                🔥 Burned tokens are permanently destroyed and cannot be recovered.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowBurnConfirm({show: false, reward: null, index: -1})}
                  disabled={isRedeeming}
                  className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleBurnTokens(showBurnConfirm.reward, parseInt(showBurnConfirm.reward.cost.replace('$DROP', '').replace(' ', '')))}
                  disabled={isRedeeming}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:scale-105 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isRedeeming ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Burning...
                    </>
                  ) : (
                    <>🔥 BURN NOW</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-hologram mb-6">
              PLATFORM STATISTICS
            </h2>
            <p className="text-xl text-gray-300">
              Real-time metrics showing our platform's performance
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: "Receipts Processed", value: "1.2M+", color: "from-cyan-400 to-blue-500" },
              { label: "Tokens Generated", value: "45M+", color: "from-blue-400 to-purple-500" },
              { label: "Active Users", value: "250K+", color: "from-purple-400 to-cyan-500" },
              { label: "Processing Accuracy", value: "99.8%", color: "from-green-400 to-cyan-500" }
            ].map((stat, index) => (
              <div key={index} className="text-center neon-border glass p-8 rounded-xl">
                <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-400 font-mono text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-cyan-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                DROPIFY
              </span>
            </div>
            <p className="text-gray-400 font-mono text-sm">
              © 2024 Dropify Technologies. Receipts to Web3 • AI-powered • Blockchain secured
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
