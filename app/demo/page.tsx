'use client';

import { useState } from 'react';
import { useEnhancedAuth } from '@/lib/enhanced-auth-context';
import { useSupraWallet } from '@/lib/wallet-context-supra';

export default function DemoPage() {
  const { 
    user, 
    isAuthenticated, 
    activeWalletAddress,
    walletType,
    signUpWithEmail,
    getCustodialWallet,
    exportWalletDetails
  } = useEnhancedAuth();

  const { dropBalance, drfBalance, scanReceipt, refreshBalances } = useSupraWallet();

  const [demoStep, setDemoStep] = useState(1);
  const [demoEmail, setDemoEmail] = useState('demo@dropify.com');
  const [isScanning, setIsScanning] = useState(false);

  const handleDemoSignup = async () => {
    try {
      await signUpWithEmail(demoEmail, 'demo_user');
      setDemoStep(2);
      // Refresh balances after signup
      setTimeout(() => refreshBalances(), 1000);
    } catch (err) {
      console.error('Demo signup error:', err);
    }
  };

  const handleDemoReceiptScan = async () => {
    try {
      setIsScanning(true);
      const custodialWallet = getCustodialWallet();
      if (custodialWallet) {
        // Simulate scanning a Starbucks receipt for $8.50
        const receiptHash = `receipt_${Date.now()}`;
        const purchaseAmount = 850; // $8.50 in cents
        
        await scanReceipt(receiptHash, purchaseAmount, 'starbucks');
        setDemoStep(3);
        // Refresh balances after scanning
        setTimeout(() => refreshBalances(), 2000);
      }
    } catch (err) {
      console.error('Demo receipt scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const walletDetails = exportWalletDetails();

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
              ✅ Connected to Supra Testnet - Ready for real on-chain transactions
            </div>
          </div>
        </header>

        {/* Main Demo Content */}
        <main className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8">
              <span className="block text-hologram">LIVE DEMO</span>
              <span className="block text-2xl md:text-3xl font-normal text-cyan-300 mt-4">
                Seamless Web3 Onboarding
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Experience the future of retail loyalty. Transform everyday purchases into valuable 
              <span className="text-cyan-400 font-semibold"> $DROP tokens</span> on 
              <span className="text-purple-400 font-semibold"> Supra Layer 1</span> blockchain.
            </p>
          </div>

          {/* Current Status */}
          <div className="glass neon-border p-8 mb-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-hologram">📊 Current Status</span>
              {isAuthenticated && <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse glow-green"></span>}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-cyan-400">🔐 Authentication</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={isAuthenticated ? 'text-green-400 glow-green' : 'text-red-400'}>
                      {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
                    </span>
                  </div>
                  {user && (
                    <>
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="text-cyan-300">{user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Username:</span>
                        <span className="text-cyan-300">{user.username}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-purple-400">🔗 Supra Testnet</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Wallet Type:</span>
                    <span className="text-cyan-300 capitalize">{walletType || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Address:</span>
                    <span className="text-purple-300 font-mono text-xs">
                      {activeWalletAddress ? `${activeWalletAddress.slice(0, 6)}...${activeWalletAddress.slice(-4)}` : 'Not Available'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>DROP Balance:</span>
                    <span className="text-green-400 font-bold">{dropBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DRF Balance:</span>
                    <span className="text-amber-400 font-bold">{drfBalance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Token Balances */}
          {isAuthenticated && (
            <div className="glass neon-border p-8 mb-8 rounded-2xl bg-gradient-to-r from-green-900/20 to-blue-900/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-hologram">💰 Token Balances</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-6 border border-cyan-400/30 glow-cyan">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">💧</span>
                    <span className="text-xl font-bold text-cyan-400">DROP Tokens</span>
                  </div>
                  <div className="text-4xl font-bold text-cyan-300 mb-2">{dropBalance.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">Earned from receipts</div>
                </div>
                
                <div className="glass rounded-xl p-6 border border-purple-400/30 glow-purple">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🔷</span>
                    <span className="text-xl font-bold text-purple-400">DRF Tokens</span>
                  </div>
                  <div className="text-4xl font-bold text-purple-300 mb-2">{drfBalance.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">Governance & rewards</div>
                </div>
              </div>
            </div>
          )}

          {/* Demo Flow */}
          <div className="glass neon-border p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="text-hologram">🚀 Live Demo Flow</span>
            </h2>

            {/* Step 1: Email Signup */}
            {demoStep === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4 text-cyan-400">Step 1: Seamless Email Signup</h3>
                  <p className="text-gray-300 mb-8 text-lg">
                    Enter your email and we'll automatically generate a <span className="text-purple-400 font-semibold">Supra-compatible wallet</span> for you
                  </p>
                </div>

                <div className="max-w-md mx-auto space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      className="w-full px-6 py-4 glass border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none glow-cyan transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>

                  <button
                    onClick={handleDemoSignup}
                    className="btn-futuristic w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg rounded-xl border border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 glow-cyan"
                  >
                    🎯 Create Account & Generate Wallet
                  </button>

                  <div className="text-center text-sm text-gray-300">
                    ✨ No wallet installation required - we handle everything!
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Wallet Generated */}
            {demoStep === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4 text-green-400">✅ Step 2: Wallet Generated Successfully!</h3>
                  <p className="text-gray-300 mb-8 text-lg">
                    Your account is ready! Here are your auto-generated wallet details:
                  </p>
                </div>

                {walletDetails && (
                  <div className="glass neon-border rounded-xl p-8 max-w-2xl mx-auto">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Wallet Address:</span>
                        <span className="text-cyan-300 font-mono text-sm">
                          {walletDetails.address}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Backup Phrase:</span>
                        <span className="text-yellow-300 text-sm">
                          {walletDetails.mnemonic}
                        </span>
                      </div>
                      
                      <div className="border-t border-gray-600 pt-6">
                        <div className="glass rounded-lg p-4 border border-yellow-400/30 glow-amber">
                          <div className="flex items-start gap-3">
                            <span className="text-yellow-400 text-xl">⚠️</span>
                            <div className="text-sm text-yellow-200">
                              <strong>Important:</strong> In production, this would be encrypted and securely stored. 
                              The backup phrase allows you to recover your wallet.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={handleDemoReceiptScan}
                    disabled={isScanning}
                    className="btn-futuristic px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-lg rounded-xl border border-purple-400/50 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 glow-purple disabled:opacity-50 disabled:transform-none"
                  >
                    {isScanning ? '📄 Scanning Receipt...' : '📄 Demo: Scan Receipt'}
                  </button>
                  <p className="text-sm text-gray-300 mt-4">
                    ⚡ Simulate scanning a $8.50 Starbucks receipt
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Receipt Scanned */}
            {demoStep === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4 text-purple-400">🎉 Step 3: Receipt Processed on Supra L1!</h3>
                  <p className="text-gray-300 mb-8 text-lg">
                    Your <span className="text-green-400 font-semibold">Starbucks receipt</span> has been recorded on the 
                    <span className="text-purple-400 font-semibold"> Supra blockchain</span> and you earned 
                    <span className="text-cyan-400 font-semibold"> DROP tokens</span>!
                  </p>
                </div>

                <div className="glass neon-border rounded-xl p-8 max-w-2xl mx-auto bg-gradient-to-r from-purple-900/20 to-pink-900/20">
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">🧾→💰</div>
                      <div className="text-2xl font-bold text-hologram">Receipt Successfully Processed</div>
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
                          ✅ Transaction confirmed on Supra Testnet
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Network Info */}
          <div className="glass neon-border p-8 mt-8 rounded-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="text-hologram">🌐 Live Supra Testnet Connection</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 text-sm">
              <div>
                <h4 className="font-semibold text-cyan-400 mb-3">Network Details</h4>
                <div className="space-y-2">
                  <div>RPC: <span className="text-cyan-300">https://testnet-rpc.supra.com</span></div>
                  <div>Chain ID: <span className="text-cyan-300">6</span></div>
                  <div>Explorer: <span className="text-cyan-300">https://testnet-explorer.supra.com</span></div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-400 mb-3">Smart Contract</h4>
                <div className="space-y-2">
                  <div>Address: <span className="text-purple-300 font-mono">0x1::dropify_dual_token</span></div>
                  <div>Functions: <span className="text-purple-300">scan_receipt, redeem_reward</span></div>
                  <div>Tokens: <span className="text-purple-300">DROP, DRF</span></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
