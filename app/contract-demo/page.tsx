'use client';

import { useState } from 'react';
import { useDropify } from '@/lib/dropify-contract-context';

export default function ContractDemoPage() {
  const { isConnected, isLoading, contract, connect, refreshData } = useDropify();
  const [demoStep, setDemoStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);

  const handleDemoReceiptScan = async () => {
    if (!contract) return;
    
    try {
      setIsScanning(true);
      
      // Simulate scanning a Starbucks receipt for $8.50
      const receiptHash = `receipt_${Date.now()}`;
      const purchaseAmount = 850; // $8.50 in cents
      
      const result = await contract.scanReceipt(receiptHash, purchaseAmount, 'starbucks');
      
      if (result.success) {
        setDemoStep(2);
        await refreshData();
      }
      
    } catch (err) {
      console.error('Demo receipt scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleRedeemReward = async () => {
    if (!contract) return;
    
    try {
      const result = await contract.redeemReward('coffee_voucher', 500);
      
      if (result.success) {
        setDemoStep(3);
        await refreshData();
      }
      
    } catch (err) {
      console.error('Reward redemption error:', err);
    }
  };

  return (
    <div className="font-sans min-h-screen relative overflow-hidden">
      {/* Futuristic background */}
      <div className="fixed inset-0 grid-pattern" />
      <div className="fixed inset-0 particles">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i * 37) % 100}%`,
              animationDelay: `${(i * 0.3) % 6}s`,
              animationDuration: `${6 + (i % 4)}s`
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="p-6 glass">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold text-hologram">DROPIFY</h1>
            <div className="text-sm text-cyan-300">
              ✅ Contract-Based Demo - Built on Supra L1
            </div>
          </div>
        </header>

        {/* Main Demo Content */}
        <main className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8">
              <span className="block text-hologram">CONTRACT DEMO</span>
              <span className="block text-2xl md:text-3xl font-normal text-cyan-300 mt-4">
                Smart Contract Integration
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Experience the power of our Supra L1 smart contract. Transform receipts into 
              <span className="text-cyan-400 font-semibold"> $DROP tokens</span> with 
              <span className="text-purple-400 font-semibold"> real blockchain transactions</span>.
            </p>
          </div>

          {/* Contract Status */}
          <div className="glass neon-border p-8 mb-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-hologram">📊 Contract Status</span>
              {isConnected && <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse glow-green"></span>}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-cyan-400">🔗 Connection</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={isConnected ? 'text-green-400 glow-green' : 'text-red-400'}>
                      {isConnected ? '✅ Connected' : '❌ Disconnected'}
                    </span>
                  </div>
                  {contract?.account && (
                    <>
                      <div className="flex justify-between">
                        <span>Address:</span>
                        <span className="text-cyan-300 font-mono text-xs">
                          {contract.account.address.slice(0, 6)}...{contract.account.address.slice(-4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>DROP Balance:</span>
                        <span className="text-green-400 font-bold">{contract.account.dropBalance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>DRF Balance:</span>
                        <span className="text-amber-400 font-bold">{contract.account.drfBalance.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-purple-400">📈 Platform Stats</h3>
                {contract?.stats && (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>DROP Minted:</span>
                      <span className="text-cyan-300">{contract.stats.totalDropMinted.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DROP Burned:</span>
                      <span className="text-orange-300">{contract.stats.totalDropBurned.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Receipts Processed:</span>
                      <span className="text-green-300">{contract.stats.totalReceiptsProcessed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reward Rate:</span>
                      <span className="text-purple-300">{contract.stats.rewardMultiplier / 100}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Demo Flow */}
          <div className="glass neon-border p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="text-hologram">🚀 Contract Functions Demo</span>
            </h2>

            {/* Step 1: Receipt Scanning */}
            {demoStep === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4 text-cyan-400">Step 1: Contract Receipt Scanning</h3>
                  <p className="text-gray-300 mb-8 text-lg">
                    Execute the <span className="text-purple-400 font-semibold">scan_receipt</span> function from our Supra smart contract
                  </p>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleDemoReceiptScan}
                    disabled={isScanning || !isConnected}
                    className="btn-futuristic px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg rounded-xl border border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 glow-cyan disabled:opacity-50 disabled:transform-none"
                  >
                    {isScanning ? '📄 Processing Receipt...' : '📄 Scan Receipt ($8.50)'}
                  </button>
                  <p className="text-sm text-gray-300 mt-4">
                    ⚡ Execute smart contract function to mint DROP tokens
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Receipt Processed */}
            {demoStep === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4 text-green-400">✅ Step 2: Receipt Processed Successfully!</h3>
                  <p className="text-gray-300 mb-8 text-lg">
                    Your receipt was processed by the <span className="text-green-400 font-semibold">scan_receipt</span> function. 
                    DROP tokens have been minted to your account!
                  </p>
                </div>

                <div className="glass neon-border rounded-xl p-8 max-w-2xl mx-auto bg-gradient-to-r from-green-900/20 to-cyan-900/20">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🧾→💰</div>
                    <div className="text-2xl font-bold text-hologram">Contract Function Executed</div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass rounded-lg p-4 border border-green-400/30 glow-green">
                      <div className="text-sm text-gray-400 mb-1">Purchase Amount</div>
                      <div className="text-2xl font-bold text-green-400">$8.50</div>
                    </div>
                    
                    <div className="glass rounded-lg p-4 border border-cyan-400/30 glow-cyan">
                      <div className="text-sm text-gray-400 mb-1">DROP Tokens Earned</div>
                      <div className="text-2xl font-bold text-cyan-400">9 DROP</div>
                    </div>
                  </div>

                  <div className="text-center mt-6">
                    <button
                      onClick={handleRedeemReward}
                      className="btn-futuristic px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl border border-purple-400/50 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 glow-purple"
                    >
                      🎁 Redeem Reward (500 DROP)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Reward Redeemed */}
            {demoStep === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4 text-purple-400">🎉 Step 3: Reward Redeemed Successfully!</h3>
                  <p className="text-gray-300 mb-8 text-lg">
                    The <span className="text-purple-400 font-semibold">redeem_reward</span> function burned your 
                    DROP tokens and processed your reward redemption!
                  </p>
                </div>

                <div className="glass neon-border rounded-xl p-8 max-w-2xl mx-auto bg-gradient-to-r from-purple-900/20 to-pink-900/20">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">💰→🎁</div>
                    <div className="text-2xl font-bold text-hologram">Smart Contract Complete</div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => setDemoStep(1)}
                      className="btn-futuristic px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl border border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 glow-cyan"
                    >
                      🔄 Try Again
                    </button>
                  </div>

                  <div className="mt-6 p-4 glass rounded-lg border border-green-400/30 glow-green">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-green-400 font-medium">
                        ✅ All contract functions executed successfully
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contract Info */}
          <div className="glass neon-border p-8 mt-8 rounded-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="text-hologram">🌐 Smart Contract Details</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 text-sm">
              <div>
                <h4 className="font-semibold text-cyan-400 mb-3">Contract Address</h4>
                <div className="space-y-2">
                  <div>Module: <span className="text-cyan-300">dropify::dual_token</span></div>
                  <div>Network: <span className="text-cyan-300">Supra Testnet</span></div>
                  <div>Chain ID: <span className="text-cyan-300">6</span></div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-400 mb-3">Available Functions</h4>
                <div className="space-y-2">
                  <div>📄 <span className="text-purple-300">scan_receipt</span></div>
                  <div>🎁 <span className="text-purple-300">redeem_reward</span></div>
                  <div>📢 <span className="text-purple-300">purchase_advertising</span></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
